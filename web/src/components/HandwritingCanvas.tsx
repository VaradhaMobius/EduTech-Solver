"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const strokesRef = useRef<Stroke[]>([]);
  const [strokeCount, setStrokeCount] = useState(0);
  const drawing = useRef(false);
  const current = useRef<Stroke>([]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }, []);

  const redraw = useCallback(
    (all: Stroke[]) => {
      const sized = syncCanvasSize();
      if (!sized) return;
      const { ctx, width, height } = sized;

      ctx.fillStyle = "#f7f3ea";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(45, 74, 110, 0.08)";
      ctx.lineWidth = 1;
      for (let y = 36; y < height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(16, y);
        ctx.lineTo(width - 16, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(180, 70, 60, 0.18)";
      ctx.beginPath();
      ctx.moveTo(48, 12);
      ctx.lineTo(48, height - 12);
      ctx.stroke();

      ctx.strokeStyle = "#1a2744";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const stroke of all) {
        if (stroke.length < 2) {
          if (stroke[0]) {
            ctx.beginPath();
            ctx.arc(stroke[0].x, stroke[0].y, 1.2, 0, Math.PI * 2);
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
    },
    [syncCanvasSize],
  );

  const emitImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || strokesRef.current.length === 0) {
      onChangeRef.current(null);
      return;
    }
    onChangeRef.current(canvas.toDataURL("image/png"));
  }, []);

  useLayoutEffect(() => {
    redraw(strokesRef.current);
    emitImage();
  }, [redraw, emitImage, strokeCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      redraw(strokesRef.current);
      emitImage();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [redraw, emitImage]);

  const pointFromEvent = (e: PointerEvent | React.PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      // Only primary button / touch / pen
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawing.current = true;
      current.current = [pointFromEvent(e)];
      redraw([...strokesRef.current, current.current]);
    };

    const onMove = (e: PointerEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      current.current.push(pointFromEvent(e));
      redraw([...strokesRef.current, current.current]);
    };

    const endStroke = (e: PointerEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      drawing.current = false;
      if (current.current.length > 0) {
        strokesRef.current = [...strokesRef.current, current.current];
        setStrokeCount(strokesRef.current.length);
      }
      current.current = [];
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", endStroke, { passive: false });
    canvas.addEventListener("pointercancel", endStroke, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", endStroke);
      canvas.removeEventListener("pointercancel", endStroke);
    };
  }, [redraw]);

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
  };

  const clear = () => {
    strokesRef.current = [];
    setStrokeCount(0);
  };

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs text-[var(--ink-muted)] sm:text-sm">
          Write with finger or stylus — keep the phone sideways if helpful.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={strokeCount === 0}
            className="min-h-11 rounded-md border border-[var(--ink-line)] bg-white/80 px-3 text-sm text-[var(--ink)] disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={strokeCount === 0}
            className="min-h-11 rounded-md border border-[var(--ink-line)] bg-white/80 px-3 text-sm text-[var(--ink)] disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[min(58vh,520px)] w-full touch-none overscroll-none rounded-md border border-[var(--ink-line)] bg-[#f7f3ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        style={{ touchAction: "none" }}
        aria-label="Handwriting answer sheet"
      />
      {strokeCount > 0 && (
        <p className="mt-2 text-xs text-[var(--ink-muted)]">{strokeCount} stroke(s)</p>
      )}
    </div>
  );
}
