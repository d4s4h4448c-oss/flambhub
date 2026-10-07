import { randomUUID } from "node:crypto";
import { and, asc, desc, eq } from "drizzle-orm";
import { notFound } from "@/lib/api/errors";
import { db } from "@/lib/db";
import {
  type WheelEntry,
  wheelEntries,
  wheelSpins,
  wheels,
} from "@/lib/db/schema";
import type { EntryInput } from "@/lib/validation/schemas";

export interface WheelWithEntries {
  id: string;
  name: string;
  entries: WheelEntry[];
  createdAt: Date;
  updatedAt: Date;
}

async function fetchEntriesFor(wheelId: string): Promise<WheelEntry[]> {
  return db
    .select()
    .from(wheelEntries)
    .where(eq(wheelEntries.wheelId, wheelId))
    .orderBy(asc(wheelEntries.position), asc(wheelEntries.createdAt));
}

export async function listWheels(): Promise<WheelWithEntries[]> {
  const rows = await db.select().from(wheels).orderBy(asc(wheels.createdAt));
  const result: WheelWithEntries[] = [];
  for (const wheel of rows) {
    result.push({ ...wheel, entries: await fetchEntriesFor(wheel.id) });
  }
  return result;
}

export async function getWheel(wheelId: string): Promise<WheelWithEntries> {
  const wheel = await db
    .select()
    .from(wheels)
    .where(eq(wheels.id, wheelId))
    .limit(1);
  if (!wheel[0]) throw notFound("Roue introuvable.");
  return { ...wheel[0], entries: await fetchEntriesFor(wheelId) };
}

function buildEntries(wheelId: string, entries: EntryInput[]) {
  return entries.map((entry, position) => ({
    id: randomUUID(),
    wheelId,
    label: entry.label,
    weight: entry.weight,
    position,
  }));
}

export async function createWheel(
  input: { name: string; entries: EntryInput[] },
): Promise<WheelWithEntries> {
  const wheelId = randomUUID();
  const entryRows = buildEntries(wheelId, input.entries);
  await db.batch([
    db.insert(wheels).values({ id: wheelId, name: input.name }),
    ...(entryRows.length
      ? [db.insert(wheelEntries).values(entryRows)]
      : []),
  ]);
  return getWheel(wheelId);
}

export async function updateWheel(
  wheelId: string,
  input: { name: string; entries: EntryInput[] },
): Promise<WheelWithEntries> {
  await getWheel(wheelId);
  const entryRows = buildEntries(wheelId, input.entries);
  await db.batch([
    db
      .update(wheels)
      .set({ name: input.name, updatedAt: new Date() })
      .where(eq(wheels.id, wheelId)),
    db.delete(wheelEntries).where(eq(wheelEntries.wheelId, wheelId)),
    ...(entryRows.length
      ? [db.insert(wheelEntries).values(entryRows)]
      : []),
  ]);
  return getWheel(wheelId);
}

export async function deleteWheel(wheelId: string): Promise<void> {
  await getWheel(wheelId);
  await db.delete(wheels).where(eq(wheels.id, wheelId));
}

export async function listSpinHistory(
  wheelId: string,
  limit: number,
): Promise<
  Array<{
    id: string;
    wheelName: string;
    resultLabel: string;
    createdAt: Date;
  }>
> {
  const rows = await db
    .select({
      id: wheelSpins.id,
      wheelName: wheels.name,
      resultLabel: wheelSpins.resultLabel,
      createdAt: wheelSpins.createdAt,
    })
    .from(wheelSpins)
    .innerJoin(wheels, eq(wheelSpins.wheelId, wheels.id))
    .where(eq(wheelSpins.wheelId, wheelId))
    .orderBy(desc(wheelSpins.createdAt))
    .limit(limit);
  return rows.map((row) => ({
    id: row.id,
    wheelName: row.wheelName,
    resultLabel: row.resultLabel,
    createdAt: row.createdAt,
  }));
}

export async function listGlobalHistory(
  limit: number,
): Promise<
  Array<{
    id: string;
    wheelId: string;
    wheelName: string;
    resultLabel: string;
    createdAt: Date;
  }>
> {
  const rows = await db
    .select({
      id: wheelSpins.id,
      wheelId: wheels.id,
      wheelName: wheels.name,
      resultLabel: wheelSpins.resultLabel,
      createdAt: wheelSpins.createdAt,
    })
    .from(wheelSpins)
    .innerJoin(wheels, eq(wheelSpins.wheelId, wheels.id))
    .orderBy(desc(wheelSpins.createdAt))
    .limit(limit);
  return rows.map((row) => ({
    id: row.id,
    wheelId: row.wheelId,
    wheelName: row.wheelName,
    resultLabel: row.resultLabel,
    createdAt: row.createdAt,
  }));
}

export async function findSpin(
  wheelId: string,
  spinId: string,
): Promise<{ id: string; wheelId: string; entryId: string; resultLabel: string; createdAt: Date } | null> {
  const rows = await db
    .select()
    .from(wheelSpins)
    .where(and(eq(wheelSpins.wheelId, wheelId), eq(wheelSpins.id, spinId)))
    .limit(1);
  return rows[0] ?? null;
}
