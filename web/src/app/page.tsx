import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";
import { QUESTIONS } from "@/data/questions";

export default function HomePage() {
  const counts = Object.fromEntries(
    CHAPTERS.map((c) => [c.id, QUESTIONS.filter((q) => q.chapterId === c.id).length]),
  );

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="absolute -right-8 top-8 h-[420px] w-[420px] opacity-40 md:right-8"
            viewBox="0 0 420 420"
            fill="none"
            aria-hidden
          >
            <path
              className="hero-ink-path"
              d="M40 300 C120 80, 220 360, 300 140 S380 80, 400 120"
              stroke="#14233a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="hero-ink-path"
              style={{ animationDelay: "0.25s" }}
              d="M70 340 C150 200, 210 280, 280 220"
              stroke="#c45c26"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>

        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-16 md:px-6">
          <p className="animate-fade-up font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
            CBSE Class 12 · Mathematics
          </p>
          <h1 className="animate-fade-up-delay mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] md:text-7xl">
            InkMark
          </h1>
          <p className="animate-fade-up-delay2 mt-5 max-w-xl text-lg text-[var(--ink-soft)] md:text-xl">
            Solve on a digital answer sheet — or snap your notebook. We read your
            handwriting and mark it against the official solution.
          </p>
          <div className="animate-fade-up-delay2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/#chapters"
              className="rounded-md bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
            >
              Browse chapters
            </Link>
            <Link
              href="/practice/in-01"
              className="rounded-md border border-[var(--ink-line)] bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition hover:bg-white"
            >
              Try an integrals question
            </Link>
          </div>
        </div>
      </section>

      <section id="chapters" className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            Question bank
          </h2>
          <p className="mt-2 text-[var(--ink-muted)]">
            Seed set across the CBSE Class 12 Maths syllabus. Each question includes a
            worked solution you can reveal after attempting.
          </p>
        </div>

        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id} className="border-t border-[var(--ink-line)] pt-4">
              <Link href={`/chapter/${chapter.id}`} className="group block">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)] transition group-hover:text-[var(--accent)]">
                    {chapter.name}
                  </h3>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--ink-muted)]">
                    {counts[chapter.id]} Q
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{chapter.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
