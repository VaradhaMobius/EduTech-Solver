"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const solutionRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (showSolution) {
      solutionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showSolution]);

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Too many attempts. Please wait a bit and try again.",
          );
        }
        throw new Error(
          typeof data.error === "string" ? data.error : "Grading failed",
        );
      }
      setResult(data as GradeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grading failed");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-28">
      <header>
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {chapterName} · {question.marks} marks · {question.difficulty}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl">
          Answer sheet
        </h1>
        <div className="mt-3 rounded-lg border border-[var(--ink-line)] bg-white/60 p-4">
          <MathText text={question.prompt} className="text-base text-[var(--ink)] sm:text-lg" />
        </div>
      </header>

      <div className="flex gap-1 rounded-lg border border-[var(--ink-line)] bg-[var(--paper-deep)]/70 p-1">
        {(
          [
            ["canvas", "Write"],
            ["photo", "Photo"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => switchMode(id)}
            className={`min-h-11 flex-1 rounded-md px-3 text-sm font-semibold transition ${
              mode === id
                ? "bg-[var(--ink)] text-[var(--paper)] shadow-sm"
                : "text-[var(--ink-soft)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--ink-line)] bg-white/50 p-3 sm:p-4">
        {mode === "canvas" ? (
          <HandwritingCanvas onChange={onCanvasChange} />
        ) : (
          <PhotoUpload onChange={onPhotoChange} />
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--accent)]" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div ref={resultRef}>
          <GradePanel result={result} />
        </div>
      )}

      {showSolution && (
        <section
          ref={solutionRef}
          className="animate-fade-up rounded-lg border border-[var(--ink-line)] bg-[var(--ink)] p-4 text-[var(--paper)] sm:p-5"
        >
          <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.14em] text-[var(--paper-muted)]">
            Official solution
          </p>
          <div className="mt-3 [&_.katex]:text-[var(--paper)]">
            <MathText text={question.solution} className="text-[var(--paper)]" />
          </div>
          <div className="mt-4 border-t border-white/15 pt-3 text-sm text-[var(--paper-muted)]">
            <p className="mb-1">Expected final answer</p>
            <MathText
              text={question.finalAnswer}
              className="text-[var(--paper)] [&_.katex]:text-[var(--paper)]"
            />
          </div>
        </section>
      )}

      {/* Sticky action bar for thumb reach on phones / tablets */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--ink-line)] bg-[var(--paper)]/95 px-3 py-3 backdrop-blur-md safe-bottom">
        <div className="mx-auto flex max-w-3xl gap-2">
          <button
            type="button"
            onClick={() => void submit()}
            disabled={grading || !image}
            className="min-h-12 flex-[1.2] rounded-md bg-[var(--accent)] px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {grading ? "Reading ink…" : image ? "Submit" : "Write first"}
          </button>
          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="min-h-12 flex-1 rounded-md border border-[var(--ink-line)] bg-white px-3 text-sm font-semibold text-[var(--ink)]"
          >
            {showSolution ? "Hide solution" : "Solution"}
          </button>
        </div>
      </div>
    </div>
  );
}
