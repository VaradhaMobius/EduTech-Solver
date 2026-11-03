"use client";

import type { GradeResult } from "@/lib/types";
import { MathText } from "@/components/MathText";

export function GradePanel({ result }: { result: GradeResult }) {
  const pct = result.maxScore > 0 ? result.score / result.maxScore : 0;

  return (
    <section className="rounded-lg border border-[var(--ink-line)] bg-white/55 p-4 backdrop-blur-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Examiner feedback
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--ink)] sm:text-2xl">
            {result.usedMockGrader
              ? "Demo mode"
              : result.isCorrect
                ? "Looks correct"
                : pct > 0
                  ? "Partial credit"
                  : "Needs work"}
          </h2>
        </div>
        <div className="text-right">
          <p className="font-[family-name:var(--font-display)] text-3xl tabular-nums text-[var(--ink)]">
            {result.score}
            <span className="text-lg text-[var(--ink-muted)]">/{result.maxScore}</span>
          </p>
          {!result.usedMockGrader && (
            <p className="text-xs text-[var(--ink-muted)]">
              Confidence {Math.round(result.confidence * 100)}%
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--paper-deep)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
          style={{ width: `${Math.round(pct * 100)}%` }}
        />
      </div>

      <MathText
        text={result.feedback}
        className="mt-4 font-[family-name:var(--font-body)] text-[var(--ink)]"
      />

      {result.transcription && (
        <div className="mt-4 border-t border-[var(--ink-line)] pt-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            What we read
          </p>
          <MathText
            text={result.transcription}
            className="text-base text-[var(--ink)] [&_.katex]:text-[1.05em]"
          />
        </div>
      )}

      {result.stepNotes.length > 0 && (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--ink-soft)]">
          {result.stepNotes.map((note, index) => (
            <li key={`${index}-${note.slice(0, 24)}`}>
              <MathText text={note} as="span" className="text-[var(--ink-soft)]" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
