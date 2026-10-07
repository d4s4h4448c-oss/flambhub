import type { ReactNode } from "react";

export type AlertTone = "success" | "error" | "info";

const tones: Record<AlertTone, string> = {
  success: "border-success/40 bg-success/10 text-success",
  error: "border-rose/40 bg-rose/10 text-rose",
  info: "border-primary/40 bg-primary/10 text-primary-strong",
};

const icons: Record<AlertTone, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export default function Alert({
  tone = "info",
  children,
  className = "",
}: {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${tones[tone]} ${className}`}
    >
      <span className="font-bold leading-5">{icons[tone]}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
