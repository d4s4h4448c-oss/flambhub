import Link from "next/link";
import type { FC } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LogoMark } from "@/components/Logo";
import {
  IconBarChart,
  IconCrown,
  IconFlame,
  IconSlot,
  IconSparkles,
  IconWheel,
} from "@/components/ui/Icons";

const features: Array<{
  href: string;
  Icon: FC<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
}> = [
  {
    href: "/roue",
    Icon: IconWheel,
    title: "Roue",
    description:
      "Crée et lance des roues personnalisées pour la communauté : tirages pondérés, animation et historique.",
    cta: "Ouvrir la roue",
  },
  {
    href: "/bonus-hunt",
    Icon: IconSlot,
    title: "Bonus Hunt",
    description:
      "Suis tes hunts : montant de départ, slots avec mise, gains, profit, break even et machines remarquables.",
    cta: "Ouvrir Bonus Hunt",
  },
  {
    href: "/a-venir",
    Icon: IconSparkles,
    title: "À venir",
    description:
      "Discord, profils, XP, classements et bien plus : découvre la suite de FlambHub.",
    cta: "Découvrir",
  },
];

const menu: Array<{
  Icon: FC<{ className?: string }>;
  label: string;
  note: string;
}> = [
  { Icon: IconWheel, label: "Des roues à volonté", note: "offertes par la maison" },
  { Icon: IconSlot, label: "Des Bonus Hunts illimités", note: "offerts par la maison" },
  { Icon: IconBarChart, label: "Des stats qui brillent", note: "offertes par la maison" },
  { Icon: IconSparkles, label: "Discord, XP, classements…", note: "bientôt, offerts par la maison" },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section className="py-10 text-center sm:py-16">
        <div className="mb-6 flex justify-center">
          <LogoMark size={92} />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <Badge tone="flame" className="px-3 py-1 text-sm">
            <IconFlame className="size-3.5" />
            La communauté de Flambette
          </Badge>
          <Badge tone="violet" className="px-3 py-1 text-sm">
            <IconCrown className="size-3.5" />
            C&apos;est Flambette qui régale
          </Badge>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Bienvenue sur <span className="text-gradient">FlambHub</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
          Le hub de la communauté de Flambette : des roues pour animer tes streams,
          des Bonus Hunts pour suivre tes sessions, et la suite arrive.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/roue"
            className="glow-primary inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-strong"
          >
            <IconWheel className="size-5" />
            Lancer une roue
          </Link>
          <Link
            href="/bonus-hunt"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-6 py-3 font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-3"
          >
            <IconSlot className="size-5 text-primary-strong" />
            Ouvrir Bonus Hunt
          </Link>
        </div>
      </section>

      {/* Cartes principales */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.href} hover className="flex flex-col p-6">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary-strong">
              <feature.Icon className="size-7" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {feature.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
            <Link
              href={feature.href}
              className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-xl bg-primary/15 px-4 py-2 text-sm font-semibold text-primary-strong transition-colors hover:bg-primary/25"
            >
              {feature.cta}
              <span aria-hidden>→</span>
            </Link>
          </Card>
        ))}
      </section>

      {/* Clin d'œil à Flambette */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-surface via-surface-2 to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary-strong shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <IconCrown className="size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold">
              Merci{" "}
              <span className="text-gradient">Flambette</span>
            </h2>
            <p className="mt-1 text-sm text-muted">
              Ce site existe grâce à lui — c&apos;est Flambette qui régale.
              Tout ce qui est ici est offert par la maison, sans contrepartie.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {menu.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/80 px-3.5 py-2.5 text-sm"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-strong">
                    <item.Icon className="size-4.5" />
                  </span>
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto text-xs text-primary-strong">
                    {item.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted/70">
              Aucun remboursement. Les gains sont virtuels. Les souvenirs, eux,
              sont bien réels.
            </p>
          </div>
        </div>
      </section>

      {/* Esprit FlambHub */}
      <section className="mt-10 rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold text-foreground">
          <IconFlame className="size-5 text-primary-strong" />
          L&apos;esprit FlambHub
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Tout ce que tu vois ici est réel et fonctionnel : les tirages de roue
          sont calculés et enregistrés côté serveur, les statistiques des Bonus
          Hunts sont recalculées à partir des données saisies. FlambHub ne
          triche pas — et toi non plus. 😉
        </p>
      </section>
    </div>
  );
}
