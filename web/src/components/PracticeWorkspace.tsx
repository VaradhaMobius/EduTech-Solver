"use client";

import { useCallback, useState } from "react";
import type { GradeResult, Question, SubmissionMode } from "@/lib/types";
import { MathText } from "@/components/MathText";
import { HandwritingCanvas } from "@/components/HandwritingCanvas";
import { PhotoUpload } from "@/components/PhotoUpload";
import { GradePanel } from "@/components/GradePanel";

export function PracticeWorkspace({
  question,
  chapterName,
}: {
  question: Question;
  chapterName: string;
}) {
  const [mode, setMode] = useState<SubmissionMode>("canvas");
  const [image, setImage] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const onCanvasChange = useCallback((dataUrl: string | null) => {
    setImage(dataUrl);
  }, []);

  const onPhotoChange = useCallback((dataUrl: string | null) => {
    setImage(dataUrl);
  }, []);

  const switchMode = (next: SubmissionMode) => {
    setMode(next);
    setImage(null);
    setResult(null);
    setError(null);
  };

  const submit = async () => {
    if (!image) {
      setError("Add your handwritten answer before submitting.");
      return;
    }
    setGrading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          imageDataUrl: image,
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Grading failed");
      }
      setResult(data as GradeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grading failed");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-5">
        <header className="animate-fade-up">
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.16em] text-[var(--accent)]">
            {chapterName} · {question.marks} marks · {question.difficulty}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            Answer sheet
          </h1>
          <div className="mt-5 rounded-lg border border-[var(--ink-line)] bg-white/50 p-5">
            <MathText text={question.prompt} className="text-lg text-[var(--ink)]" />
          </div>
        </header>

        <div className="animate-fade-up-delay flex gap-1 rounded-lg border border-[var(--ink-line)] bg-[var(--paper-deep)]/60 p-1">
          {(
            [
              ["canvas", "Write on canvas"],
              ["photo", "Upload / photo"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchMode(id)}
              className={`flex-1 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                mode === id
                  ? "bg-[var(--ink)] text-[var(--paper)] shadow-sm"
                  : "text-[var(--ink-soft)] hover:bg-white/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="animate-fade-up-delay2 rounded-lg border border-[var(--ink-line)] bg-white/40 p-4">
          {mode === "canvas" ? (
            <HandwritingCanvas onChange={onCanvasChange} />
          ) : (
            <PhotoUpload onChange={onPhotoChange} />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void submit()}
            disabled={grading || !image}
            className="min-w-[11.5rem] rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {grading ? "Reading ink…" : "Submit for grading"}
          </button>
          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="rounded-md border border-[var(--ink-line)] bg-white/70 px-5 py-2.5 text-sm font-medium text-[var(--ink)]"
          >
            {showSolution ? "Hide solution" : "Show official solution"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-[var(--accent)]" role="alert">
            {error}
          </p>
        )}
      </section>

      <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
        {result ? (
          <div className="animate-fade-up">
            <GradePanel result={result} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--ink-line)] bg-white/30 p-6 text-sm text-[var(--ink-muted)]">
            Submit your handwritten work to get a score, transcription, and examiner-style
            notes. You can always peek at the official solution when you are stuck.
          </div>
        )}

        {showSolution && (
          <section className="animate-fade-up rounded-lg border border-[var(--ink-line)] bg-[var(--ink)] p-5 text-[var(--paper)]">
            <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.14em] text-[var(--paper-muted)]">
              Official solution
            </p>
            <div className="mt-3 [&_.katex]:text-[var(--paper)]">
              <MathText text={question.solution} className="text-[var(--paper)]" />
            </div>
            <p className="mt-4 border-t border-white/15 pt-3 text-sm text-[var(--paper-muted)]">
              Expected final answer:{" "}
              <span className="text-[var(--paper)]">{question.finalAnswer}</span>
            </p>
          </section>
        )}
      </aside>
    </div>
  );
}
