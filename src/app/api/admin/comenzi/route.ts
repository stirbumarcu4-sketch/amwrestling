import { NextResponse } from "next/server";
import { citesteComenzi } from "@/lib/admin-date";

export async function GET() {
  return NextResponse.json(await citesteComenzi());
}
