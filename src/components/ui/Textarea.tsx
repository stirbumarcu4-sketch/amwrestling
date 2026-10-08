"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<"textarea">, "id"> & {
  eticheta: string;
  eroare?: string;
};

export default function Textarea({
  eticheta,
  eroare,
  className,
  required,
  rows = 5,
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
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={eroare ? true : undefined}
        aria-describedby={eroare ? idEroare : undefined}
        className={cn(
          "w-full rounded-[var(--radius-sm)] border bg-suprafata p-3 text-base text-ink-700",
          "placeholder:text-steel-400",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
          eroare ? "border-rust-600" : "border-steel-300",
          className,
        )}
        {...rest}
      />
      {eroare ? (
        <p id={idEroare} className="text-sm text-rust-600">
          {eroare}
        </p>
      ) : null}
    </div>
  );
}
