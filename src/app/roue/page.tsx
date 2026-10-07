import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdminTokenField from "@/components/AdminTokenField";
import WheelApp from "@/components/wheel/WheelApp";
import { IconWheel } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Roue",
  description:
    "Crée et lance des roues personnalisées pour la communauté de Flambette. Tirages pondérés calculés côté serveur.",
};

export default function RouePage() {
  return (
    <div>
      <PageHeader
        icon={<IconWheel className="size-6" />}
        title="Roue"
        subtitle="Crée des roues personnalisées, pondère les entrées et lance des tirages équitables : le résultat est calculé et enregistré côté serveur."
      />
      <div className="space-y-6">
        <AdminTokenField />
        <WheelApp />
      </div>
    </div>
  );
}
