import { NextResponse } from "next/server";
import { popularInstruments } from "../../../../lib/instruments";

export function GET() {
  return NextResponse.json({ instruments: popularInstruments });
}
