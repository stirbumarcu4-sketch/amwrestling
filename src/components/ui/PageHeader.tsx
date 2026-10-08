import type { ReactNode } from "react";
import Container from "@/components/layout/Container";

export default function PageHeader({
  titlu,
  descriere,
  eticheta,
  actiune,
}: {
  titlu: string;
  descriere?: string;
  eticheta?: string;
  actiune?: ReactNode;
}) {
  return (
    <div className="border-b border-chalk-200 bg-suprafata">
      <Container className="py-8 lg:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {eticheta ? <p className="type-eticheta mb-3">{eticheta}</p> : null}
            <h1 className="type-h1">{titlu}</h1>
            {descriere ? (
              <p className="masura mt-4 text-steel-500">{descriere}</p>
            ) : null}
          </div>
          {actiune ? <div className="shrink-0">{actiune}</div> : null}
        </div>
      </Container>
    </div>
  );
}
