import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({
  children,
  hover = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`card-topline rounded-2xl border border-border bg-surface transition-all duration-200 ${hover ? "card-glow" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
