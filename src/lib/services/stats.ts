import type { HuntSlot } from "@/lib/db/schema";

export interface RemarkableSlot {
  slotName: string;
  stake: number;
  winAmount: number;
  multiplier: number;
}

export interface HuntStats {
  slotCount: number;
  pendingCount: number;
  inProgressCount: number;
  collectedCount: number;
  startingAmount: number;
  totalStake: number;
  totalWon: number;
  profit: number;
  rtp: number | null;
  averageMultiplier: number | null;
  totalMultiplier: number | null;
  biggestBonus: { value: number; slotName: string } | null;
  smallestBonus: { value: number; slotName: string } | null;
  breakEvenFixe: number | null;
  breakEvenEvolutif: number | null;
  remarquables: RemarkableSlot[];
  bountyCount: number;
}

export interface HuntChartData {
  profitEvolution: Array<{ index: number; cumulWin: number; profit: number }>;
  stakeVsWin: Array<{ index: number; mise: number; gain: number }>;
  multiplierDistribution: Array<{ bucket: string; count: number }>;
  topSlots: Array<{ slotName: string; winAmount: number; multiplier: number }>;
}

const MULTIPLIER_BUCKETS: Array<{ label: string; min: number; max: number }> = [
  { label: "0-25x", min: 0, max: 25 },
  { label: "25-50x", min: 25, max: 50 },
  { label: "50-100x", min: 50, max: 100 },
  { label: "100-250x", min: 100, max: 250 },
  { label: "250x+", min: 250, max: Infinity },
];

const REMARKABLE_MULTIPLIER = 100;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function slotMultiplier(slot: HuntSlot): number {
  if (slot.stake <= 0) return 0;
  return round2(slot.winAmount / slot.stake);
}

/**
 * Toutes les statistiques sont (re)calculées ici, côté serveur, à partir des
 * slots enregistrés. Aucune valeur envoyée par le frontend n'est fiable.
 */
export function computeHuntStats(
  slots: HuntSlot[],
  startingAmount: number,
): HuntStats {
  const collected = slots.filter((s) => s.status === "collected");
  const pending = slots.filter((s) => s.status === "pending");
  const inProgress = slots.filter((s) => s.status === "in_progress");

  const totalStake = round2(slots.reduce((sum, s) => sum + s.stake, 0));
  const totalWon = round2(collected.reduce((sum, s) => sum + s.winAmount, 0));
  const remainingStake = round2(
    slots
      .filter((s) => s.status !== "collected")
      .reduce((sum, s) => sum + s.stake, 0),
  );

  const breakEvenFixe =
    totalStake > 0 ? round2(startingAmount / totalStake) : null;
  // Jamais négatif : si le break even est déjà dépassé, il vaut 0.
  const breakEvenEvolutif =
    remainingStake > 0
      ? Math.max(0, round2((startingAmount - totalWon) / remainingStake))
      : null;

  const bountyCount = slots.filter((s) => s.isBounty).length;

  let biggestBonus: HuntStats["biggestBonus"] = null;
  let smallestBonus: HuntStats["smallestBonus"] = null;
  for (const s of collected) {
    if (!biggestBonus || s.winAmount > biggestBonus.value) {
      biggestBonus = { value: s.winAmount, slotName: s.slotName };
    }
    if (!smallestBonus || s.winAmount < smallestBonus.value) {
      smallestBonus = { value: s.winAmount, slotName: s.slotName };
    }
  }

  const withStake = collected.filter((s) => s.stake > 0);
  const averageMultiplier =
    withStake.length > 0
      ? round2(
          withStake.reduce((sum, s) => sum + slotMultiplier(s), 0) /
            withStake.length,
        )
      : null;
  const totalMultiplier =
    totalStake > 0 ? round2(totalWon / totalStake) : null;

  const remarquables: RemarkableSlot[] = collected
    .filter((s) => slotMultiplier(s) >= REMARKABLE_MULTIPLIER)
    .map((s) => ({
      slotName: s.slotName,
      stake: s.stake,
      winAmount: s.winAmount,
      multiplier: slotMultiplier(s),
    }))
    .sort((a, b) => b.multiplier - a.multiplier);

  return {
    slotCount: slots.length,
    pendingCount: pending.length,
    inProgressCount: inProgress.length,
    collectedCount: collected.length,
    startingAmount: round2(startingAmount),
    totalStake,
    totalWon,
    profit: round2(totalWon - startingAmount),
    rtp: totalStake > 0 ? round2((totalWon / totalStake) * 100) : null,
    averageMultiplier,
    totalMultiplier,
    biggestBonus,
    smallestBonus,
    breakEvenFixe,
    breakEvenEvolutif,
    remarquables,
    bountyCount,
  };
}

export function computeHuntChartData(
  slots: HuntSlot[],
  startingAmount: number,
): HuntChartData {
  const collected = slots
    .filter((s) => s.status === "collected")
    .sort((a, b) => {
      const ta = a.collectedAt?.getTime() ?? a.createdAt.getTime();
      const tb = b.collectedAt?.getTime() ?? b.createdAt.getTime();
      return ta - tb;
    });

  let cumulWin = 0;
  const profitEvolution = collected.map((s, index) => {
    cumulWin = round2(cumulWin + s.winAmount);
    return {
      index: index + 1,
      cumulWin,
      profit: round2(cumulWin - startingAmount),
    };
  });

  const stakeVsWin = slots.map((s, index) => ({
    index: index + 1,
    mise: s.stake,
    gain: s.status === "collected" ? s.winAmount : 0,
  }));

  const multiplierDistribution = MULTIPLIER_BUCKETS.map((bucket) => ({
    bucket: bucket.label,
    count: collected.filter((s) => {
      const m = slotMultiplier(s);
      return m >= bucket.min && m < bucket.max;
    }).length,
  }));

  const topSlots = collected
    .map((s) => ({
      slotName: s.slotName,
      winAmount: s.winAmount,
      multiplier: slotMultiplier(s),
    }))
    .sort((a, b) => b.winAmount - a.winAmount)
    .slice(0, 8);

  return {
    profitEvolution,
    stakeVsWin,
    multiplierDistribution,
    topSlots,
  };
}
