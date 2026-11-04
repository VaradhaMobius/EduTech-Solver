/**
 * Sliding-window rate limiter.
 *
 * Default: in-memory (works on a warm Vercel instance; resets on cold start).
 * Optional durable store: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * to use Upstash REST API without extra packages.
 */

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
};

type WindowConfig = {
  /** Max requests in the window */
  limit: number;
  /** Window length in ms */
  windowMs: number;
};

const memoryBuckets = new Map<string, number[]>();

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  return timestamps.filter((t) => t > cutoff);
}

function memoryConsume(key: string, cfg: WindowConfig, now: number): RateLimitResult {
  const timestamps = prune(memoryBuckets.get(key) ?? [], cfg.windowMs, now);
  if (timestamps.length >= cfg.limit) {
    memoryBuckets.set(key, timestamps);
    const oldest = timestamps[0] ?? now;
    return {
      success: false,
      limit: cfg.limit,
      remaining: 0,
      resetMs: Math.max(0, oldest + cfg.windowMs - now),
    };
  }
  timestamps.push(now);
  memoryBuckets.set(key, timestamps);
  // Bound map growth
  if (memoryBuckets.size > 5000) {
    const firstKey = memoryBuckets.keys().next().value;
    if (firstKey) memoryBuckets.delete(firstKey);
  }
  return {
    success: true,
    limit: cfg.limit,
    remaining: Math.max(0, cfg.limit - timestamps.length),
    resetMs: cfg.windowMs,
  };
}

async function upstashConsume(
  key: string,
  cfg: WindowConfig,
  now: number,
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redisKey = `rl:${key}:${cfg.windowMs}`;
  const cutoff = now - cfg.windowMs;

  try {
    // ZREMRANGEBYSCORE + ZADD + ZCARD + PEXPIRE in a pipeline
    const pipeline = [
      ["ZREMRANGEBYSCORE", redisKey, "0", String(cutoff)],
      ["ZADD", redisKey, String(now), `${now}:${Math.random().toString(36).slice(2, 8)}`],
      ["ZCARD", redisKey],
      ["PEXPIRE", redisKey, String(cfg.windowMs)],
    ];

    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipeline),
      signal: AbortSignal.timeout(2500),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown }[];
    const count = Number(data?.[2]?.result ?? 0);

    if (count > cfg.limit) {
      // Best-effort undo of the add we just made
      await fetch(`${url}/zremrangebyscore/${encodeURIComponent(redisKey)}/${now}/${now}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(1500),
      }).catch(() => undefined);

      return {
        success: false,
        limit: cfg.limit,
        remaining: 0,
        resetMs: cfg.windowMs,
      };
    }

    return {
      success: true,
      limit: cfg.limit,
      remaining: Math.max(0, cfg.limit - count),
      resetMs: cfg.windowMs,
    };
  } catch {
    return null;
  }
}

export async function consumeRateLimit(
  key: string,
  cfg: WindowConfig,
): Promise<RateLimitResult> {
  const now = Date.now();
  const durable = await upstashConsume(key, cfg, now);
  if (durable) return durable;
  return memoryConsume(key, cfg, now);
}

export function gradeRateLimitConfigs() {
  const perMinute = Number(process.env.GRADE_RATE_LIMIT_PER_MINUTE ?? 8);
  const perHour = Number(process.env.GRADE_RATE_LIMIT_PER_HOUR ?? 40);
  return {
    minute: {
      limit: Number.isFinite(perMinute) && perMinute > 0 ? perMinute : 8,
      windowMs: 60_000,
    },
    hour: {
      limit: Number.isFinite(perHour) && perHour > 0 ? perHour : 40,
      windowMs: 60 * 60_000,
    },
  };
}
