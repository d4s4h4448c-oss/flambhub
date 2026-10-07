import type { Metadata } from "next";
import type { FC } from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  IconActivity,
  IconBadge,
  IconBarChart,
  IconBot,
  IconChat,
  IconEvent,
  IconFlame,
  IconGem,
  IconGift,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrophy,
  IconUser,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "À venir",
};

const groups: Array<{
  title: string;
  features: Array<{ Icon: FC<{ className?: string }>; name: string; description: string }>;
}> = [
  {
    title: "Communauté & profils",
    features: [
      { Icon: IconUser, name: "Profils membres", description: "Un profil public par membre de la communauté de Flambette." },
      { Icon: IconChat, name: "Connexion Discord", description: "Connexion via Discord OAuth pour relier ton compte FlambHub à ton identité Discord." },
      { Icon: IconBarChart, name: "Classements", description: "Classements de la communauté : roues, Bonus Hunts, activité." },
      { Icon: IconActivity, name: "Activité communautaire", description: "Un fil d'activité partagé pour suivre ce qui se passe sur FlambHub." },
      { Icon: IconEvent, name: "Événements", description: "Événements spéciaux de la communauté, en direct et en replay." },
    ],
  },
  {
    title: "Gamification",
    features: [
      { Icon: IconStar, name: "XP", description: "Gagne de l'expérience en participant aux activités de FlambHub." },
      { Icon: IconTrophy, name: "Niveaux", description: "Progresse à travers les niveaux et débloque des avantages." },
      { Icon: IconTarget, name: "Quêtes", description: "Des objectifs à compléter pour la communauté." },
      { Icon: IconGift, name: "Récompenses", description: "Des récompenses à débloquer avec tes points." },
      { Icon: IconBadge, name: "Badges", description: "Collectionne les badges qui racontent ton parcours." },
      { Icon: IconFlame, name: "Streaks", description: "Maintiens ta série d'activité et fais grimper ton streak." },
      { Icon: IconGem, name: "Points communautaires", description: "La monnaie interne de FlambHub pour la communauté." },
    ],
  },
  {
    title: "Intégration Discord",
    features: [
      { Icon: IconBot, name: "Bot Discord", description: "Un bot dédié pour lancer des roues et suivre les Bonus Hunts directement depuis Discord." },
    ],
  },
];

export default function ComingSoonPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        icon={<IconSparkles className="size-6" />}
        title="À venir"
        subtitle="Voici ce qui arrive sur FlambHub. Ces fonctionnalités ne sont pas encore actives — elles arrivent dans les prochaines versions."
      />
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="font-display mb-4 text-lg font-bold text-foreground">
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature) => (
                <Card key={feature.name} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-strong">
                      <feature.Icon className="size-5" />
                    </span>
                    <Badge tone="violet">À venir</Badge>
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">{feature.name}</h3>
                  <p className="mt-1 text-sm text-muted">{feature.description}</p>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
