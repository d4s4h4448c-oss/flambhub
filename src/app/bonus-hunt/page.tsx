import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HuntApp from "@/components/hunt/HuntApp";
import { IconSlot } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Bonus Hunt",
  description:
    "Crée, suis et analyse tes Bonus Hunts : RTP, multiplicateurs, top slots et Bounty.",
};

export default function BonusHuntPage() {
  return (
    <div>
      <PageHeader
        icon={<IconSlot className="size-6" />}
        title="Bonus Hunt"
        subtitle="Crée un hunt avec ton montant de départ, ajoute tes slots avec leur mise, collecte tes gains : profit, break even, providers et machines remarquables sont calculés côté serveur."
      />
      <HuntApp />
    </div>
  );
}
