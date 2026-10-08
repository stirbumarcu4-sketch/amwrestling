import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Lățime maximă 1240px, padding lateral 20px pe mobil și 32px de la 1024px. */
export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-5 lg:px-8", className)}>
      {children}
    </div>
  );
}
