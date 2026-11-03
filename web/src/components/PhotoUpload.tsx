"use client";

import { useRef, useState } from "react";

export function PhotoUpload({
  onChange,
  className = "",
}: {
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Some mobile browsers omit MIME for camera captures
    const looksImage =
      file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    if (!looksImage && file.type !== "") {
      setError("Please choose a photo (JPG or PNG).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Image must be under 12 MB.");
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const resized = await resizeImage(dataUrl, 1600);
      setPreview(resized);
      onChange(resized);
    } catch {
      setError("Could not read that photo. Try another image.");
      setPreview(null);
      onChange(null);
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    if (cameraRef.current) cameraRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  };

  return (
    <div className={className}>
      <p className="mb-3 text-sm text-[var(--ink-muted)]">
        Snap your notebook page in good light, or pick a photo from your gallery.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={busy}
          className="min-h-12 rounded-md bg-[var(--ink)] px-3 text-sm font-semibold text-[var(--paper)] disabled:opacity-50"
        >
          Take photo
        </button>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={busy}
          className="min-h-12 rounded-md border border-[var(--ink-line)] bg-white/80 px-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
        >
          From gallery
        </button>
      </div>

      {preview && (
        <button
          type="button"
          onClick={clear}
          className="mt-2 min-h-11 w-full rounded-md border border-[var(--ink-line)] bg-white/70 text-sm text-[var(--ink)]"
        >
          Remove photo
        </button>
      )}

      {/* Camera — capture attribute nudges mobile browsers to open camera */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {/* Gallery — no capture so the library picker opens */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {busy && <p className="mt-3 text-sm text-[var(--ink-muted)]">Preparing photo…</p>}

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
          className="mt-4 max-h-[50vh] w-full rounded-md border border-[var(--ink-line)] object-contain bg-[var(--paper-deep)]"
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
