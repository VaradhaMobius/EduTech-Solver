import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InkMark — CBSE Class 12 Maths",
  description:
    "Practice CBSE Class 12 Mathematics by writing like the exam. Handwriting canvas or photo — graded against the official solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} min-h-screen antialiased`}>
        <div className="paper-atmosphere min-h-screen">
          <header className="border-b border-[var(--ink-line)]/70 bg-[var(--paper)]/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
              <Link href="/" className="group flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--ink)] transition group-hover:text-[var(--accent)]">
                  InkMark
                </span>
                <span className="hidden text-sm text-[var(--ink-muted)] sm:inline">
                  write it like the board exam
                </span>
              </Link>
              <nav className="flex items-center gap-4 text-sm text-[var(--ink-soft)]">
                <Link href="/#chapters" className="hover:text-[var(--ink)]">
                  Chapters
                </Link>
                <Link href="/practice/in-01" className="hover:text-[var(--ink)]">
                  Quick practice
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-16 border-t border-[var(--ink-line)]/70 py-8 text-center text-sm text-[var(--ink-muted)]">
            CBSE Class 12 Mathematics · seed question bank · handwriting-first grading
          </footer>
        </div>
      </body>
    </html>
  );
}
