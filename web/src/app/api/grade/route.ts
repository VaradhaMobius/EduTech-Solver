import { NextResponse } from "next/server";
import { getQuestionById } from "@/data/questions";
import { gradeSubmission } from "@/lib/grade";
import { consumeRateLimit, gradeRateLimitConfigs } from "@/lib/rate-limit";
import {
  assertSameOrigin,
  clientIp,
  publicErrorMessage,
  rateLimitHeaders,
  securityHeaders,
  validateImageDataUrl,
  validateQuestionId,
} from "@/lib/security";
import type { SubmissionMode } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const baseHeaders = securityHeaders();

  try {
    if (request.headers.get("content-type")?.includes("application/json") !== true) {
      return NextResponse.json(
        { error: "Content-Type must be application/json." },
        { status: 415, headers: baseHeaders },
      );
    }

    const originBlock = assertSameOrigin(request);
    if (originBlock) {
      for (const [k, v] of Object.entries(baseHeaders)) originBlock.headers.set(k, String(v));
      return originBlock;
    }

    const ip = clientIp(request);
    const limits = gradeRateLimitConfigs();

    const minute = await consumeRateLimit(`grade:min:${ip}`, limits.minute);
    if (!minute.success) {
      return NextResponse.json(
        { error: "Too many grading requests. Please wait a minute and try again." },
        { status: 429, headers: { ...baseHeaders, ...rateLimitHeaders(minute) } },
      );
    }

    const hour = await consumeRateLimit(`grade:hour:${ip}`, limits.hour);
    if (!hour.success) {
      return NextResponse.json(
        { error: "Hourly grading limit reached. Try again later." },
        { status: 429, headers: { ...baseHeaders, ...rateLimitHeaders(hour) } },
      );
    }

    let body: {
      questionId?: unknown;
      imageDataUrl?: unknown;
      mode?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400, headers: baseHeaders },
      );
    }

    const { questionId, imageDataUrl, mode } = body;

    if (!validateQuestionId(questionId)) {
      return NextResponse.json(
        { error: "Invalid questionId." },
        { status: 400, headers: baseHeaders },
      );
    }

    if (mode !== "canvas" && mode !== "photo") {
      return NextResponse.json(
        { error: "mode must be canvas or photo." },
        { status: 400, headers: baseHeaders },
      );
    }

    if (typeof imageDataUrl !== "string") {
      return NextResponse.json(
        { error: "imageDataUrl is required." },
        { status: 400, headers: baseHeaders },
      );
    }

    const imageCheck = validateImageDataUrl(imageDataUrl);
    if (!imageCheck.ok) {
      return NextResponse.json(
        { error: imageCheck.error },
        { status: imageCheck.status, headers: baseHeaders },
      );
    }

    const question = getQuestionById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: "Question not found." },
        { status: 404, headers: baseHeaders },
      );
    }

    const result = await gradeSubmission({
      question,
      imageDataUrl,
      mode: mode as SubmissionMode,
    });

    return NextResponse.json(result, {
      headers: {
        ...baseHeaders,
        "X-RateLimit-Limit": String(limits.minute.limit),
        "X-RateLimit-Remaining": String(minute.remaining),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("grade error", err);
    return NextResponse.json(
      { error: publicErrorMessage(err) },
      { status: 500, headers: baseHeaders },
    );
  }
}

/** Reject other methods explicitly */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { ...securityHeaders(), Allow: "POST" } },
  );
}
