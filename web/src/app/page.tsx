import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";
import { QUESTIONS } from "@/data/questions";

export default function HomePage() {
  const counts = Object.fromEntries(
    CHAPTERS.map((c) => [c.id, QUESTIONS.filter((q) => q.chapterId === c.id).length]),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <section className="relative overflow-hidden pb-8 pt-6">
        <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 opacity-30">
          <svg viewBox="0 0 200 200" fill="none" aria-hidden className="h-full w-full">
            <path
              className="hero-ink-path"
              d="M20 150 C60 40, 110 170, 160 70"
              stroke="#14233a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="animate-fade-up font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          CBSE Class 12 · Maths
        </p>
        <h1 className="animate-fade-up-delay mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl">
          InkMark
        </h1>
        <p className="animate-fade-up-delay2 mt-3 max-w-md text-base text-[var(--ink-soft)]">
          Write answers with your finger — or snap your notebook. We mark your handwriting
          against the official solution.
        </p>
        <div className="animate-fade-up-delay2 mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/#chapters"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--paper)]"
          >
            Browse chapters
          </Link>
          <Link
            href="/practice/in-01"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--ink-line)] bg-white/70 px-5 text-sm font-semibold text-[var(--ink)]"
          >
            Try an integrals question
          </Link>
        </div>
      </section>

      <section id="chapters" className="pb-8 pt-2">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Question bank
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Tap a chapter, then practice on the answer sheet.
        </p>

        <ul className="mt-5 divide-y divide-[var(--ink-line)]">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/chapter/${chapter.id}`}
                className="flex min-h-14 items-center justify-between gap-3 py-3 active:bg-white/40"
              >
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                    {chapter.name}
                  </h3>
                  <p className="mt-0.5 truncate text-sm text-[var(--ink-muted)]">
                    {chapter.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-[var(--ink-muted)]">
                  {counts[chapter.id]} Q →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
