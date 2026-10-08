"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { flambFetch, getClientCode, newClientCode, setClientCode } from "@/lib/client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Form";
import HuntCharts from "./HuntCharts";
import SlotForm from "./SlotForm";
import { CURRENCIES, currencyLabel, type Currency } from "@/lib/data/currencies";
import {
  IconActivity,
  IconArrowLeft,
  IconBarChart,
  IconCoins,
  IconCopy,
  IconFlame,
  IconGem,
  IconLink,
  IconPencil,
  IconSlot,
  IconStar,
  IconTarget,
  IconTrash,
  IconTrendUp,
  IconTrophy,
  IconWallet,
} from "@/components/ui/Icons";
import type { HuntChartData, HuntDetail, HuntSlot, HuntSummary, SlotStatus } from "@/lib/types";

const STATUS_LABELS: Record<SlotStatus, string> = {
  pending: "En attente",
  in_progress: "En cours",
  collected: "Collecté",
};

function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMultiplier(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + "x";
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "bad";
}) {
  const color =
    tone === "good"
      ? "text-success"
      : tone === "bad"
        ? "text-rose"
        : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <span className="block text-primary-strong [&>svg]:size-5" aria-hidden>
        {icon}
      </span>
      <p className={`font-display mt-2 text-xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted/80">{sub}</p>}
    </div>
  );
}

export default function HuntApp() {
  const [hunts, setHunts] = useState<HuntSummary[]>([]);
  const [detail, setDetail] = useState<HuntDetail | null>(null);
  const [charts, setCharts] = useState<HuntChartData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [startingAmount, setStartingAmount] = useState("");
  const [creating, setCreating] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCurrency, setEditCurrency] = useState<Currency>("EUR");
  const [editStartingAmount, setEditStartingAmount] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  const [slotFormOpen, setSlotFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<HuntSlot | null>(null);
  const [busySlotId, setBusySlotId] = useState<string | null>(null);
  const [deletingHunt, setDeletingHunt] = useState(false);

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkCode, setLinkCode] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const existing = getClientCode();
    if (existing) return existing;
    const code = newClientCode();
    setClientCode(code);
    return code;
  });
  const [copied, setCopied] = useState(false);

  const loadHunts = useCallback(async () => {
    try {
      const res = await flambFetch("/api/hunts", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible de charger les sessions.");
      setHunts(data.hunts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setListLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (huntId: string) => {
    try {
      const res = await flambFetch(`/api/hunts/${huntId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible de charger la session.");
      setDetail(data.hunt);
      setCharts(data.charts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const selectHunt = useCallback((huntId: string) => {
    setSelectedId(huntId);
    setDetail(null);
    setCharts(null);
    setDetailLoading(true);
  }, []);

  useEffect(() => {
    // Chargement initial : pattern fetch-on-mount (setState async).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadHunts();
  }, [loadHunts]);

  useEffect(() => {
    // Chargement du détail à la sélection (setState async).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const refresh = useCallback(async (huntId: string) => {
    await Promise.all([loadDetail(huntId), loadHunts()]);
  }, [loadDetail, loadHunts]);

  // Synchronisation temps réel avec l'extension : recharge silencieuse.
  const refreshSilently = useCallback(async () => {
    try {
      const res = await flambFetch("/api/hunts", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) return;
      setHunts(data.hunts ?? []);
      if (selectedId) {
        const dres = await flambFetch(`/api/hunts/${selectedId}`, { cache: "no-store" });
        const ddata = await dres.json();
        if (dres.ok) {
          setDetail(ddata.hunt);
          setCharts(ddata.charts);
        }
      }
    } catch {
      /* silencieux */
    }
  }, [selectedId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (settingsOpen || slotFormOpen) return;
      const el = document.activeElement;
      if (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      void refreshSilently();
    }, 4000);
    return () => clearInterval(timer);
  }, [refreshSilently, settingsOpen, slotFormOpen]);

  const applyNewCode = useCallback(() => {
    const code = newClientCode();
    setClientCode(code);
    setLinkCode(code);
    setCopied(false);
    setSelectedId(null);
    setDetail(null);
    setCharts(null);
    void loadHunts();
  }, [loadHunts]);

  const copyCode = useCallback(async () => {
    if (!linkCode) return;
    try {
      await navigator.clipboard.writeText(linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* presse-papiers indisponible */
    }
  }, [linkCode]);

  const handleCreateHunt = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    setError(null);
    try {
      const res = await flambFetch("/api/hunts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          currency,
          startingAmount: Number(startingAmount) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible de créer la session.");
      setName("");
      setStartingAmount("");
      await loadHunts();
      selectHunt(data.hunt.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de création.");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!detail || !editName.trim() || savingSettings) return;
    setSavingSettings(true);
    setError(null);
    try {
      const res = await flambFetch(`/api/hunts/${detail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          currency: editCurrency,
          startingAmount: Number(editStartingAmount) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible d'enregistrer.");
      setSettingsOpen(false);
      await refresh(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteHunt = async () => {
    if (!detail || deletingHunt) return;
    if (!window.confirm(`Supprimer la session « ${detail.name} » et toutes ses slots ?`)) {
      return;
    }
    setDeletingHunt(true);
    setError(null);
    try {
      const res = await flambFetch(`/api/hunts/${detail.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Suppression impossible.");
      }
      setSelectedId(null);
      setDetail(null);
      setCharts(null);
      await loadHunts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    } finally {
      setDeletingHunt(false);
    }
  };

  const handleStatusChange = async (slot: HuntSlot, status: SlotStatus) => {
    if (!detail || busySlotId) return;
    if (status === "collected" && slot.winAmount <= 0) {
      setEditingSlot(slot);
      setSlotFormOpen(true);
      return;
    }
    setBusySlotId(slot.id);
    setError(null);
    try {
      const res = await flambFetch(`/api/hunts/${detail.id}/slots/${slot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotName: slot.slotName,
          provider: slot.provider,
          stake: slot.stake,
          player: slot.player,
          status,
          winAmount: status === "collected" ? slot.winAmount : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible de changer le statut.");
      await refresh(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setBusySlotId(null);
    }
  };

  const handleDeleteSlot = async (slot: HuntSlot) => {
    if (!detail || busySlotId) return;
    if (!window.confirm(`Supprimer la slot « ${slot.slotName} » ?`)) return;
    setBusySlotId(slot.id);
    setError(null);
    try {
      const res = await flambFetch(`/api/hunts/${detail.id}/slots/${slot.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Suppression impossible.");
      }
      await refresh(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    } finally {
      setBusySlotId(null);
    }
  };

  const handleSlotSaved = () => {
    if (detail) void refresh(detail.id);
  };

  if (listLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert tone="error">
          {error}
          <div className="mt-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setError(null);
                void loadHunts();
              }}
            >
              Réessayer
            </Button>
          </div>
        </Alert>
      )}

      {/* Liaison extension */}
      <Card className="p-5">
        <button
          onClick={() => setLinkOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between"
          aria-expanded={linkOpen}
        >
          <span className="font-display flex items-center gap-2 text-base font-bold">
            <IconLink className="size-5 text-primary-strong" />
            Lier l&apos;extension
          </span>
          <span
            className={`text-muted transition-transform ${linkOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▾
          </span>
        </button>

        {linkOpen && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <p className="text-sm text-muted">
              Ton code est unique et privé : seuls tes hunts te sont visibles.
              Entre ce code (avec l&apos;URL du site) dans les réglages de
              l&apos;extension pour ajouter tes bonus pendant que tu joues —
              tout sera synchronisé ici, avec le RTP, les stats et les
              graphiques.
            </p>
            {linkCode ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <code className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-lg font-bold tracking-widest text-primary-strong">
                    {linkCode}
                  </code>
                  <Button size="sm" onClick={() => void copyCode()}>
                    {copied ? (
                      "Copié !"
                    ) : (
                      <>
                        <IconCopy className="size-4" />
                        Copier
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Générer un nouveau code ? Tes hunts actuels ne seront plus visibles avec l'ancien code.",
                        )
                      ) {
                        applyNewCode();
                      }
                    }}
                  >
                    Nouveau code
                  </Button>
                </div>
                <p className="text-xs text-muted">
                  Le code est enregistré dans ce navigateur : tes données sont
                  privées et conservées, visibles uniquement avec ce code.
                </p>
              </>
            ) : (
              <Button onClick={applyNewCode}>Générer mon code</Button>
            )}
          </div>
        )}
      </Card>

      {/* Création de session */}
      <Card className="p-5">
        <h3 className="font-display mb-1 text-lg font-bold">Créer un nouveau hunt</h3>
        <p className="mb-3 text-xs text-muted">
          Configure ta session : nom, devise et montant de départ. Tout est sauvegardé côté serveur, tu retrouveras tes hunts à chaque visite.
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_200px_200px_auto]">
          <Input
            aria-label="Nom de votre hunt"
            placeholder="Nom de votre hunt"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreateHunt();
            }}
            maxLength={120}
          />
          <Select
            aria-label="Devise"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.label}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Montant de départ"
            label={undefined}
            type="number"
            min="0"
            step="0.01"
            placeholder={`Montant de départ (${currency})`}
            value={startingAmount}
            onChange={(e) => setStartingAmount(e.target.value)}
          />
          <Button onClick={() => void handleCreateHunt()} loading={creating} disabled={!name.trim()}>
            {creating ? "Création…" : "Créer le hunt"}
          </Button>
        </div>
      </Card>

      {hunts.length === 0 && !detail ? (
        <EmptyState
          icon={<IconSlot />}
          title="Aucune session Bonus Hunt"
          description="Crée un hunt, ajoute tes slots avec leur mise, puis collecte tes gains pour suivre ton profit et ton break even."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Liste des sessions */}
          <div className="space-y-3">
            {hunts.map((hunt) => (
              <button
                key={hunt.id}
                onClick={() => selectHunt(hunt.id)}
                className={`block w-full cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                  hunt.id === selectedId
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">{hunt.name}</span>
                  <Badge tone={hunt.stats.profit >= 0 ? "emerald" : "rose"}>
                    {hunt.stats.profit >= 0 ? "+" : ""}
                    {formatMoney(hunt.stats.profit, hunt.currency)}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  {hunt.stats.slotCount} slot{hunt.stats.slotCount > 1 ? "s" : ""} ·{" "}
                  {hunt.stats.collectedCount} collectée
                  {hunt.stats.collectedCount > 1 ? "s" : ""} ·{" "}
                  {formatDateTime(hunt.createdAt)}
                </p>
              </button>
            ))}

          </div>

          {/* Détail */}
          <div className="space-y-6">
            {detailLoading && (
              <div className="flex items-center justify-center py-16">
                <Spinner className="size-7 text-primary" />
              </div>
            )}

            {!detailLoading && !detail && (
              <EmptyState
                icon={<IconArrowLeft />}
                title="Sélectionne une session"
                description="Choisis un hunt pour voir son résumé, ses slots et ses statistiques."
              />
            )}

            {!detailLoading && detail && charts && (
              <>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold">{detail.name}</h3>
                      <p className="mt-1 text-xs text-muted">
                        {currencyLabel(detail.currency)} · Créé le{" "}
                        {formatDateTime(detail.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="flame"
                        onClick={() => {
                          setEditingSlot(null);
                          setSlotFormOpen(true);
                        }}
                      >
                        + Ajouter une slot
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditName(detail.name);
                          setEditCurrency(detail.currency);
                          setEditStartingAmount(String(detail.startingAmount));
                          setSettingsOpen(true);
                        }}
                      >
                        Éditer
                      </Button>
                      <Button variant="danger" onClick={() => void handleDeleteHunt()} loading={deletingHunt}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Résumé */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <SummaryCard
                    icon={<IconWallet />}
                    label="Montant de départ"
                    value={formatMoney(detail.stats.startingAmount, detail.currency)}
                  />
                  <SummaryCard
                    icon={<IconCoins />}
                    label="Total gagné"
                    value={formatMoney(detail.stats.totalWon, detail.currency)}
                  />
                  <SummaryCard
                    icon={<IconTrendUp />}
                    label="Profit / Pertes"
                    value={`${detail.stats.profit >= 0 ? "+" : ""}${formatMoney(detail.stats.profit, detail.currency)}`}
                    tone={detail.stats.profit >= 0 ? "good" : "bad"}
                  />
                  <SummaryCard
                    icon={<IconBarChart />}
                    label="RTP"
                    value={
                      detail.stats.rtp === null
                        ? "—"
                        : `${detail.stats.rtp.toFixed(1)}%`
                    }
                    tone={
                      detail.stats.rtp === null
                        ? "default"
                        : detail.stats.rtp >= 100
                          ? "good"
                          : "bad"
                    }
                  />
                  <SummaryCard
                    icon={<IconGem />}
                    label="Multiplicateur total"
                    value={
                      detail.stats.totalMultiplier === null
                        ? "—"
                        : `${detail.stats.totalMultiplier.toFixed(2)}x`
                    }
                  />
                  <SummaryCard
                    icon={<IconStar />}
                    label="Multiplicateur moyen"
                    value={
                      detail.stats.averageMultiplier === null
                        ? "—"
                        : `${detail.stats.averageMultiplier.toFixed(2)}x`
                    }
                  />
                  <SummaryCard
                    icon={<IconTrophy />}
                    label="Plus gros bonus"
                    value={
                      detail.stats.biggestBonus
                        ? formatMoney(detail.stats.biggestBonus.value, detail.currency)
                        : "—"
                    }
                    sub={detail.stats.biggestBonus?.slotName}
                  />
                  <SummaryCard
                    icon={<IconCoins />}
                    label="Plus petit bonus"
                    value={
                      detail.stats.smallestBonus
                        ? formatMoney(detail.stats.smallestBonus.value, detail.currency)
                        : "—"
                    }
                    sub={detail.stats.smallestBonus?.slotName}
                  />
                  <SummaryCard
                    icon={<IconSlot />}
                    label="Slots"
                    value={String(detail.stats.slotCount)}
                    sub={`${detail.stats.pendingCount} en attente · ${detail.stats.inProgressCount} en cours · ${detail.stats.collectedCount} collectées`}
                  />
                  <SummaryCard
                    icon={<IconTarget />}
                    label="Break Even Fixe"
                    value={formatMultiplier(detail.stats.breakEvenFixe)}
                    sub="Départ ÷ total des mises"
                  />
                  <SummaryCard
                    icon={<IconActivity />}
                    label="Break Even Évolutif"
                    value={formatMultiplier(detail.stats.breakEvenEvolutif)}
                    sub="Reste à gagner ÷ mises restantes"
                  />
                  <SummaryCard
                    icon={<IconFlame className="text-[#fb923c]" />}
                    label="Bounty"
                    value={String(detail.stats.bountyCount)}
                  />
                </div>

                {/* Barre break even */}
                {detail.stats.startingAmount > 0 && (
                  <Card className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-muted">
                        Progression vers le break even
                      </span>
                      <span className="font-display text-lg font-bold text-foreground">
                        {Math.round(
                          (detail.stats.totalWon / detail.stats.startingAmount) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-surface-3">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            100,
                            (detail.stats.totalWon / detail.stats.startingAmount) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted">
                      <span>{formatMoney(detail.stats.totalWon, detail.currency)} gagnés</span>
                      <span>
                        Objectif {formatMoney(detail.stats.startingAmount, detail.currency)}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        detail.stats.profit >= 0 ? "text-success" : "text-rose"
                      }`}
                    >
                      {detail.stats.profit >= 0
                        ? `Break even atteint — tu es à +${formatMoney(detail.stats.profit, detail.currency)}`
                        : `Il te manque ${formatMoney(Math.abs(detail.stats.profit), detail.currency)} pour atteindre le break even`}
                    </p>
                  </Card>
                )}

                {/* Remarquables */}
                <Card className="p-5">
                  <h4 className="font-display mb-3 flex items-center gap-2 text-lg font-bold">
                  <IconFlame className="size-5 text-primary-strong" />
                  Remarquables
                </h4>
                  {detail.stats.remarquables.length === 0 ? (
                    <p className="text-sm text-muted">Aucune machine remarquable</p>
                  ) : (
                    <ul className="divide-y divide-border/60">
                      {detail.stats.remarquables.map((r) => (
                        <li
                          key={`${r.slotName}-${r.multiplier}`}
                          className="flex items-center justify-between gap-3 py-2.5 text-sm"
                        >
                          <span className="font-medium">{r.slotName}</span>
                          <span>
                            <Badge tone="flame">{r.multiplier.toFixed(0)}x</Badge>{" "}
                            <span className="ml-1 font-semibold text-success">
                              {formatMoney(r.winAmount, detail!.currency)}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>

                {/* Détails des slots */}
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border p-5 pb-3">
                    <h4 className="font-display text-lg font-bold">
                      Détails des slots ({detail.slots.length})
                    </h4>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingSlot(null);
                        setSlotFormOpen(true);
                      }}
                    >
                      + Ajouter une slot
                    </Button>
                  </div>
                  {detail.slots.length === 0 ? (
                    <div className="p-5">
                      <EmptyState
                        icon={<IconSlot />}
                        title="Aucun slot ajouté"
                        description="Ajoute tes slots avec leur mise par spin, puis passe-les en « Collecté » avec le gain."
                        action={
                          <Button
                            onClick={() => {
                              setEditingSlot(null);
                              setSlotFormOpen(true);
                            }}
                          >
                            + Ajouter une slot
                          </Button>
                        }
                      />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[780px] text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                            <th className="px-4 py-3 font-medium">Slot</th>
                            <th className="px-4 py-3 font-medium">Joueur</th>
                            <th className="px-4 py-3 text-right font-medium">Mise</th>
                            <th className="px-4 py-3 font-medium">Statut</th>
                            <th className="px-4 py-3 text-right font-medium">Gain</th>
                            <th className="px-4 py-3 text-right font-medium">Mult.</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.slots.map((slot) => {
                            const mult = slot.stake > 0 ? slot.winAmount / slot.stake : 0;
                            return (
                              <tr
                                key={slot.id}
                                className="border-b border-border/50 transition-colors hover:bg-surface-2/60"
                              >
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center gap-1.5 font-medium">
                                    {slot.isBounty && (
                                      <IconFlame
                                        className="size-4 shrink-0 text-[#fb923c]"
                                        aria-label="Bounty"
                                      />
                                    )}
                                    {slot.slotName}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-muted">{slot.player || "—"}</td>
                                <td className="px-4 py-3 text-right">
                                  {formatMoney(slot.stake, detail!.currency)}
                                </td>
                                <td className="px-4 py-3">
                                  <Select
                                    aria-label={`Statut de ${slot.slotName}`}
                                    value={slot.status}
                                    disabled={busySlotId === slot.id}
                                    onChange={(e) =>
                                      void handleStatusChange(slot, e.target.value as SlotStatus)
                                    }
                                    className="w-36 py-1.5 text-xs"
                                  >
                                    {(Object.keys(STATUS_LABELS) as SlotStatus[]).map((s) => (
                                      <option key={s} value={s}>
                                        {STATUS_LABELS[s]}
                                      </option>
                                    ))}
                                  </Select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {slot.status === "collected" ? (
                                    <span className="font-semibold text-success">
                                      {formatMoney(slot.winAmount, detail!.currency)}
                                    </span>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-primary-strong">
                                  {slot.status === "collected" && slot.stake > 0
                                    ? `${mult.toFixed(1)}x`
                                    : "—"}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      aria-label={`Éditer la slot ${slot.slotName}`}
                                      onClick={() => {
                                        setEditingSlot(slot);
                                        setSlotFormOpen(true);
                                      }}
                                      className="cursor-pointer rounded-lg border border-border px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-3 hover:text-foreground"
                                    >
                                      <IconPencil className="size-3.5" />
                                    </button>
                                    <button
                                      aria-label={`Supprimer la slot ${slot.slotName}`}
                                      disabled={busySlotId === slot.id}
                                      onClick={() => void handleDeleteSlot(slot)}
                                      className="cursor-pointer rounded-lg border border-rose/30 px-2 py-1 text-xs text-rose transition-colors hover:bg-rose/10 disabled:opacity-40"
                                    >
                                      {busySlotId === slot.id ? (
                                        <Spinner className="size-3.5" />
                                      ) : (
                                        <IconTrash className="size-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                {/* Graphiques */}
                <HuntCharts data={charts} currency={detail.currency} />
              </>
            )}
          </div>
        </div>
      )}

      {detail && (
        <SlotForm
          key={`${slotFormOpen}-${editingSlot?.id ?? "new"}`}
          open={slotFormOpen}
          onClose={() => setSlotFormOpen(false)}
          onSaved={handleSlotSaved}
          huntId={detail.id}
          currency={detail.currency}
          editing={editingSlot}
        />
      )}

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Paramètres du hunt"
      >
        <div className="space-y-4">
          <Input
            label="Nom du hunt"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={120}
          />
          <Select
            label="Devise"
            value={editCurrency}
            onChange={(e) => setEditCurrency(e.target.value as Currency)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.label}
              </option>
            ))}
          </Select>
          <Input
            label="Montant de départ"
            type="number"
            min="0"
            step="0.01"
            value={editStartingAmount}
            onChange={(e) => setEditStartingAmount(e.target.value)}
          />
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" onClick={() => setSettingsOpen(false)} disabled={savingSettings}>
              Annuler
            </Button>
            <Button onClick={() => void handleSaveSettings()} loading={savingSettings}>
              {savingSettings ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
