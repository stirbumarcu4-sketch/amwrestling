"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<"input">, "id"> & {
  eticheta: string;
  eroare?: string;
  ajutor?: string;
};

export default function Input({
  eticheta,
  eroare,
  ajutor,
  className,
  required,
  ...rest
}: Props) {
  const id = useId();
  const idEroare = `${id}-eroare`;
  const idAjutor = `${id}-ajutor`;
  const descrieri =
    [eroare ? idEroare : null, ajutor ? idAjutor : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-eticheta text-ink-700">
        {eticheta}
        {required ? <span className="text-rust-600"> *</span> : null}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={eroare ? true : undefined}
        aria-describedby={descrieri}
        className={cn(
          "h-11 w-full rounded-[var(--radius-sm)] border bg-suprafata px-3 text-base text-ink-700",
          "placeholder:text-steel-400",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
          eroare ? "border-rust-600" : "border-steel-300",
          className,
        )}
        {...rest}
      />
      {ajutor ? (
        <p id={idAjutor} className="text-sm text-steel-500">
          {ajutor}
        </p>
      ) : null}
      {eroare ? (
        <p id={idEroare} className="text-sm text-rust-600">
          {eroare}
        </p>
      ) : null}
    </div>
  );
}
