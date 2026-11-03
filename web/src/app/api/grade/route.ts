import { NextResponse } from "next/server";
import { getQuestionById } from "@/data/questions";
import { gradeSubmission } from "@/lib/grade";
import type { SubmissionMode } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      questionId?: string;
      imageDataUrl?: string;
      mode?: SubmissionMode;
    };

    const { questionId, imageDataUrl, mode } = body;

    if (!questionId || !imageDataUrl || (mode !== "canvas" && mode !== "photo")) {
      return NextResponse.json(
        { error: "questionId, imageDataUrl, and mode are required." },
        { status: 400 },
      );
    }

    if (!imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "imageDataUrl must be a data:image URL." },
        { status: 400 },
      );
    }

    // Rough size guard (~7MB base64 payload)
    if (imageDataUrl.length > 10_000_000) {
      return NextResponse.json(
        { error: "Image is too large. Please resize and try again." },
        { status: 413 },
      );
    }

    const question = getQuestionById(questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    const result = await gradeSubmission({ question, imageDataUrl, mode });
    return NextResponse.json(result);
  } catch (err) {
    console.error("grade error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Grading failed." },
      { status: 500 },
    );
  }
}
