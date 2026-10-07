"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Input } from "@/components/ui/Form";
import { IconGear } from "@/components/ui/Icons";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/client";

export default function AdminTokenField() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [stored, setStored] = useState<string | null>(() =>
    typeof window === "undefined" ? null : getAdminToken(),
  );

  const save = () => {
    const v = value.trim();
    if (v) {
      setAdminToken(v);
      setStored(v);
    } else {
      clearAdminToken();
      setStored(null);
    }
    setValue("");
  };

  return (
    <Card className="p-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-muted transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <IconGear className="size-4" />
          Administration
          {stored && <Badge tone="emerald">activée</Badge>}
        </span>
        <span
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <Input
            type="password"
            placeholder={
              stored
                ? "Clé enregistrée — saisis-en une autre pour la changer"
                : "Clé d'administration"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              }
            }}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={save}>
              Enregistrer
            </Button>
            {stored && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  clearAdminToken();
                  setStored(null);
                }}
              >
                Retirer
              </Button>
            )}
          </div>
          <p className="text-xs text-muted">
            Nécessaire pour créer, modifier ou supprimer roues et hunts quand le
            serveur exige une clé. Laisse vide en mode communauté.
          </p>
        </div>
      )}
    </Card>
  );
}
