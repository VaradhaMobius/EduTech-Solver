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
    <div className="px-4 py-10 md:px-6">
      <div className="mx-auto mb-6 max-w-6xl">
        <Link
          href={`/chapter/${question.chapterId}`}
          className="text-sm text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
        >
          ← {chapter?.name ?? "Chapter"}
        </Link>
      </div>
      <PracticeWorkspace
        question={question}
        chapterName={chapter?.shortName ?? "Mathematics"}
      />
    </div>
  );
}
