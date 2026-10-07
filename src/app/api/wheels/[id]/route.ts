import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { assertCanManage } from "@/lib/auth/permissions";
import { deleteWheel, getWheel, updateWheel } from "@/lib/services/wheels";
import { updateWheelSchema } from "@/lib/validation/schemas";


export const GET = withErrorHandling(async (_req, ctx) => {
  const { id } = await ctx.params;
  const wheel = await getWheel(id);
  return NextResponse.json({ wheel });
});

export const PATCH = withErrorHandling(async (req, ctx) => {
  await assertCanManage(req, "wheels.manage");
  const { id } = await ctx.params;
  const input = updateWheelSchema.parse(await req.json());
  const wheel = await updateWheel(id, input);
  return NextResponse.json({ wheel });
});

export const DELETE = withErrorHandling(async (req, ctx) => {
  await assertCanManage(req, "wheels.delete");
  const { id } = await ctx.params;
  await deleteWheel(id);
  return NextResponse.json({ ok: true });
});
