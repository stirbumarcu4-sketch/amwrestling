"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

// Browserele refuză pornirea automată a unui videoclip cu sunet, așa că pleacă
// mut — ca pe Instagram — iar butonul din colț îi dă sunetul când vrea
// vizitatorul. Clic pe imagine pune pauză.
export default function VideoCuSunet({
  src,
  poster,
  descriere,
  raport = "480/878",
}: {
  src: string;
  poster: string;
  /** Pentru cititoarele de ecran: ce se vede în clip. */
  descriere: string;
  /** Raportul laturilor fișierului, ca pagina să nu sară la încărcare. */
  raport?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [cuSunet, setCuSunet] = useState(false);
  const [ruleaza, setRuleaza] = useState(true);

  function comutaSunetul() {
    const v = video.current;
    if (!v) return;
    v.muted = cuSunet;
    setCuSunet(!cuSunet);
    // Pornirea sunetului pe un clip pus pe pauză ar fi derutantă.
    if (v.paused) {
      v.play().catch(() => {});
      setRuleaza(true);
    }
  }

  function comutaRedarea() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setRuleaza(true);
    } else {
      v.pause();
      setRuleaza(false);
    }
  }

  const buton =
    "rounded-full bg-ink-900/70 p-2.5 text-chalk-50 backdrop-blur-sm transition-colors hover:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500";

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-sm)] border border-steel-600">
      <video
        ref={video}
        className="w-full object-cover"
        style={{ aspectRatio: raport.replace("/", " / ") }}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onClick={comutaRedarea}
        onPlay={() => setRuleaza(true)}
        onPause={() => setRuleaza(false)}
        aria-label={descriere}
      />

      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={comutaRedarea}
          className={buton}
          aria-label={ruleaza ? "Pune pauză" : "Pornește clipul"}
        >
          {ruleaza ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          type="button"
          onClick={comutaSunetul}
          className={buton}
          aria-label={cuSunet ? "Oprește sunetul" : "Pornește sunetul"}
        >
          {cuSunet ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </div>
  );
}
