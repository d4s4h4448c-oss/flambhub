import type { Currency } from "@/lib/data/currencies";

export type { Currency };
export type SlotStatus = "pending" | "in_progress" | "collected";

export interface HuntSlot {
  id: string;
  huntId: string;
  slotName: string;
  provider: string;
  stake: number;
  player: string;
  status: SlotStatus;
  isBounty: boolean;
  winAmount: number;
  collectedAt: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface HuntDetail {
  id: string;
  name: string;
  currency: Currency;
  startingAmount: number;
  ownerCode: string | null;
  createdAt: string;
  updatedAt: string;
  slots: HuntSlot[];
  stats: HuntStats;
}

export interface HuntSummary {
  id: string;
  name: string;
  currency: Currency;
  startingAmount: number;
  ownerCode: string | null;
  createdAt: string;
  updatedAt: string;
  stats: HuntStats;
}

export interface CatalogSlot {
  name: string;
  provider: string;
}
