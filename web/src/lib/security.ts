import { NextResponse } from "next/server";

const ALLOWED_IMAGE_MIMES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

/** Max data-URL length (~3MB binary after base64 overhead). */
export const MAX_IMAGE_DATA_URL_LENGTH = 4_000_000;

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

/**
 * In production, require same-origin browser calls (Origin or Referer).
 * Allows server-to-server only when GRADE_ALLOW_NO_ORIGIN=1 (not recommended).
 */
export function assertSameOrigin(request: Request): NextResponse | null {
  if (process.env.NODE_ENV !== "production") return null;
  if (process.env.GRADE_ALLOW_NO_ORIGIN === "1") return null;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  if (!host) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const allowedHosts = new Set<string>([host.toLowerCase()]);
  const extra = process.env.GRADE_ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean);
  for (const item of extra ?? []) {
    try {
      allowedHosts.add(new URL(item).host.toLowerCase());
    } catch {
      allowedHosts.add(item.toLowerCase());
    }
  }

  const candidate = origin || referer;
  if (!candidate) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const url = new URL(candidate);
    if (!allowedHosts.has(url.host.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return null;
}

export function validateImageDataUrl(imageDataUrl: string): { ok: true } | { ok: false; error: string; status: number } {
  if (typeof imageDataUrl !== "string") {
    return { ok: false, error: "Invalid image payload.", status: 400 };
  }
  if (imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
    return {
      ok: false,
      error: "Image is too large. Please use a smaller photo or clearer crop.",
      status: 413,
    };
  }

  const match = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/i.exec(imageDataUrl);
  if (!match) {
    return { ok: false, error: "imageDataUrl must be a base64 data:image URL.", status: 400 };
  }

  const mime = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  if (!ALLOWED_IMAGE_MIMES.has(mime)) {
    return { ok: false, error: "Only PNG, JPEG, or WebP images are allowed.", status: 415 };
  }

  const b64 = match[2].replace(/\s+/g, "");
  if (b64.length < 32) {
    return { ok: false, error: "Image payload is empty or too small.", status: 400 };
  }
  // Reject clearly truncated/non-base64 junk early
  if (!/^[A-Za-z0-9+/]+=*$/.test(b64.slice(0, 200))) {
    return { ok: false, error: "Image payload is not valid base64.", status: 400 };
  }

  return { ok: true };
}

export function validateQuestionId(questionId: unknown): questionId is string {
  return typeof questionId === "string" && /^[a-z0-9][a-z0-9-]{0,63}$/i.test(questionId);
}

export function publicErrorMessage(err: unknown): string {
  if (process.env.NODE_ENV !== "production") {
    return err instanceof Error ? err.message : "Grading failed.";
  }
  return "Grading failed. Please try again in a moment.";
}

export function rateLimitHeaders(result: {
  limit: number;
  remaining: number;
  resetMs: number;
}): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
    "Retry-After": String(Math.max(1, Math.ceil(result.resetMs / 1000))),
  };
}

export function securityHeaders(): HeadersInit {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(self), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cross-Origin-Opener-Policy": "same-origin",
  };
}
