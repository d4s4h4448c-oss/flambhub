import { NextResponse } from "next/server";
import { badRequest, withErrorHandling } from "@/lib/api/errors";
import { getOwnerCode } from "@/lib/api/code";
import { assertCanManage } from "@/lib/auth/permissions";
import { claimHunt } from "@/lib/services/hunts";

export const POST = withErrorHandling(async (req, ctx) => {
  await assertCanManage(req, "hunts.manage");
  const { id } = await ctx.params;
  const ownerCode = getOwnerCode(req);
  if (!ownerCode) {
    throw badRequest(
      "Génère d'abord ton code de liaison sur la page Bonus Hunt (Lier l'extension).",
    );
  }
  const hunt = await claimHunt(id, ownerCode);
  return NextResponse.json({ hunt });
});
