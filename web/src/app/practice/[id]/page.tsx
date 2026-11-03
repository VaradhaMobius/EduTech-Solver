import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTERS } from "@/data/chapters";
import { getQuestionById, QUESTIONS } from "@/data/questions";
import { PracticeWorkspace } from "@/components/PracticeWorkspace";

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ id: q.id }));
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = getQuestionById(id);
  if (!question) notFound();

  const chapter = CHAPTERS.find((c) => c.id === question.chapterId);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/chapter/${question.chapterId}`}
        className="inline-flex min-h-11 items-center text-sm text-[var(--ink-muted)]"
      >
        ← {chapter?.shortName ?? "Chapter"}
      </Link>
      <div className="mt-1">
        <PracticeWorkspace
          question={question}
          chapterName={chapter?.shortName ?? "Mathematics"}
        />
      </div>
    </div>
  );
}
