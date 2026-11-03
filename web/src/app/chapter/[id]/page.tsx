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
    <div className="mx-auto max-w-3xl pb-8">
      <Link
        href="/#chapters"
        className="inline-flex min-h-11 items-center text-sm text-[var(--ink-muted)]"
      >
        ← All chapters
      </Link>

      <header className="mt-2">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {chapter.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{chapter.description}</p>
      </header>

      <ol className="mt-6 space-y-4">
        {questions.map((q, index) => (
          <li
            key={q.id}
            className="rounded-lg border border-[var(--ink-line)] bg-white/50 p-4"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              Q{index + 1} · {q.marks} marks · {q.difficulty}
            </p>
            <div className="mt-2">
              <MathText text={q.prompt} className="text-[var(--ink)]" />
            </div>
            <Link
              href={`/practice/${q.id}`}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[var(--ink)] text-sm font-semibold text-[var(--paper)]"
            >
              Practice this question
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
