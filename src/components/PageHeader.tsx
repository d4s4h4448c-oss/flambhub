import type { ReactNode } from "react";

export default function PageHeader({
  icon,
  title,
  subtitle,
  actions,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/25 to-primary/5 text-primary-strong shadow-[0_0_24px_rgba(59,130,246,0.25)]">
          {icon}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <span
            className="mt-1.5 block h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent"
            aria-hidden
          />
        </div>
        {actions && <div className="ml-auto flex shrink-0 gap-2">{actions}</div>}
      </div>
      {subtitle && <p className="mt-4 max-w-2xl text-muted">{subtitle}</p>}
    </div>
  );
}
