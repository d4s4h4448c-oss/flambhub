import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { performSpin } from "@/lib/services/spins";
import { spinSchema } from "@/lib/validation/schemas";


export const POST = withErrorHandling(async (req, ctx) => {
  const { id } = await ctx.params;
  const input = spinSchema.parse(await req.json());
  const result = await performSpin(id, input.id);
  return NextResponse.json({ spin: result }, { status: result.replayed ? 200 : 201 });
});
