import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { getOwnerCode } from "@/lib/api/code";
import { deleteHunt, getHunt, getHuntCharts, updateHunt } from "@/lib/services/hunts";
import { updateHuntSchema } from "@/lib/validation/schemas";

export const GET = withErrorHandling(async (req, ctx) => {
  const { id } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  const [hunt, charts] = await Promise.all([
    getHunt(id, ownerCode),
    getHuntCharts(id, ownerCode),
  ]);
  return NextResponse.json({ hunt, charts });
});

export const PATCH = withErrorHandling(async (req, ctx) => {
  const { id } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  const input = updateHuntSchema.parse(await req.json());
  const hunt = await updateHunt(id, input, ownerCode);
  return NextResponse.json({ hunt });
});

export const DELETE = withErrorHandling(async (req, ctx) => {
  const { id } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  await deleteHunt(id, ownerCode);
  return NextResponse.json({ ok: true });
});
