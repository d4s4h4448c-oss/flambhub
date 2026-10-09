"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { IconDownload, IconHome, IconSlot, IconSparkles, IconWheel } from "@/components/ui/Icons";

const links = [
  { href: "/", label: "Accueil", Icon: IconHome },
  { href: "/roue", label: "Roue", Icon: IconWheel },
  { href: "/bonus-hunt", label: "Bonus Hunt", Icon: IconSlot },
  { href: "/extension", label: "Extension", Icon: IconDownload },
  { href: "/a-venir", label: "À venir", Icon: IconSparkles },
];

function NavLink({
  href,
  label,
  Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-sm font-semibold transition-all ${
        active ? "bg-primary/15 text-white" : "text-muted hover:text-foreground"
      }`}
    >
      <span
        className={`flex size-7 items-center justify-center rounded-lg transition-all ${
          active
            ? "bg-gradient-to-b from-blue-500/40 to-blue-600/20 text-cyan-300 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
            : "bg-surface-3 text-muted group-hover:bg-surface-2 group-hover:text-foreground"
        }`}
      >
        <Icon className="size-4" />
      </span>
      {label}
      {active && (
        <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between px-4 pr-16 sm:px-6 sm:pr-16">
        <Logo size={30} onClick={() => setOpen(false)} />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              Icon={link.Icon}
              active={isActive(link.href)}
            />
          ))}
        </div>

        <button
          className="cursor-pointer rounded-xl border border-border bg-surface-2 p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/70 bg-surface/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.Icon}
                active={isActive(link.href)}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
