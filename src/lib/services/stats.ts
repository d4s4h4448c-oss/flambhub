import type { HuntSlot } from "@/lib/db/schema";

export interface ProviderStat {
  provider: string;
  count: number;
  totalStake: number;
  totalWon: number;
}

export interface RemarkableSlot {
  slotName: string;
  provider: string;
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
  breakEvenFixe: number | null;
  breakEvenEvolutif: number | null;
  providers: ProviderStat[];
  remarquables: RemarkableSlot[];
  bountyCount: number;
}

export interface HuntChartData {
  profitEvolution: Array<{ index: number; cumulWin: number; profit: number }>;
  stakeVsWin: Array<{ index: number; mise: number; gain: number }>;
  multiplierDistribution: Array<{ bucket: string; count: number }>;
  topSlots: Array<{ slotName: string; winAmount: number; multiplier: number }>;
  providerBreakdown: Array<{ provider: string; mise: number; gagne: number }>;
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
  const breakEvenEvolutif =
    remainingStake > 0
      ? round2((startingAmount - totalWon) / remainingStake)
      : null;

  const providerMap = new Map<string, ProviderStat>();
  for (const slot of slots) {
    const key = slot.provider || "Autre";
    const current = providerMap.get(key) ?? {
      provider: key,
      count: 0,
      totalStake: 0,
      totalWon: 0,
    };
    current.count += 1;
    current.totalStake = round2(current.totalStake + slot.stake);
    current.totalWon = round2(current.totalWon + slot.winAmount);
    providerMap.set(key, current);
  }
  const providers = [...providerMap.values()].sort(
    (a, b) => b.totalWon - a.totalWon || b.count - a.count,
  );

  const bountyCount = slots.filter((s) => s.isBounty).length;

  const remarquables: RemarkableSlot[] = collected
    .filter((s) => slotMultiplier(s) >= REMARKABLE_MULTIPLIER)
    .map((s) => ({
      slotName: s.slotName,
      provider: s.provider,
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
    breakEvenFixe,
    breakEvenEvolutif,
    providers,
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

  const providerMap = new Map<string, { mise: number; gagne: number }>();
  for (const slot of slots) {
    const key = slot.provider || "Autre";
    const current = providerMap.get(key) ?? { mise: 0, gagne: 0 };
    current.mise = round2(current.mise + slot.stake);
    current.gagne = round2(
      current.gagne + (slot.status === "collected" ? slot.winAmount : 0),
    );
    providerMap.set(key, current);
  }
  const providerBreakdown = [...providerMap.entries()]
    .map(([provider, value]) => ({ provider, ...value }))
    .sort((a, b) => b.gagne - a.gagne);

  return {
    profitEvolution,
    stakeVsWin,
    multiplierDistribution,
    topSlots,
    providerBreakdown,
  };
}
