import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
        <div className="flex items-center gap-3">
          <Logo size={30} />
          <p className="text-sm text-muted">
            La plateforme de la communauté de Flambette
          </p>
        </div>
        <p className="text-xs text-muted/70">
          Offert par Flambette · V1 · Discord arrive bientôt
        </p>
      </div>
    </footer>
  );
}
