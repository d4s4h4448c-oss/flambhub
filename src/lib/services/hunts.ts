import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { badRequest, conflict, notFound } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { bonusHunts, huntSlots, type HuntSlot } from "@/lib/db/schema";
import type { Currency } from "@/lib/data/currencies";
import type { SlotInput, SlotStatus } from "@/lib/validation/schemas";
import { computeHuntChartData, computeHuntStats, type HuntChartData, type HuntStats } from "./stats";

export interface HuntWithSlots {
  id: string;
  name: string;
  currency: Currency;
  startingAmount: number;
  ownerCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  slots: HuntSlot[];
  stats: HuntStats;
}

export interface HuntSummary {
  id: string;
  name: string;
  currency: Currency;
  startingAmount: number;
  ownerCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  stats: HuntStats;
}

export function toCurrency(value: string): Currency {
  return value as Currency;
}

function ownerFilter(ownerCode: string | null) {
  return ownerCode === null
    ? isNull(bonusHunts.ownerCode)
    : eq(bonusHunts.ownerCode, ownerCode);
}

async function fetchSlots(huntId: string): Promise<HuntSlot[]> {
  return db
    .select()
    .from(huntSlots)
    .where(eq(huntSlots.huntId, huntId))
    .orderBy(asc(huntSlots.position), asc(huntSlots.createdAt));
}

