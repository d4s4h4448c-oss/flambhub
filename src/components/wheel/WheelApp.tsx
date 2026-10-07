"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import WheelCanvas, { WHEEL_COLORS, type WheelEntryView } from "./WheelCanvas";
import { downloadWheelPng } from "./wheelImage";
import WheelEditor from "./WheelEditor";
import {
  IconDice,
  IconDownload,
  IconHistory,
  IconPencil,
  IconTrash,
  IconTrophy,
  IconWheel,
} from "@/components/ui/Icons";
import { flambFetch } from "@/lib/client";
import type { EntryInput } from "@/lib/validation/schemas";

interface Wheel {
  id: string;
  name: string;
  entries: Array<{ id: string; label: string; weight: number; position: number }>;
  createdAt: string;
  updatedAt: string;
}

interface HistoryItem {
  id: string;
  wheelName: string;
  resultLabel: string;
  createdAt: string;
}

interface SpinPayload {
  spin: {
    spinId: string;
    wheelId: string;
    wheelName: string;
    entryId: string;
    resultLabel: string;
    createdAt: string;
    replayed: boolean;
  };
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

export default function WheelApp() {
  const [wheels, setWheels] = useState<Wheel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [spinning, setSpinning] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [eliminating, setEliminating] = useState(false);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [resultOverlayOpen, setResultOverlayOpen] = useState(false);
  const [spinToken, setSpinToken] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [result, setResult] = useState<SpinPayload["spin"] | null>(null);
  const [spinError, setSpinError] = useState<string | null>(null);
  const spinRef = useRef<SpinPayload["spin"] | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingWheel, setEditingWheel] = useState<Wheel | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const selectedWheel = wheels.find((w) => w.id === selectedId) ?? null;

