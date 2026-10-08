"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import { Checkbox, Input, Select } from "@/components/ui/Form";
import { IconFlame } from "@/components/ui/Icons";
import { flambFetch } from "@/lib/client";
import type { CatalogSlot, Currency, HuntSlot, SlotStatus } from "@/lib/types";

const STATUS_LABELS: Record<SlotStatus, string> = {
  pending: "En attente",
  in_progress: "En cours",
  collected: "Collecté",
};

function useSlotSearch(query: string) {
  const [results, setResults] = useState<CatalogSlot[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    const controller = new AbortController();
    const timer = setTimeout(
      () => {
        if (!q) {
          setResults([]);
          setSearching(false);
          return;
        }
        setSearching(true);
        fetch(`/api/slots?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
          .then((res) => res.json())
          .then((data) => setResults(data.slots ?? []))
          .catch(() => setResults([]))
          .finally(() => setSearching(false));
      },
      q ? 150 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, searching };
}

export default function SlotForm({
  open,
  onClose,
  onSaved,
  huntId,
  currency,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  huntId: string;
  currency: Currency;
  editing: HuntSlot | null;
}) {
  const [slotName, setSlotName] = useState(editing?.slotName ?? "");
  const [stake, setStake] = useState(editing ? String(editing.stake) : "");
  const [player, setPlayer] = useState(editing?.player ?? "");
  const [status, setStatus] = useState<SlotStatus>(editing?.status ?? "pending");
  const [isBounty, setIsBounty] = useState(editing?.isBounty ?? false);
  const [winAmount, setWinAmount] = useState(
    editing && editing.winAmount > 0 ? String(editing.winAmount) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { results, searching } = useSlotSearch(slotName);

  const pickSuggestion = (slot: CatalogSlot) => {
    setSlotName(slot.name);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    setError(null);
    if (!slotName.trim()) {
      setError("Le nom de la slot est requis.");
      return;
    }
    const stakeNum = Number(stake);
    if (!(stakeNum > 0)) {
      setError("La mise doit être un nombre supérieur à 0.");
      return;
    }
    const winNum = status === "collected" ? Number(winAmount) : 0;
    if (status === "collected" && winAmount.trim() === "") {
      setError("Renseigne le gain (0 si le bonus est mort).");
      return;
    }

    const body = {
      slotName: slotName.trim(),
      provider: "",
      stake: stakeNum,
      player: player.trim(),
      status,
      isBounty,
      winAmount: winNum,
    };

    setSaving(true);
    try {
      const url = editing
        ? `/api/hunts/${huntId}/slots/${editing.id}`
        : `/api/hunts/${huntId}/slots`;
      const res = await flambFetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible d'enregistrer la slot.");
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Éditer la slot" : "Ajouter une slot"}
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Recherche une slot"
            placeholder="Rechercher une slot…"
            value={slotName}
            onChange={(e) => {
              setSlotName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            maxLength={120}
            autoFocus
          />
          {showSuggestions && slotName.trim() && (results.length > 0 || searching) && (
            <ul className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-border-strong bg-surface-3 shadow-xl">
              {searching && (
                <li className="px-3.5 py-2 text-sm text-muted">Recherche…</li>
              )}
              {results.map((slot) => (
                <li key={`${slot.name}-${slot.provider}`}>
                  <button
                    type="button"
                    onClick={() => pickSuggestion(slot)}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition-colors hover:bg-primary/15"
                  >
                    <span className="truncate font-medium text-foreground">
                      {slot.name}
                    </span>
                    <span className="shrink-0 text-xs text-primary-strong">
                      {slot.provider}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={`Mise par spin (${currency})`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.50"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
          <Input
            label="Nom de l'utilisateur (optionnel)"
            placeholder="Ex : Flambette"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            maxLength={80}
          />
        </div>

        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Statut"
              value={status}
              onChange={(e) => setStatus(e.target.value as SlotStatus)}
            >
              {(Object.keys(STATUS_LABELS) as SlotStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
            {status === "collected" && (
              <Input
                label={`Gain (${currency})`}
                type="number"
                min="0"
                step="0.01"
                placeholder="12.50"
                value={winAmount}
                onChange={(e) => setWinAmount(e.target.value)}
              />
            )}
          </div>
        )}

        <Checkbox
          label={
            <span className="flex items-center gap-1.5">
              <IconFlame className="size-4 text-[#fb923c]" />
              Bounty
            </span>
          }
          checked={isBounty}
          onChange={(e) => setIsBounty(e.target.checked)}
        />

        {error && <Alert tone="error">{error}</Alert>}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={() => void handleSave()} loading={saving}>
            {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Ajouter la slot"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
