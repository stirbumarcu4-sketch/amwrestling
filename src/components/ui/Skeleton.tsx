import { cn } from "@/lib/utils";

/**
 * Folosit exclusiv pentru starea de dinaintea hidratării coșului și a
 * favoritelor — date care chiar nu sunt disponibile la randarea pe server.
 */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rounded-[var(--radius-sm)] bg-chalk-200", className)}
    />
  );
}
