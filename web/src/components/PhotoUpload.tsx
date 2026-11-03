"use client";

import { useRef, useState } from "react";

export function PhotoUpload({
  onChange,
  className = "",
}: {
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image (JPG, PNG, or HEIC converted to JPG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB.");
      return;
    }

    const dataUrl = await readAsDataUrl(file);
    const resized = await resizeImage(dataUrl, 1600);
    setPreview(resized);
    onChange(resized);
  };

  return (
    <div className={className}>
      <p className="mb-3 font-[family-name:var(--font-body)] text-sm text-[var(--ink-muted)]">
        Photograph your notebook work in good light. Crop to the answer area if you can.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
        >
          Choose photo
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded-md border border-[var(--ink-line)] bg-white/70 px-4 py-2 text-sm text-[var(--ink)]"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="mt-3 text-sm text-[var(--accent)]" role="alert">
          {error}
        </p>
      )}

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Uploaded handwritten answer"
          className="mt-4 max-h-[420px] w-full rounded-md border border-[var(--ink-line)] object-contain bg-[var(--paper-deep)]"
        />
      )}
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function resizeImage(dataUrl: string, maxEdge: number): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  if (scale === 1) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.88);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
