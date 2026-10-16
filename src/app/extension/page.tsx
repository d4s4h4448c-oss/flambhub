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
  title: "Extension",
  description:
    "Télécharge l'extension FlambHub pour Chrome, Brave, Edge, Opera et Firefox : ajoute tes bonus sans quitter ton casino.",
};

const steps = [
  {
    title: "Télécharge le fichier",
    description:
      "Clique sur le bouton de ton navigateur : tu reçois un fichier ZIP.",
  },
  {
    title: "Décompresse-le",
    description:
      "Double-clic sur le ZIP : un dossier « extension » est créé à côté.",
  },
  {
    title: "Charge-le dans ton navigateur",
    description:
      "Ouvre la page des extensions de ton navigateur, active le « Mode développeur », puis « Charger l'extension non empaquetée » en choisissant le dossier « extension ».",
  },
  {
    title: "Épingle et relie ton compte",
    description:
      "Épingle l'icône FlambHub. Au premier lancement, entre l'URL du site et ton code de liaison (page Bonus Hunt → « Lier l'extension »).",
  },
];

const browsers = [
  { name: "Chrome", url: "chrome://extensions", file: "/extension.zip" },
  { name: "Brave", url: "brave://extensions", file: "/extension.zip" },
  { name: "Edge", url: "edge://extensions", file: "/extension.zip" },
  { name: "Opera", url: "opera://extensions", file: "/extension.zip" },
  { name: "Vivaldi", url: "vivaldi://extensions", file: "/extension.zip" },
  { name: "Firefox", url: "about:debugging#/runtime/this-firefox", file: "/extension-firefox.zip" },
];

const features = [
  { icon: IconFlame, label: "Encoche flottante déplaçable sur toutes les pages" },
  { icon: IconDownload, label: "Ajoute tes slots en un clic pendant que tu joues" },
  { icon: IconCheck, label: "Mode « Hunt fini » : écris les résultats un par un" },
  { icon: IconLink, label: "Synchronisé avec le site : RTP, stats et graphiques" },
];

export default function ExtensionPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        icon={<IconDownload className="size-6" />}
        title="Extension"
        subtitle="Ajoute et collecte tes bonus sans jamais quitter ton casino : une petite encoche flottante déplaçable s'ouvre sur n'importe quelle page."
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
              Pas encore sur les stores officiels : l&apos;installation en mode
              développeur est gratuite et prend 2 minutes. La publication
              officielle arrivera bientôt.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-bold">Navigateurs compatibles</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {browsers.map((browser) => (
                <div
                  key={browser.name}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2/60 p-3 text-sm"
                >
                  <span className="font-semibold">{browser.name}</span>
                  <a
                    href={browser.file}
                    download
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary-strong transition-colors hover:bg-primary/25"
                  >
                    <IconDownload className="size-3.5" />
                    ZIP
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              Firefox : « Charger un module complémentaire temporaire… » puis
              choisis le fichier <code className="rounded bg-surface-3 px-1">manifest.json</code>{" "}
              dans le dossier décompressé.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glow-primary border-primary/30 p-6 text-center">
            <Badge tone="flame" className="mb-3">
              Gratuit · v2.1
            </Badge>
            <h2 className="font-display text-xl font-bold">FlambHub pour ton navigateur</h2>
            <p className="mt-2 text-sm text-muted">
              Chrome, Brave, Edge, Opera, Vivaldi et Firefox — l&apos;encoche
              Bonus Hunt, discrète, déplaçable et toujours disponible.
            </p>
            <a
              href="/extension.zip"
              download
              className="glow-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-3.5 font-semibold text-white transition-all hover:brightness-110"
            >
              <IconDownload className="size-5" />
              Télécharger (Chrome / Brave / Edge)
            </a>
            <a
              href="/extension-firefox.zip"
              download
              className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-6 py-3 font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-3"
            >
              <IconDownload className="size-5" />
              Télécharger pour Firefox
            </a>
            <p className="mt-3 text-xs text-muted">
              Fichiers ZIP · ~65 Ko · version 2.1
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
