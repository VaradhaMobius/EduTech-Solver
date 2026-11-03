"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Stroke = Point[];

export function HandwritingCanvas({
  onChange,
  className = "",
}: {
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const drawing = useRef(false);
  const current = useRef<Stroke>([]);

  const redraw = useCallback((all: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.fillStyle = "#f7f3ea";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // faint ruling lines like an answer booklet
    ctx.strokeStyle = "rgba(45, 74, 110, 0.08)";
    ctx.lineWidth = 1;
    for (let y = 36; y < rect.height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(rect.width - 16, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(180, 70, 60, 0.18)";
    ctx.beginPath();
    ctx.moveTo(56, 12);
    ctx.lineTo(56, rect.height - 12);
    ctx.stroke();

    ctx.strokeStyle = "#1a2744";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of all) {
      if (stroke.length < 2) {
        if (stroke[0]) {
          ctx.beginPath();
          ctx.arc(stroke[0].x, stroke[0].y, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = "#1a2744";
          ctx.fill();
        }
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    redraw(strokes);
    if (strokes.length === 0) {
      onChange(null);
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  }, [strokes, redraw, onChange]);

  useEffect(() => {
    const onResize = () => redraw(strokes);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [redraw, strokes]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    current.current = [pointFromEvent(e)];
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    current.current.push(pointFromEvent(e));
    redraw([...strokes, current.current]);
  };

  const endStroke = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (current.current.length > 0) {
      setStrokes((prev) => [...prev, current.current]);
    }
    current.current = [];
  };

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--ink-muted)]">
          Write as you would in the exam. Stylus recommended; finger works too.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStrokes((s) => s.slice(0, -1))}
            disabled={strokes.length === 0}
            className="rounded-md border border-[var(--ink-line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink)] transition hover:bg-white disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => setStrokes([])}
            disabled={strokes.length === 0}
            className="rounded-md border border-[var(--ink-line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink)] transition hover:bg-white disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[420px] w-full touch-none rounded-md border border-[var(--ink-line)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        onPointerLeave={endStroke}
      />
    </div>
  );
}
