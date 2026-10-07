import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/errors";
import { assertCanManage } from "@/lib/auth/permissions";
import { listGlobalHistory, listWheels, createWheel } from "@/lib/services/wheels";
import { createWheelSchema } from "@/lib/validation/schemas";


export const GET = withErrorHandling(async () => {
  const [wheels, history] = await Promise.all([
    listWheels(),
    listGlobalHistory(50),
  ]);
  return NextResponse.json({ wheels, history });
});

export const POST = withErrorHandling(async (req) => {
  await assertCanManage(req, "wheels.manage");
  const body = await req.json();
  const input = createWheelSchema.parse(body);
  const wheel = await createWheel(input);
  return NextResponse.json({ wheel }, { status: 201 });
});
