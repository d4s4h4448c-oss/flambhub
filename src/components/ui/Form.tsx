import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      )}
      <input
        className={`${fieldBase} ${error ? "border-rose/60 focus:border-rose focus:ring-rose/25" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-rose">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted/80">{hint}</span>
      ) : null}
    </label>
  );
}

export function Textarea({ label, error, hint, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: ReactNode; error?: string; hint?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      )}
      <textarea
        className={`${fieldBase} min-h-20 resize-y ${error ? "border-rose/60 focus:border-rose focus:ring-rose/25" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-rose">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted/80">{hint}</span>
      ) : null}
    </label>
  );
}

export function Select({ label, error, hint, className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: ReactNode; error?: string; hint?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      )}
      <select className={`${fieldBase} ${error ? "border-rose/60" : ""} ${className}`} {...props}>
        {children}
      </select>
      {error ? (
        <span className="mt-1 block text-xs text-rose">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted/80">{hint}</span>
      ) : null}
    </label>
  );
}

export function Checkbox({ label, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 text-sm text-foreground ${className}`}>
      <input
        type="checkbox"
        className="size-4 cursor-pointer rounded border-border bg-surface-2 accent-[#3b82f6]"
        {...props}
      />
      {label}
    </label>
  );
}
