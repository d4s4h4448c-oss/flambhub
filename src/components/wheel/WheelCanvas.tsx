"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FlameDefs, FlameGroup, FlameHalo } from "@/components/flame";
import {
  WHEEL_COLORS,
  darken,
  lighten,
  polarFrom,
  slicePath,
  truncateLabel,
} from "./wheelGeometry";

export { WHEEL_COLORS };
export type { WheelGeometryEntry } from "./wheelGeometry";

export interface WheelEntryView {
  id: string;
  label: string;
  weight: number;
  color: string;
}

interface WheelCanvasProps {
  entries: WheelEntryView[];
  spinToken: number;
  targetIndex: number | null;
  spinning: boolean;
  onSpinEnd: () => void;
}

const SIZE = 460;
const CENTER = SIZE / 2;
const RADIUS = 200;
const HUB_RADIUS = 58;
const SPIN_DURATION_MS = 4600;
const FULL_TURNS = 5;

const DOTS_RING_RADIUS = RADIUS + 16;
const DOTS_COUNT = 32;
const DOTS_GAP = (2 * Math.PI * DOTS_RING_RADIUS) / DOTS_COUNT;

export default function WheelCanvas({
  entries,
  spinToken,
  targetIndex,
  spinning,
  onSpinEnd,
}: WheelCanvasProps) {
  const [rotation, setRotation] = useState(0);
  const animatingRef = useRef(false);
  const flameId = useId();

  const slice = useMemo(
    () => (entries.length > 0 ? 360 / entries.length : 0),
    [entries.length],
  );

  useEffect(() => {
    if (spinToken === 0) return;
    if (targetIndex === null || slice === 0) return;
    const jitter = slice * (0.15 + Math.random() * 0.7);
    const desiredMod = (360 - (targetIndex * slice + jitter) + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta =
      FULL_TURNS * 360 + ((desiredMod - currentMod + 360) % 360);
    animatingRef.current = true;
    // Animation impérative : la rotation cible dépend du résultat serveur,
    // d'où ce setState dans l'effet déclenché par le tirage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation((r) => r + delta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  const handleTransitionEnd = () => {
    if (!animatingRef.current) return;
    animatingRef.current = false;
    onSpinEnd();
  };

  return (
    <div className="relative mx-auto w-full max-w-[460px] select-none">
      <div className="relative aspect-square w-full">
        {/* Pointeur */}
        <div
          className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2"
          style={{ filter: "drop-shadow(0 0 10px rgba(96,165,250,0.95))" }}
        >
          <svg width="36" height="44" viewBox="0 0 36 44">
            <path d="M18 44 L3 9 Q18 0 33 9 Z" fill="url(#pointer-grad)" />
            <path d="M18 44 L9 9 Q18 4 27 9 Z" fill="#dbeafe" />
            <defs>
              <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          role="img"
          aria-label="Roue de tirage"
        >
          <defs>
            {entries.map((entry, index) => (
              <radialGradient
                key={entry.id}
                id={`flamb-seg-${index}`}
                cx="50%"
                cy="50%"
                r="55%"
              >
                <stop offset="0%" stopColor={lighten(entry.color, 0.35)} />
                <stop offset="65%" stopColor={entry.color} />
                <stop offset="100%" stopColor={darken(entry.color, 0.4)} />
              </radialGradient>
            ))}
          </defs>

          <FlameDefs id={flameId} />

          {/* Anneaux décoratifs */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + 34}
            fill="none"
            stroke="rgba(59,130,246,0.14)"
            strokeWidth="1.5"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={DOTS_RING_RADIUS}
            fill="none"
            stroke="rgba(96,165,250,0.55)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={`0.1 ${DOTS_GAP - 0.1}`}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + 2}
            fill="none"
            stroke="rgba(5,7,12,0.9)"
            strokeWidth="3"
          />

          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${CENTER}px ${CENTER}px`,
              transition:
                spinning && rotation !== 0
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.75, 0.18, 1)`
                  : "none",
              filter:
                "drop-shadow(0 12px 32px rgba(59,130,246,0.28))",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {entries.length > 0 &&
              entries.map((entry, index) => {
                const start = index * slice;
                const end = start + slice;
                const mid = start + slice / 2;
                const [lx, ly] = polarFrom(CENTER, mid, RADIUS * 0.6);
                const flip = mid > 90 && mid < 270;
                return (
                  <g key={entry.id}>
                    <path
                      d={slicePath(CENTER, RADIUS, start, end)}
                      fill={`url(#flamb-seg-${index})`}
                      stroke="#05070c"
                      strokeWidth="2.5"
                    />
                    <text
                      x={lx}
                      y={ly}
                      fill="#ffffff"
                      fontSize="19"
                      fontWeight="800"
                      textAnchor="start"
                      dominantBaseline="middle"
                      transform={`rotate(${flip ? mid + 180 : mid} ${lx} ${ly})`}
                      stroke="rgba(5,7,12,0.55)"
                      strokeWidth="3.5"
                      paintOrder="stroke"
                      style={{ pointerEvents: "none" }}
                    >
                      {truncateLabel(entry.label, 15)}
                    </text>
                  </g>
                );
              })}
          </g>

          {/* Moyeu */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={HUB_RADIUS}
            fill="#0a0e16"
            stroke="#2a3f5f"
            strokeWidth="3"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={HUB_RADIUS - 6}
            fill="none"
            stroke="rgba(59,130,246,0.4)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
          <FlameHalo id={flameId} cx={CENTER} cy={CENTER - 4} r={40} />
          <FlameGroup id={flameId} cx={CENTER} cy={CENTER - 3} scale={0.72} />
          <text
            x={CENTER}
            y={CENTER + 42}
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            fill="#00C8FF"
            letterSpacing="2"
          >
            FLAMBHUB
          </text>
        </svg>
      </div>

      {spinning && (
        <div className="pointer-events-none absolute inset-x-0 -bottom-3 text-center">
          <span className="animate-pulse-glow inline-block rounded-full border border-primary/40 bg-surface/95 px-4 py-1 text-xs font-semibold text-primary-strong">
            Tirage en cours…
          </span>
        </div>
      )}
    </div>
  );
}
