import type { ReactNode } from "react";

export default function EmptyState({
  titlu,
  descriere,
  actiune,
}: {
  titlu: string;
  descriere: string;
  actiune?: ReactNode;
}) {
  return (
    <div className="border border-chalk-200 bg-suprafata px-6 py-16 text-center">
      <h2 className="type-h3 text-ink-900">{titlu}</h2>
      <p className="mx-auto mt-3 max-w-[46ch] text-steel-500">{descriere}</p>
      {actiune ? <div className="mt-8 flex justify-center">{actiune}</div> : null}
    </div>
  );
}
