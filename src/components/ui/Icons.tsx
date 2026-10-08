interface IconProps {
  className?: string;
}

function base(className?: string) {
  return {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function IconHome({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M10 21v-5.5h4V21" />
    </svg>
  );
}

export function IconWheel({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  );
}

export function IconSlot({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="7.2" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="16.8" cy="12" r="1.7" />
      <path d="M17 5a4 4 0 0 1 4-4" />
    </svg>
  );
}

export function IconSparkles({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 4.5 13.6 9l4.4 1.5-4.4 1.5L12 16.5l-1.6-4.5L6 10.5l4.4-1.5Z" />
      <path d="M18.5 15.5 19.4 18l2.6.9-2.6.9-.9 2.5-.9-2.5-2.6-.9 2.6-.9Z" />
    </svg>
  );
}

export function IconHistory({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconCrown({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 17 3 8l5.5 4L12 5l3.5 7L21 8l-1 9Z" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function IconGift({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="4" y="12" width="16" height="9" rx="2" />
      <path d="M3 8h18v4H3z" />
      <path d="M12 8v13" />
      <path d="M12 8c-3.5 0-5.5-2-4-4 1.2-1.6 4-1 4 2 0-3 2.8-3.6 4-2 1.5 2-.5 4-4 4Z" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function IconChat({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}

export function IconBot({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3.5" r="1" />
      <path d="M9.5 13.5h.01M14.5 13.5h.01" strokeWidth="3" />
      <path d="M9.5 16.5h5" />
    </svg>
  );
}

export function IconStar({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z" />
    </svg>
  );
}

export function IconTrophy({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M7 4h10v6a5 5 0 0 1-10 0Z" />
      <path d="M7 6H4.5a2.5 2.5 0 0 0 0 5H7M17 6h2.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M12 15v3M8 21h8M10 18h4" />
    </svg>
  );
}

export function IconBarChart({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 21h18" />
      <path d="M7 17v-5M12 17V7M17 17v-9" />
    </svg>
  );
}

export function IconActivity({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBadge({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="9" r="5" />
      <path d="m12 6.5 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3Z" />
      <path d="m9 13.5-1.5 7.5 4.5-2.5 4.5 2.5-1.5-7.5" />
    </svg>
  );
}

export function IconFlame({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3c3.5 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 8.5 7 12 3Z" />
      <path d="M12 10.5c1.8 1.8 2.7 3.4 2.7 4.8A2.7 2.7 0 0 1 12 18a2.7 2.7 0 0 1-2.7-2.7c0-1.4.9-3 2.7-4.8Z" />
    </svg>
  );
}

export function IconEvent({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <path d="m12 13.5 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3Z" />
    </svg>
  );
}

export function IconGem({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M7 4h10l4 5-9 11L3 9Z" />
      <path d="M3 9h18" />
      <path d="m9 4 3 5 3-5" />
    </svg>
  );
}

export function IconWallet({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="6" width="18" height="14" rx="2.5" />
      <path d="M3 10.5h18" />
      <path d="M16 15h2" />
    </svg>
  );
}

export function IconCoins({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

export function IconTrendUp({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function IconDice({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M8.5 8.5h.01M15.5 8.5h.01M8.5 15.5h.01M15.5 15.5h.01M12 12h.01" strokeWidth="3.2" />
    </svg>
  );
}

export function IconPencil({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 3 21l.5-4.5Z" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconDownload({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function IconArrowLeft({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function IconGear({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconLink({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function IconShuffle({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}
