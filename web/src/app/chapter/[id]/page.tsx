import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTERS } from "@/data/chapters";
import { getQuestionsByChapter } from "@/data/questions";
import { MathText } from "@/components/MathText";
import type { ChapterId } from "@/lib/types";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = CHAPTERS.find((c) => c.id === id);
  if (!chapter) notFound();

  const questions = getQuestionsByChapter(id as ChapterId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <Link
        href="/#chapters"
        className="text-sm text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
      >
        ← All chapters
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)] md:text-5xl">
          {chapter.name}
        </h1>
        <p className="mt-3 text-[var(--ink-muted)]">{chapter.description}</p>
      </header>

      <ol className="mt-10 space-y-6">
        {questions.map((q, index) => (
          <li
            key={q.id}
            className="border-t border-[var(--ink-line)] pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                  Q{index + 1} · {q.marks} marks · {q.difficulty}
                </p>
                <div className="mt-2">
                  <MathText text={q.prompt} className="text-[var(--ink)]" />
                </div>
              </div>
              <Link
                href={`/practice/${q.id}`}
                className="shrink-0 rounded-md bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
              >
                Practice
              </Link>
            </div>
          </li>
        ))}
      </ol>

      {questions.length === 0 && (
        <p className="mt-8 text-[var(--ink-muted)]">No questions in this chapter yet.</p>
      )}
    </div>
  );
}