async function buildHunt(row: {
  id: string;
  name: string;
  currency: string;
  startingAmount: number;
  ownerCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Promise<HuntWithSlots> {
  const slots = await fetchSlots(row.id);
  return {
    ...row,
    currency: toCurrency(row.currency),
    slots,
    stats: computeHuntStats(slots, row.startingAmount),
  };
}

/**
 * Accès : un hunt n'est visible que par son code de liaison (ou en mode
 * communauté quand aucun code n'est utilisé). Toute autre requête reçoit 404.
 */
export async function getHunt(
  huntId: string,
  ownerCode: string | null,
): Promise<HuntWithSlots> {
  const rows = await db
    .select()
    .from(bonusHunts)
    .where(and(eq(bonusHunts.id, huntId), ownerFilter(ownerCode)))
    .limit(1);
  if (!rows[0]) throw notFound("Session Bonus Hunt introuvable.");
  return buildHunt(rows[0]);
}

export async function listHunts(ownerCode: string | null): Promise<HuntSummary[]> {
  const hunts = await db
    .select()
    .from(bonusHunts)
    .where(ownerFilter(ownerCode))
    .orderBy(desc(bonusHunts.createdAt));
  const result: HuntSummary[] = [];
  for (const hunt of hunts) {
    const slots = await fetchSlots(hunt.id);
    result.push({
      id: hunt.id,
      name: hunt.name,
      currency: toCurrency(hunt.currency),
      startingAmount: hunt.startingAmount,
      ownerCode: hunt.ownerCode,
      createdAt: hunt.createdAt,
      updatedAt: hunt.updatedAt,
      stats: computeHuntStats(slots, hunt.startingAmount),
    });
  }
  return result;
}

/** Hunts communautaires (sans code) : visibles par tous et liables à un code. */
export async function listCommunityHunts(): Promise<HuntSummary[]> {
  return listHunts(null);
}

/**
 * Lie un hunt communautaire (sans code) au code du demandeur.
 * Un hunt déjà lié ne peut pas être volé (409).
 */
export async function claimHunt(
  huntId: string,
  ownerCode: string,
): Promise<HuntWithSlots> {
  const rows = await db
    .select()
    .from(bonusHunts)
    .where(eq(bonusHunts.id, huntId))
    .limit(1);
  if (!rows[0]) throw notFound("Session Bonus Hunt introuvable.");
  if (rows[0].ownerCode !== null) {
    throw conflict("Ce hunt est déjà lié à un code.");
  }
  await db
    .update(bonusHunts)
    .set({ ownerCode, updatedAt: new Date() })
    .where(eq(bonusHunts.id, huntId));
  return getHunt(huntId, ownerCode);
}

export async function createHunt(
  input: { name: string; currency: Currency; startingAmount: number },
  ownerCode: string | null,
): Promise<HuntWithSlots> {
  const id = randomUUID();
  await db.insert(bonusHunts).values({
    id,
    name: input.name,
    currency: input.currency,
    startingAmount: input.startingAmount,
    ownerCode,
  });
  return getHunt(id, ownerCode);
}

export async function updateHunt(
  huntId: string,
  input: { name: string; currency: Currency; startingAmount: number },
  ownerCode: string | null,
): Promise<HuntWithSlots> {
  await getHunt(huntId, ownerCode);
  await db
    .update(bonusHunts)
    .set({
      name: input.name,
      currency: input.currency,
      startingAmount: input.startingAmount,
      updatedAt: new Date(),
    })
    .where(eq(bonusHunts.id, huntId));
  return getHunt(huntId, ownerCode);
}

export async function deleteHunt(
  huntId: string,
  ownerCode: string | null,
): Promise<void> {
  await getHunt(huntId, ownerCode);
  await db.delete(bonusHunts).where(eq(bonusHunts.id, huntId));
}

export async function addSlot(
  huntId: string,
  input: SlotInput,
  ownerCode: string | null,
): Promise<HuntSlot> {
  const hunt = await getHunt(huntId, ownerCode);

  const last = hunt.slots[hunt.slots.length - 1];
  const position = last ? last.position + 1 : 0;

  const winAmount = input.status === "collected" ? input.winAmount : 0;
  if (input.status === "collected" && winAmount <= 0) {
    throw badRequest("Une slot collectée doit avoir un gain supérieur à 0.");
  }

  const row: HuntSlot = {
    id: randomUUID(),
    huntId,
    slotName: input.slotName,
    provider: input.provider,
    stake: input.stake,
    player: input.player,
    status: input.status,
    isBounty: input.isBounty,
    winAmount,
    collectedAt: input.status === "collected" ? new Date() : null,
    position,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.insert(huntSlots).values(row);
  return row;
}

export async function updateSlot(
  huntId: string,
  slotId: string,
  input: SlotInput,
  ownerCode: string | null,
): Promise<HuntSlot> {
  await getHunt(huntId, ownerCode);
  const existing = await db
    .select()
    .from(huntSlots)
    .where(eq(huntSlots.id, slotId))
    .limit(1);
  if (!existing[0]) throw notFound("Slot introuvable.");

  const winAmount = input.status === "collected" ? input.winAmount : 0;
  if (input.status === "collected" && winAmount <= 0) {
    throw badRequest("Une slot collectée doit avoir un gain supérieur à 0.");
  }

  const collectedAt =
    input.status === "collected"
      ? existing[0].collectedAt ?? new Date()
      : null;

  await db
    .update(huntSlots)
    .set({
      slotName: input.slotName,
      provider: input.provider,
      stake: input.stake,
      player: input.player,
      status: input.status,
      isBounty: input.isBounty,
      winAmount,
      collectedAt,
      updatedAt: new Date(),
    })
    .where(eq(huntSlots.id, slotId));

  const updated = await db
    .select()
    .from(huntSlots)
    .where(eq(huntSlots.id, slotId))
    .limit(1);
  return updated[0];
}

export async function deleteSlot(
  huntId: string,
  slotId: string,
  ownerCode: string | null,
): Promise<void> {
  await getHunt(huntId, ownerCode);
  await db.delete(huntSlots).where(eq(huntSlots.id, slotId));
}

export async function getHuntCharts(
  huntId: string,
  ownerCode: string | null,
): Promise<HuntChartData> {
  const hunt = await getHunt(huntId, ownerCode);
  return computeHuntChartData(hunt.slots, hunt.startingAmount);
}

export type { SlotStatus };
