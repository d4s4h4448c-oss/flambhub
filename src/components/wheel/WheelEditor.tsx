"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/Form";
import { flambFetch } from "@/lib/client";
import { IconShuffle } from "@/components/ui/Icons";
import type { EntryInput } from "@/lib/validation/schemas";

interface DraftEntry {
  key: string;
  label: string;
  weight: string;
}

function toDraft(entries: EntryInput[]): DraftEntry[] {
  return entries.map((e) => ({
    key: crypto.randomUUID(),
    label: e.label,
    weight: String(e.weight),
  }));
}

export default function WheelEditor({
  open,
  onClose,
  onSaved,
  onDeleted,
  wheelId,
  initialName = "",
  initialEntries = [],
  mode,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  onDeleted?: () => void;
  wheelId?: string;
  initialName?: string;
  initialEntries?: EntryInput[];
  mode: "create" | "edit";
}) {
  const [name, setName] = useState(initialName);
  const [entries, setEntries] = useState<DraftEntry[]>(() =>
    initialEntries.length > 0 ? toDraft(initialEntries) : [],
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickEntry, setQuickEntry] = useState("");

  const updateEntry = (key: string, patch: Partial<DraftEntry>) => {
    setEntries((list) =>
      list.map((e) => (e.key === key ? { ...e, ...patch } : e)),
    );
  };

  const addEntry = () => {
    setEntries((list) => [
      ...list,
      { key: crypto.randomUUID(), label: "", weight: "1" },
    ]);
  };

  const addQuickEntry = () => {
    const label = quickEntry.trim();
    if (!label) return;
    setEntries((list) => [
      ...list,
      { key: crypto.randomUUID(), label, weight: "1" },
    ]);
    setQuickEntry("");
  };

  const removeEntry = (key: string) => {
    setEntries((list) => list.filter((e) => e.key !== key));
  };

  const shuffleEntries = () => {
    setEntries((list) => {
      const next = [...list];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  const handleSave = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Donne un nom à ta roue.");
      return;
    }
    if (entries.length === 0) {
      setError("Ajoute au moins une entrée à la roue.");
      return;
    }
    const payload = entries.map((e) => ({
      label: e.label.trim(),
      weight: Number(e.weight),
    }));
    if (payload.some((e) => !e.label)) {
      setError("Chaque entrée doit avoir un libellé.");
      return;
    }
    if (
      payload.some(
        (e) => !Number.isInteger(e.weight) || e.weight < 1 || e.weight > 1000,
      )
    ) {
      setError("Chaque poids doit être un entier entre 1 et 1000.");
      return;
    }

    setSaving(true);
    try {
      const res = await flambFetch(wheelId ? `/api/wheels/${wheelId}` : "/api/wheels", {
        method: wheelId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), entries: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Impossible d'enregistrer la roue.");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!wheelId || deleting) return;
    if (!window.confirm("Supprimer définitivement cette roue et son historique de tirages ?")) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      const res = await flambFetch(`/api/wheels/${wheelId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Suppression impossible.");
      }
      onDeleted?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={mode === "create" ? "Créer une roue" : "Modifier la roue"}>
      <div className="flex h-full flex-col gap-4">
        <Input
          label="Nom de la roue"
          placeholder="Ex : Qui joue ?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          autoFocus
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted">
              Entrées ({entries.length})
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={entries.length < 2}
                onClick={shuffleEntries}
              >
                <IconShuffle className="size-3.5" />
                Mélanger
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={entries.length === 0}
                onClick={() => {
                  if (window.confirm("Effacer toutes les entrées de cette roue ?")) {
                    setEntries([]);
                  }
                }}
              >
                Effacer tout
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={addEntry}>
                + Ajouter
              </Button>
            </div>
          </div>

          {entries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface-2 px-4 py-6 text-center text-sm text-muted">
              Aucune entrée pour l&apos;instant. Écris un nom ci-dessous et
              appuie sur Entrée ↵.
            </p>
          ) : (
            <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {entries.map((entry, index) => {
                return (
                  <li
                    key={entry.key}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-2"
                  >
                    <div className="min-w-0 flex-1">
                      <Input
                        aria-label={`Libellé de l'entrée ${index + 1}`}
                        placeholder={`Entrée ${index + 1}`}
                        value={entry.label}
                        onChange={(e) => updateEntry(entry.key, { label: e.target.value })}
                        maxLength={100}
                        className="py-2"
                      />
                    </div>
                    <div className="w-16 shrink-0">
                      <Input
                        aria-label={`Poids de l'entrée ${index + 1}`}
                        title="Poids du tirage (×1, ×2…)"
                        type="number"
                        min={1}
                        max={1000}
                        value={entry.weight}
                        onChange={(e) => updateEntry(entry.key, { weight: e.target.value })}
                        className="py-2 text-center"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Supprimer l'entrée"
                      onClick={() => removeEntry(entry.key)}
                      className="shrink-0 cursor-pointer rounded-lg border border-rose/30 px-2.5 py-2 text-rose transition-colors hover:bg-rose/10"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Input
            placeholder="Écris un nom puis Entrée ↵ pour l'ajouter"
            value={quickEntry}
            onChange={(e) => setQuickEntry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addQuickEntry();
              }
            }}
            maxLength={100}
            className="shrink-0"
          />
        </div>

        {error && <Alert tone="error" className="shrink-0">{error}</Alert>}

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border pt-4">
          {wheelId ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => void handleDelete()}
              loading={deleting}
            >
              {deleting ? "Suppression…" : "Supprimer la roue"}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={saving || deleting}>
              Annuler
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={deleting}>
              {saving ? "Enregistrement…" : mode === "create" ? "Créer la roue" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
