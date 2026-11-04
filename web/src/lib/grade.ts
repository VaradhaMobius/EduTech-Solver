import OpenAI from "openai";
import type { GradeResult, Question, SubmissionMode } from "@/lib/types";

const SYSTEM_PROMPT = `You are an expert CBSE Class 12 Mathematics examiner.
You receive a question, the official final answer / worked solution, and an image of a student's handwritten attempt (digital ink or photo of paper).

Tasks:
1. Transcribe the student's work into clear math (LaTeX where helpful).
2. Decide if the student has answered correctly (final answer and/or valid method as appropriate for CBSE marking).
3. Award a score out of the question's max marks (partial credit allowed for correct steps with arithmetic slips).
4. Give brief, constructive feedback and step notes.

Respond ONLY with valid JSON matching this schema:
{
  "isCorrect": boolean,
  "confidence": number,       // 0 to 1
  "score": number,            // 0 to maxScore
  "transcription": string,
  "feedback": string,
  "stepNotes": string[]
}`;

export async function gradeSubmission(params: {
  question: Question;
  imageDataUrl: string;
  mode: SubmissionMode;
}): Promise<GradeResult> {
  const { question, imageDataUrl, mode } = params;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return mockGrade(question, mode);
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_VISION_MODEL || "gpt-4o";

  const userText = `Question (${question.marks} marks, CBSE Class 12):
${question.prompt}

Official final answer:
${question.finalAnswer}

Official worked solution:
${question.solution}

Submission mode: ${mode === "canvas" ? "digital handwriting canvas" : "photo of handwritten paper"}.

Grade the student's handwritten work in the image.`;

  const timeoutMs = Number(process.env.GRADE_TIMEOUT_MS ?? 45_000);

  let response;
  try {
    response = await client.chat.completions.create(
      {
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_tokens: 1200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              {
                type: "image_url",
                image_url: { url: imageDataUrl, detail: "low" },
              },
            ],
          },
        ],
      },
      { timeout: Number.isFinite(timeoutMs) ? timeoutMs : 45_000 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : "";
    const name = err instanceof Error ? err.name : "";
    if (
      name === "TimeoutError" ||
      name === "AbortError" ||
      message.includes("timeout") ||
      message.includes("timed out")
    ) {
      throw new Error("Grading timed out. Please try again with a clearer crop.");
    }
    throw new Error("Upstream grading service unavailable.");
  }

  const raw = response.choices[0]?.message?.content ?? "{}";
  let parsed: Partial<GradeResult>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      isCorrect: false,
      confidence: 0.2,
      score: 0,
      transcription: "",
      feedback: "Could not parse the grading response. Please try again.",
      stepNotes: [],
    };
  }

  const score = clampNumber(parsed.score ?? 0, 0, question.marks);

  return {
    isCorrect: Boolean(parsed.isCorrect),
    confidence: clampNumber(parsed.confidence ?? 0.5, 0, 1),
    score,
    maxScore: question.marks,
    transcription: truncate(String(parsed.transcription ?? ""), 4000),
    feedback: truncate(String(parsed.feedback ?? ""), 2000),
    stepNotes: Array.isArray(parsed.stepNotes)
      ? parsed.stepNotes.map((n) => truncate(String(n), 500)).slice(0, 12)
      : [],
    usedMockGrader: false,
  };
}

function mockGrade(question: Question, mode: SubmissionMode): GradeResult {
  return {
    isCorrect: false,
    confidence: 0,
    score: 0,
    maxScore: question.marks,
    transcription:
      "(Demo mode) Set OPENAI_API_KEY to enable vision grading of your handwriting.",
    feedback: `Your ${mode} submission was saved for review. Without an API key, auto-grading is disabled — you can still reveal the official solution and self-check.`,
    stepNotes: [
      "Set OPENAI_API_KEY in Vercel Environment Variables (or web/.env.local locally)",
      "Optional: set OPENAI_VISION_MODEL (default gpt-4o)",
      "Re-submit the same image to get a live grade",
    ],
    usedMockGrader: true,
  };
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}
