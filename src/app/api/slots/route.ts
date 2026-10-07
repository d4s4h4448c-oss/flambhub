import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { searchSlots, SLOT_CATALOG } from "@/lib/data/slots";

export const GET = withErrorHandling(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const slots = q ? searchSlots(q, 10) : SLOT_CATALOG.slice(0, 200);
  return NextResponse.json({ slots });
});
