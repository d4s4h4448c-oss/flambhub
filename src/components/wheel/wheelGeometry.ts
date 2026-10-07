export const WHEEL_COLORS = [
  "#1d4ed8",
  "#0891b2",
  "#2563eb",
  "#0369a1",
  "#3b82f6",
  "#155e75",
  "#4f46e5",
  "#0284c7",
  "#1e40af",
  "#22d3ee",
  "#60a5fa",
  "#0e7490",
];

export interface WheelGeometryEntry {
  label: string;
  color: string;
}

export function polarFrom(
  center: number,
  angleDeg: number,
  radius: number,
): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [center + radius * Math.sin(rad), center - radius * Math.cos(rad)];
}

export function slicePath(
  center: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  if (endAngle - startAngle >= 360) {
    return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`;
  }
  const [x0, y0] = polarFrom(center, startAngle, radius);
  const [x1, y1] = polarFrom(center, endAngle, radius);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${center} ${center} L ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1} Z`;
}

export function truncateLabel(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function mixHex(hex: string, ratio: number, toWhite: boolean): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const target = toWhite ? 255 : 0;
  const mix = (c: number) => clampByte(c + (target - c) * ratio);
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

export function lighten(hex: string, ratio = 0.3): string {
  return mixHex(hex, ratio, true);
}

export function darken(hex: string, ratio = 0.35): string {
  return mixHex(hex, ratio, false);
}
