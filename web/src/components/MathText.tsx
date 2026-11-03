"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Renders markdown-ish text with $inline$ and $$block$$ LaTeX via KaTeX.
 * Supports simple **bold** markers used in solutions.
 */
export function MathText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const html = renderMixed(text);
  return (
    <div
      className={`math-text leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderMixed(source: string): string {
  const escaped = source
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const blocks: string[] = [];
  let working = withBold.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => {
    const i = blocks.length;
    blocks.push(renderKatex(tex, true));
    return `\u0000BLOCK${i}\u0000`;
  });

  working = working.replace(/\$([^$\n]+?)\$/g, (_, tex: string) => {
    const i = blocks.length;
    blocks.push(renderKatex(tex, false));
    return `\u0000BLOCK${i}\u0000`;
  });

  working = working
    .split(/\n\n+/)
    .map((para) => `<p class="mb-3 last:mb-0">${para.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return working.replace(/\u0000BLOCK(\d+)\u0000/g, (_, i: string) => blocks[Number(i)] ?? "");
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      strict: "ignore",
    });
  } catch {
    return `<code>${tex}</code>`;
  }
}
