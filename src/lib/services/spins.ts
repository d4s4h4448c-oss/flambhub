import { randomInt } from "node:crypto";
import { badRequest } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { wheelSpins } from "@/lib/db/schema";
import { findSpin, getWheel } from "./wheels";

export interface SpinResult {
  spinId: string;
  wheelId: string;
  wheelName: string;
  entryId: string;
  resultLabel: string;
  createdAt: Date;
  replayed: boolean;
}

/**
 * Tirage pondéré côté serveur (crypto, pas Math.random du navigateur).
 * L'idempotency key = spinId fourni par le client (UUID unique par action).
 * Un même spinId ne produit qu'un seul résultat : si un doublon est reçu
 * (double-clic, onglets multiples, retry), le résultat enregistré est renvoyé.
 */
export async function performSpin(
  wheelId: string,
  spinId: string,
): Promise<SpinResult> {
  const existing = await findSpin(wheelId, spinId);
  if (existing) {
    const wheel = await getWheel(wheelId);
    return {
      spinId: existing.id,
      wheelId,
      wheelName: wheel.name,
      entryId: existing.entryId,
      resultLabel: existing.resultLabel,
      createdAt: existing.createdAt,
      replayed: true,
    };
  }

  const wheel = await getWheel(wheelId);
  const entries = wheel.entries.filter((e) => e.weight > 0);

  if (entries.length < 2) {
    throw badRequest(
      "Cette roue doit contenir au moins 2 entrées valides pour être lancée.",
    );
  }

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = randomInt(totalWeight);
  let winner = entries[entries.length - 1];
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll < 0) {
      winner = entry;
      break;
    }
  }

  const createdAt = new Date();
  await db.insert(wheelSpins).values({
    id: spinId,
    wheelId,
    entryId: winner.id,
    resultLabel: winner.label,
    createdAt,
  });

  return {
    spinId,
    wheelId,
    wheelName: wheel.name,
    entryId: winner.id,
    resultLabel: winner.label,
    createdAt,
    replayed: false,
  };
}
