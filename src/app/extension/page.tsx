import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  IconCheck,
  IconDownload,
  IconFlame,
  IconLink,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Extension Chrome",
  description:
    "Télécharge l'extension FlambHub pour ajouter tes bonus sans quitter ton casino.",
};

const steps = [
  {
    title: "Télécharge le fichier",
    description:
      "Clique sur le bouton ci-dessus : tu reçois un fichier extension.zip.",
  },
  {
    title: "Décompresse-le",
    description:
      "Double-clic sur le ZIP : un dossier « extension » est créé à côté.",
  },
  {
    title: "Charge-le dans Chrome",
    description:
      "Ouvre chrome://extensions, active le « Mode développeur » (en haut à droite), puis clique « Charger l'extension non empaquetée » et choisis le dossier « extension ».",
  },
  {
    title: "Épingle et relie ton compte",
    description:
      "Épingle l'icône FlambHub (icône puzzle → 📌). Au premier lancement, entre l'URL du site et ton code de liaison (page Bonus Hunt → « Lier l'extension »).",
  },
];

const features = [
  { icon: IconFlame, label: "Encoche flottante sur toutes les pages" },
  { icon: IconDownload, label: "Ajoute tes slots en un clic pendant que tu joues" },
  { icon: IconCheck, label: "Mode « Hunt fini » : écris les résultats un par un" },
  { icon: IconLink, label: "Synchronisé avec le site : RTP, stats et graphiques" },
];

export default function ExtensionPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        icon={<IconDownload className="size-6" />}
        title="Extension Chrome"
        subtitle="Ajoute et collecte tes bonus sans jamais quitter ton casino : une petite encoche flottante s'ouvre sur n'importe quelle page."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold">Installation en 4 étapes</h2>
            <ol className="mt-4 space-y-4">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary-strong">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">
              Pas encore sur le Chrome Web Store : l&apos;installation en mode
              développeur est gratuite et prend 2 minutes. La publication
              officielle arrivera bientôt.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-bold">Ce que ça fait</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-2/60 p-3.5 text-sm"
                >
                  <feature.icon className="mt-0.5 size-4 shrink-0 text-primary-strong" />
                  {feature.label}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glow-primary border-primary/30 p-6 text-center">
            <Badge tone="flame" className="mb-3">
              Gratuit
            </Badge>
            <h2 className="font-display text-xl font-bold">FlambHub pour Chrome</h2>
            <p className="mt-2 text-sm text-muted">
              Version 2.0 — l&apos;encoche Bonus Hunt, discrète et toujours
              disponible.
            </p>
            <a
              href="/extension.zip"
              download
              className="glow-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-3.5 font-semibold text-white transition-all hover:brightness-110"
            >
              <IconDownload className="size-5" />
              Télécharger l&apos;extension
            </a>
            <p className="mt-3 text-xs text-muted">
              Fichier ZIP · 50 Ko · Chrome 116 ou plus
            </p>
          </Card>

          <Card className="p-5 text-sm text-muted">
            Besoin d&apos;aide ? Va sur la page{" "}
            <Link href="/bonus-hunt" className="font-semibold text-primary-strong hover:underline">
              Bonus Hunt
            </Link>{" "}
            pour récupérer ton code de liaison, ou écris dans la communauté
            Flambette.
          </Card>
        </div>
      </div>
    </div>
  );
}
