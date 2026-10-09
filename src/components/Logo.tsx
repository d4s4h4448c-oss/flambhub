"use client";

import { useId } from "react";
import Link from "next/link";
import { FlameDefs, FlameGroup } from "@/components/flame";

export function LogoMark({
  size = 30,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      style={{ filter: "drop-shadow(0 0 10px rgba(0,200,255,0.3))" }}
    >
      <FlameDefs id={id} />
      <FlameGroup id={id} cx={50} cy={50} scale={0.94} />
    </svg>
  );
}

export default function Logo({
  size = 30,
  href = "/",
  onClick,
}: {
  size?: number;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-2.5"
      aria-label="FlambHub — Accueil"
    >
      <LogoMark
        size={size}
        className="transition-transform duration-300 ease-out group-hover:-rotate-6"
      />
      <span className="font-display text-[1.375rem] font-extrabold tracking-[-0.03em]">
        Flamb
        <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Hub
        </span>
      </span>
    </Link>
  );
}
