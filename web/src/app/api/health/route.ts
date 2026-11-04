import { NextResponse } from "next/server";
import { isOpenAIConfigured } from "@/lib/env";
import { securityHeaders } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public readiness probe. Does not expose secret values.
 * Use this after setting Vercel env vars to confirm Production sees OPENAI_API_KEY.
 */
export async function GET() {
  const openaiConfigured = isOpenAIConfigured();
  return NextResponse.json(
    {
      ok: true,
      openaiConfigured,
      grading: openaiConfigured ? "live" : "demo",
      hint: openaiConfigured
        ? undefined
        : "Set OPENAI_API_KEY for Production in Vercel, then Redeploy.",
    },
    {
      headers: {
        ...securityHeaders(),
        "Cache-Control": "no-store",
      },
    },
  );
}
