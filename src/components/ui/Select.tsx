"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<"select">, "id"> & {
  eticheta: string;
  eroare?: string;
  children: ReactNode;
};

export default function Select({
  eticheta,
  eroare,
  className,
  required,
  children,
  ...rest
}: Props) {
  const id = useId();
  const idEroare = `${id}-eroare`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-eticheta text-ink-700">
        {eticheta}
        {required ? <span className="text-rust-600"> *</span> : null}
      </label>
      <select
        id={id}
        required={required}
        aria-invalid={eroare ? true : undefined}
        aria-describedby={eroare ? idEroare : undefined}
        className={cn(
          "h-11 w-full rounded-[var(--radius-sm)] border bg-suprafata px-3 text-base text-ink-700",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
          eroare ? "border-rust-600" : "border-steel-300",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {eroare ? (
        <p id={idEroare} className="text-sm text-rust-600">
          {eroare}
        </p>
      ) : null}
    </div>
  );
}
