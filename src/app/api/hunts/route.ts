import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { getOwnerCode } from "@/lib/api/code";
import { createHunt, listHunts } from "@/lib/services/hunts";
import { createHuntSchema } from "@/lib/validation/schemas";

export const GET = withErrorHandling(async (req) => {
  const hunts = await listHunts(getOwnerCode(req));
  return NextResponse.json({ hunts });
});

export const POST = withErrorHandling(async (req) => {
  const ownerCode = getOwnerCode(req);
  const input = createHuntSchema.parse(await req.json());
  const hunt = await createHunt(input, ownerCode);
  return NextResponse.json({ hunt }, { status: 201 });
});
