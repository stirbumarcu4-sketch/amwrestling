import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { citesteComenzi, scrieComenzi } from "@/lib/admin-date";
import type { StatusComanda } from "@/types";

type Context = { params: Promise<{ numar: string }> };

const STATUSURI: StatusComanda[] = [
  "noua",
  "confirmata",
  "expediata",
  "livrata",
  "anulata",
];

/** Schimbă statusul comenzii. */
export async function PATCH(request: NextRequest, { params }: Context) {
  const { numar } = await params;

  let corp: unknown;
  try {
    corp = await request.json();
  } catch {
    return NextResponse.json({ eroare: "Corp invalid." }, { status: 400 });
  }

  const status = (corp as { status?: unknown })?.status;
  if (typeof status !== "string" || !STATUSURI.includes(status as StatusComanda)) {
    return NextResponse.json({ eroare: "Status invalid." }, { status: 400 });
  }

  const comenzi = await citesteComenzi();
  const index = comenzi.findIndex((c) => c.numar === numar);
  if (index === -1) {
    return NextResponse.json({ eroare: "Comandă inexistentă." }, { status: 404 });
  }

  comenzi[index].status = status as StatusComanda;
  await scrieComenzi(comenzi);
  return NextResponse.json(comenzi[index]);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { numar } = await params;
  const comenzi = await citesteComenzi();
  const ramase = comenzi.filter((c) => c.numar !== numar);

  if (ramase.length === comenzi.length) {
    return NextResponse.json({ eroare: "Comandă inexistentă." }, { status: 404 });
  }

  await scrieComenzi(ramase);
  return NextResponse.json({ ok: true });
}
