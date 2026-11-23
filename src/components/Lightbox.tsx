"use client";

import { useState, useEffect } from "react";

export function Lightbox({
  images,
  cellClassName = "block w-full h-full cursor-zoom-in",
}: {
  images: { url: string; caption?: string }[];
  cellClassName?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  return (
    <>
      {images.map((img, i) => (
        <button
          key={img.url + i}
          onClick={() => setIndex(i)}
          className={cellClassName}
          aria-label={img.caption || "Open image"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" loading="lazy" />
        </button>
      ))}
      {index !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setIndex(null)}>
          <button className="absolute top-5 right-6 text-white text-3xl leading-none" aria-label="Close">&times;</button>
          <button
            className="absolute left-4 text-white text-4xl px-3"
            onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + images.length) % images.length); }}
            aria-label="Previous"
          >
            &lsaquo;
          </button>
          <figure className="max-w-5xl w-full px-14" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[index].url} alt={images[index].caption || ""} className="max-h-[80vh] w-full object-contain" />
            {images[index].caption && (
              <figcaption className="text-white/80 text-center mt-3 text-sm">{images[index].caption}</figcaption>
            )}
          </figure>
          <button
            className="absolute right-4 text-white text-4xl px-3"
            onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % images.length); }}
            aria-label="Next"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </>
  );
}
