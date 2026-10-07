import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { getOwnerCode } from "@/lib/api/code";
import { deleteSlot, updateSlot } from "@/lib/services/hunts";
import { slotSchema } from "@/lib/validation/schemas";

export const PATCH = withErrorHandling(async (req, ctx) => {
  const { id, slotId } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  const input = slotSchema.parse(await req.json());
  const slot = await updateSlot(id, slotId, input, ownerCode);
  return NextResponse.json({ slot });
});

export const DELETE = withErrorHandling(async (req, ctx) => {
  const { id, slotId } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  await deleteSlot(id, slotId, ownerCode);
  return NextResponse.json({ ok: true });
});
