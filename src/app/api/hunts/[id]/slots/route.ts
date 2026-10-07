import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { getOwnerCode } from "@/lib/api/code";
import { addSlot } from "@/lib/services/hunts";
import { slotSchema } from "@/lib/validation/schemas";

export const POST = withErrorHandling(async (req, ctx) => {
  const { id } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  const input = slotSchema.parse(await req.json());
  const slot = await addSlot(id, input, ownerCode);
  return NextResponse.json({ slot }, { status: 201 });
});
