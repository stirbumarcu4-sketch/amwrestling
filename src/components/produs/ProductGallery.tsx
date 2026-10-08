"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  imagini,
  nume,
}: {
  imagini: string[];
  nume: string;
}) {
  const [activa, setActiva] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-chalk-200 bg-chalk-100">
        <Image
          src={imagini[activa]}
          alt={`${nume} — imagine ${activa + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
      </div>

      {imagini.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-3">
          {imagini.map((imagine, index) => (
            <li key={imagine}>
              <button
                type="button"
                onClick={() => setActiva(index)}
                aria-label={`Arată imaginea ${index + 1}`}
                aria-current={index === activa}
                className={cn(
                  "relative block h-20 w-20 overflow-hidden border bg-chalk-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
                  index === activa
                    ? "border-ink-900"
                    : "border-chalk-200 hover:border-steel-400",
                )}
              >
                <Image
                  src={imagine}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
