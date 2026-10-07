import { NextResponse } from "next/server";
import { withErrorHandling, badRequest } from "@/lib/api/errors";
import { listSpinHistory } from "@/lib/services/wheels";


export const GET = withErrorHandling(async (req, ctx) => {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const rawLimit = url.searchParams.get("limit");
  const limit = rawLimit ? Number(rawLimit) : 30;
  if (!Number.isFinite(limit) || limit < 1 || limit > 200) {
    throw badRequest("Paramètre limit invalide (1 à 200).");
  }
  const history = await listSpinHistory(id, Math.floor(limit));
  return NextResponse.json({ history });
});
