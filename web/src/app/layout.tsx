import type { Metadata, Viewport } from "next";
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
  appleWebApp: {
    capable: true,
    title: "InkMark",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#e8eef4",
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
          <header className="sticky top-0 z-30 border-b border-[var(--ink-line)]/70 bg-[var(--paper)]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
              <Link href="/" className="min-h-11 flex items-center">
                <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--ink)]">
                  InkMark
                </span>
              </Link>
              <nav className="flex items-center gap-1 text-sm font-medium text-[var(--ink-soft)]">
                <Link
                  href="/#chapters"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md px-3"
                >
                  Chapters
                </Link>
                <Link
                  href="/practice/in-01"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md bg-[var(--ink)] px-3 text-[var(--paper)]"
                >
                  Practice
                </Link>
              </nav>
            </div>
          </header>
          <main className="px-4 py-5">{children}</main>
          <footer className="border-t border-[var(--ink-line)]/70 px-4 py-6 pb-10 text-center text-xs text-[var(--ink-muted)]">
            CBSE Class 12 Maths · write like the board exam
          </footer>
        </div>
      </body>
    </html>
  );
}
