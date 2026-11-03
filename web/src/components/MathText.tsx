"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

type MathTextTag = "div" | "span" | "p" | "li";

/**
 * Renders mixed prose + math.
 * Supports: $...$, $$...$$, \(...\), \[...\], and bare TeX
 * (e.g. \sin^{-1}(...) or -\pi/6) that graders often return without delimiters.
 */
export function MathText({
  text,
  className = "",
  as: Tag = "div",
}: {
  text: string;
  className?: string;
  as?: MathTextTag;
}) {
  const inline = Tag === "span" || Tag === "li";
  const html = renderMixed(normalizeMathSource(text), inline);
  return (
    <Tag
      className={`math-text leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Unwrap common LLM wrappers and normalize delimiters. */
export function normalizeMathSource(source: string): string {
  let text = source.trim();

  text = text.replace(/^```(?:latex|tex|math)?\s*/i, "").replace(/\s*```$/i, "");

  text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex: string) => `$${tex.trim()}$`);
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, tex: string) => `$$${tex.trim()}$$`);

  if (!text.includes("$") && looksLikeBareTex(text)) {
    const display =
      text.includes("\n") || /\\begin\{|\\\\|\\frac|\\dfrac|\\int|\\sum/.test(text);
    text = display ? `$$${text}$$` : `$${text}$`;
  }

  return text;
}

function looksLikeBareTex(text: string): boolean {
  const t = text.trim();
  if (/^\\[a-zA-Z]/.test(t)) return true;
  if (/\\(sin|cos|tan|frac|dfrac|pi|left|right|begin|end|sqrt|sum|int|lim)/.test(t)) {
    return true;
  }
  // Short math-only fragment: -\pi/6, x^2, etc.
  if (t.length <= 80 && !/\s{2,}|[A-Za-z]{4,}/.test(t.replace(/\\[a-zA-Z]+/g, ""))) {
    if (/\\|[_^{}]/.test(t)) return true;
  }
  return false;
}

function renderMixed(source: string, inline: boolean): string {
  const escaped = source
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const blocks: string[] = [];

  let working = withBold.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => {
    const i = blocks.length;
    blocks.push(renderKatex(unescapeBasic(tex), !inline));
    return `\u0000BLOCK${i}\u0000`;
  });

  working = working.replace(/\$([^$\n]+?)\$/g, (_, tex: string) => {
    const i = blocks.length;
    blocks.push(renderKatex(unescapeBasic(tex), false));
    return `\u0000BLOCK${i}\u0000`;
  });

  // Leftover bare commands inside prose (e.g. ... is \pi/6.)
  working = working.replace(
    /(^|[\s(])(\\[a-zA-Z]+(?:\{[^{}]*\}|\[[^\]]*\]|[0-9a-zA-Z\\^_{}+\-*/()])+)(?=$|[\s).,;:!?])/g,
    (_full, lead: string, tex: string) => {
      const i = blocks.length;
      blocks.push(renderKatex(unescapeBasic(tex), false));
      return `${lead}\u0000BLOCK${i}\u0000`;
    },
  );

  if (!inline) {
    working = working
      .split(/\n\n+/)
      .map((para) => `<p class="mb-2 last:mb-0">${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  } else {
    working = working.replace(/\n/g, "<br/>");
  }

  return working.replace(/\u0000BLOCK(\d+)\u0000/g, (_, i: string) => blocks[Number(i)] ?? "");
}

function unescapeBasic(tex: string): string {
  return tex
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      trust: false,
    });
  } catch {
    return `<code class="font-mono text-sm">${tex}</code>`;
  }
}
