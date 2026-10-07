import type { ReactNode } from "react";

type Tone = "violet" | "flame" | "rose" | "emerald" | "neutral";

const tones: Record<Tone, string> = {
  violet: "bg-primary/15 text-primary-strong border-primary/30",
  flame: "bg-flame/15 text-flame-strong border-flame/30",
  rose: "bg-rose/15 text-rose border-rose/30",
  emerald: "bg-success/15 text-success border-success/30",
  neutral: "bg-surface-3 text-muted border-border-strong",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