  const loadWheels = useCallback(async () => {
    try {
      const res = await flambFetch("/api/wheels", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Impossible de charger les roues.");
      const list: Wheel[] = data.wheels ?? [];
      setWheels(list);
      setHistory(data.history ?? []);
      setSelectedId((prev) =>
        prev && list.some((w) => w.id === prev)
          ? prev
          : (list[0]?.id ?? null),
      );
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Chargement initial : pattern fetch-on-mount (setState async).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWheels();
  }, [loadWheels]);

  const loadHistory = useCallback(async (wheelId: string) => {
    try {
      const res = await flambFetch(`/api/wheels/${wheelId}/history?limit=50`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur.");
      setHistory(data.history ?? []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    // Chargement de l'historique à la sélection (setState async).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedId) void loadHistory(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selectWheel = useCallback((wheelId: string) => {
    setSelectedId(wheelId);
    setResult(null);
    setSpinError(null);
    setShowHistory(false);
    setEliminated([]);
  }, []);

  const finishSpin = useCallback(() => {
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    setSpinning(false);
    const spin = spinRef.current;
    if (spin) {
      setResult(spin);
      setResultOverlayOpen(true);
      void loadHistory(spin.wheelId);
    }
  }, [loadHistory]);

  const handleSpin = useCallback(async () => {
    if (!selectedWheel || spinning) return;
    setSpinError(null);
    setResult(null);
    setSpinning(true);
    setActionError(null);

    const spinId = crypto.randomUUID();
    try {
      const res = await flambFetch(`/api/wheels/${selectedWheel.id}/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: spinId }),
      });
      const data: SpinPayload = await res.json();
      if (!res.ok) {
        throw new Error((data as unknown as { error: string }).error ?? "Erreur lors du tirage.");
      }

      spinRef.current = data.spin;
      const index = selectedWheel.entries.findIndex(
        (e) => e.id === data.spin.entryId,
      );
      if (index === -1) {
        finishSpin();
        return;
      }
      setTargetIndex(index);
      setSpinToken((t) => t + 1);
      finishTimerRef.current = setTimeout(finishSpin, 6000);
    } catch (err) {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      setSpinError(err instanceof Error ? err.message : "Erreur lors du tirage.");
      setSpinning(false);
    }
  }, [selectedWheel, spinning, finishSpin]);

  const entryViews: WheelEntryView[] = (selectedWheel?.entries ?? []).map(
    (entry, index) => ({
      id: entry.id,
      label: entry.label,
      weight: entry.weight,
      color: WHEEL_COLORS[index % WHEEL_COLORS.length],
    }),
  );

  const handleExport = useCallback(async () => {
    if (!selectedWheel || entryViews.length === 0 || exporting) return;
    setExporting(true);
    try {
      await downloadWheelPng(
        selectedWheel.name,
        entryViews.map(({ label, color }) => ({ label, color })),
      );
    } catch (err) {
      setSpinError(
        err instanceof Error ? err.message : "Erreur lors de l'export.",
      );
    } finally {
      setExporting(false);
    }
  }, [selectedWheel, entryViews, exporting]);

  const handleEliminate = useCallback(async () => {
    if (!selectedWheel || !result || eliminating || spinning) return;
    const remaining = selectedWheel.entries.filter((e) => e.id !== result.entryId);
    if (remaining.length === selectedWheel.entries.length) {
      setSpinError("Cette entrée n'est plus dans la roue.");
      return;
    }
    setEliminating(true);
    setSpinError(null);
    try {
      const res = await flambFetch(`/api/wheels/${selectedWheel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedWheel.name,
          entries: remaining.map((e) => ({ label: e.label, weight: e.weight })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Impossible de mettre à jour la roue.");
      }
      setEliminated((prev) => [...prev, result.resultLabel]);
      setResult(null);
      setResultOverlayOpen(false);
      await loadWheels();
    } catch (err) {
      setSpinError(err instanceof Error ? err.message : "Erreur d'élimination.");
    } finally {
      setEliminating(false);
    }
  }, [selectedWheel, result, eliminating, spinning, loadWheels]);

  const openCreate = () => {
    setEditingWheel(null);
    setEditorOpen(true);
  };

  const openEdit = () => {
    if (!selectedWheel) return;
    setEditingWheel(selectedWheel);
    setEditorOpen(true);
  };

  const handleSaved = () => {
    void loadWheels();
    if (selectedId) void loadHistory(selectedId);
  };

  const handleDeleted = () => {
    setResult(null);
    void loadWheels();
  };

  const initialEntries: EntryInput[] = (editingWheel?.entries ?? []).map((e) => ({
    label: e.label,
    weight: e.weight,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert tone="error">
        {loadError}
        <div className="mt-3">
          <Button variant="secondary" size="sm" onClick={() => void loadWheels()}>
            Réessayer
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {actionError && <Alert tone="error">{actionError}</Alert>}

      {wheels.length === 0 ? (
        <EmptyState
          icon={<IconWheel />}
          title="Aucune roue pour l'instant"
          description="Crée ta première roue : qui joue, quel slot, quel défi…"
          action={
            <Button size="lg" onClick={openCreate}>
              + Créer une roue
            </Button>
          }
        />
      ) : (
        <>
          {/* Sélecteur de roue */}
          <div className="flex flex-wrap items-center gap-2">
            {wheels.map((wheel) => {
              const active = wheel.id === selectedId;
              return (
                <button
                  key={wheel.id}
                  onClick={() => selectWheel(wheel.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 font-display text-sm font-semibold transition-all ${
                    active
                      ? "border-primary/50 bg-gradient-to-b from-primary/25 to-primary/5 text-foreground shadow-[0_0_18px_rgba(59,130,246,0.25)]"
                      : "border-border bg-surface/70 text-muted hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground"
                  }`}
                >
                  <IconWheel className={`size-4 ${active ? "text-cyan-300" : "opacity-80"}`} />
                  <span className="max-w-40 truncate">{wheel.name}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-primary/30 text-primary-strong"
                        : "bg-surface-3 text-muted"
                    }`}
                  >
                    {wheel.entries.length}
                  </span>
                </button>
              );
            })}
            <button
              onClick={openCreate}
              className="cursor-pointer rounded-xl border border-dashed border-border-strong px-3.5 py-2 font-display text-sm font-semibold text-primary-strong transition-colors hover:bg-primary/10"
            >
              + Nouvelle roue
            </button>
          </div>

          {/* Roue */}
          <div className="mx-auto w-full max-w-lg">
            <Card className="p-5 sm:p-6">
              <WheelCanvas
                key={selectedWheel?.id ?? "none"}
                entries={entryViews}
                spinToken={spinToken}
                targetIndex={targetIndex}
                spinning={spinning}
                onSpinEnd={finishSpin}
              />

              <div className="mt-5 flex flex-col items-center gap-3">
                <h2 className="font-display text-center text-xl font-bold">
                  {selectedWheel?.name}
                  <span
                    className="mx-auto mt-1.5 block h-0.5 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                    aria-hidden
                  />
                </h2>

                {entryViews.length > 0 && (
                  <div className="flex max-h-24 flex-wrap justify-center gap-1.5 overflow-y-auto">
                    {entryViews.map((entry) => (
                      <span
                        key={entry.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted"
                      >
                        <span
                          className="inline-block size-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.label}
                        <span className="text-primary-strong">×{entry.weight}</span>
                      </span>
                    ))}
                  </div>
                )}

                {eliminated.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <span className="text-xs text-muted">Éliminés :</span>
                    {eliminated.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 rounded-full border border-rose/30 bg-rose/10 px-2.5 py-0.5 text-xs text-rose line-through"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {entryViews.length === 1 ? (
                  <Card className="w-full max-w-xs border-primary/40 bg-primary/10 p-5 text-center">
                    <IconTrophy className="mx-auto size-8 text-[#00C8FF]" />
                    <p className="font-display mt-2 text-lg font-bold">
                      Le vainqueur de la roue :
                    </p>
                    <p className="font-display text-2xl font-bold text-gradient">
                      {entryViews[0].label}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Plus qu&apos;une entrée — la roue est terminée. Modifie-la
                      pour recommencer.
                    </p>
                  </Card>
                ) : (
                  <Button
                    size="lg"
                    variant="flame"
                    onClick={() => void handleSpin()}
                    loading={spinning}
                    disabled={entryViews.length < 2}
                    className="w-full max-w-xs"
                  >
                    {spinning ? "Tirage en cours…" : (
                      <>
                        <IconDice className="size-5" />
                        Lancer la roue
                      </>
                    )}
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={openEdit}>
                    <IconPencil className="size-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void handleExport()}
                    loading={exporting}
                    disabled={entryViews.length === 0}
                  >
                    {exporting ? "Export…" : (
                      <>
                        <IconDownload className="size-4" />
                        Exporter
                      </>
                    )}
                  </Button>
                </div>

                {entryViews.length === 0 && (
                  <p className="text-xs text-muted">
                    Cette roue n&apos;a plus d&apos;entrées — clique sur
                    « Modifier » pour en ajouter.
                  </p>
                )}

                {result && (
                  <div
                    className="animate-fade-in-up mt-4 w-full border-t border-border pt-4 text-center"
                  >
                    <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                      Résultat du tirage
                    </p>
                    <p className="font-display mt-1 text-3xl font-bold text-gradient">
                      {result.resultLabel}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {formatDateTime(result.createdAt)} · Roue « {result.wheelName} »
                    </p>
                    {result.replayed && (
                      <Badge tone="neutral" className="mt-2">
                        Tirage déjà enregistré — résultat conservé
                      </Badge>
                    )}
                    {selectedWheel &&
                      selectedWheel.entries.length > 1 &&
                      selectedWheel.entries.some((e) => e.id === result.entryId) && (
                        <div className="mt-3">
                          <Button
                            variant="danger"
                            onClick={() => void handleEliminate()}
                            loading={eliminating}
                          >
                            <IconTrash className="size-4" />
                            Éliminer « {result.resultLabel} »
                          </Button>
                          <p className="mt-2 text-xs text-muted">
                            Retire cette entrée de la roue et relance jusqu&apos;à
                            ce qu&apos;il ne reste qu&apos;un vainqueur.
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </Card>

            {spinError && (
              <Alert tone="error" className="mt-4">
                {spinError}
              </Alert>
            )}
          </div>

          {/* Historique repliable */}
          <div className="mx-auto w-full max-w-lg">
            <Card>
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                aria-expanded={showHistory}
              >
                <span className="flex items-center gap-2">
                  <IconHistory className="size-4" />
                  Historique des tirages ({history.length})
                </span>
                <span
                  className={`transition-transform ${showHistory ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {showHistory && (
                <div className="border-t border-border/60">
                  {history.length === 0 ? (
                    <p className="px-5 py-6 text-center text-sm text-muted">
                      Aucun tirage enregistré pour cette roue.
                    </p>
                  ) : (
                    <ul className="max-h-72 divide-y divide-border/60 overflow-y-auto">
                      {history.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 px-5 py-2.5"
                        >
                          <div className="min-w-0">
                            <span className="block truncate text-sm font-semibold">
                              {item.resultLabel}
                            </span>
                            <span className="block truncate text-xs text-muted">
                              {item.wheelName}
                            </span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="block text-xs text-muted">
                              {formatDateTime(item.createdAt)}
                            </span>
                            <code className="font-mono text-[10px] text-muted/60">
                              {item.id.slice(0, 8)}
                            </code>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      <WheelEditor
        key={`${editorOpen}-${editingWheel?.id ?? "new"}`}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
        mode={editingWheel ? "edit" : "create"}
        wheelId={editingWheel?.id}
        initialName={editingWheel?.name ?? ""}
        initialEntries={initialEntries}
      />

      {resultOverlayOpen && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
          onClick={() => setResultOverlayOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Résultat du tirage"
        >
          <div
            className="animate-pop w-full max-w-sm rounded-2xl border border-primary/40 bg-surface p-8 text-center shadow-2xl glow-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <span className="animate-pulse-glow rounded-2xl px-2">
                <IconDice className="size-8 text-[#00C8FF]" />
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Résultat du tirage
            </p>
            <p className="font-display mt-2 text-4xl font-bold text-gradient">
              {result.resultLabel}
            </p>
            <p className="mt-1 text-sm text-muted">a été sélectionné</p>

            <div className="mt-6 flex flex-col gap-2">
              {selectedWheel &&
                selectedWheel.entries.length > 1 &&
                selectedWheel.entries.some((e) => e.id === result.entryId) && (
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => void handleEliminate()}
                    loading={eliminating}
                  >
                    <IconTrash className="size-4" />
                    Supprimer « {result.resultLabel} »
                  </Button>
                )}
              <Button
                variant="secondary"
                onClick={() => setResultOverlayOpen(false)}
                disabled={eliminating}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
