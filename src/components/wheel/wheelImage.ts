import {
  darken,
  lighten,
  polarFrom,
  slicePath,
  truncateLabel,
  type WheelGeometryEntry,
} from "./wheelGeometry";
import { flameDefsMarkup, flameGroupMarkup } from "@/components/flame";

const SIZE = 1000;
const CENTER = SIZE / 2;
const RADIUS = 455;
const HUB_RADIUS = 128;
const LABEL_RADIUS = RADIUS * 0.6;

const DOTS_RING_RADIUS = RADIUS + 36;
const DOTS_COUNT = 32;
const DOTS_GAP = (2 * Math.PI * DOTS_RING_RADIUS) / DOTS_COUNT;

export function buildWheelSvgMarkup(entries: WheelGeometryEntry[]): string {
  const slice = entries.length > 0 ? 360 / entries.length : 360;

  const gradients = entries
    .map(
      (entry, index) => `<radialGradient id="flamb-seg-${index}" cx="50%" cy="50%" r="55%">
<stop offset="0%" stop-color="${lighten(entry.color, 0.35)}"/>
<stop offset="65%" stop-color="${entry.color}"/>
<stop offset="100%" stop-color="${darken(entry.color, 0.4)}"/>
</radialGradient>`,
    )
    .join("\n");

  const slices = entries
    .map((entry, index) => {
      const start = index * slice;
      const end = start + slice;
      const mid = start + slice / 2;
      const [lx, ly] = polarFrom(CENTER, mid, LABEL_RADIUS);
      const flip = mid > 90 && mid < 270;
      return `<path d="${slicePath(CENTER, RADIUS, start, end)}" fill="url(#flamb-seg-${index})" stroke="#05070c" stroke-width="5"/>
<text x="${lx}" y="${ly}" fill="#ffffff" font-size="42" font-weight="800" text-anchor="start" dominant-baseline="middle" transform="rotate(${flip ? mid + 180 : mid} ${lx} ${ly})" stroke="rgba(5,7,12,0.55)" stroke-width="8" paint-order="stroke" font-family="Arial, sans-serif">${truncateLabel(entry.label, 13)}</text>`;
    })
    .join("\n");

  const rings = `<circle cx="${CENTER}" cy="${CENTER}" r="${RADIUS + 76}" fill="none" stroke="rgba(59,130,246,0.14)" stroke-width="3"/>
<circle cx="${CENTER}" cy="${CENTER}" r="${DOTS_RING_RADIUS}" fill="none" stroke="rgba(96,165,250,0.55)" stroke-width="10" stroke-linecap="round" stroke-dasharray="0.1 ${DOTS_GAP - 0.1}"/>
<circle cx="${CENTER}" cy="${CENTER}" r="${RADIUS + 5}" fill="none" stroke="rgba(5,7,12,0.9)" stroke-width="6"/>`;

  const hub = `<circle cx="${CENTER}" cy="${CENTER}" r="${HUB_RADIUS}" fill="#0a0e16" stroke="#2a3f5f" stroke-width="7"/>
<circle cx="${CENTER}" cy="${CENTER}" r="${HUB_RADIUS - 14}" fill="none" stroke="rgba(59,130,246,0.4)" stroke-width="3.5" stroke-dasharray="7 11"/>
<circle cx="${CENTER}" cy="${CENTER - 28}" r="88" fill="url(#flamb-hub-halo)"/>
${flameGroupMarkup("flamb-hub", CENTER, CENTER - 32, 2.1)}
<text x="${CENTER}" y="${CENTER + 95}" text-anchor="middle" font-size="21" font-weight="800" fill="#00C8FF" letter-spacing="4" font-family="Arial, sans-serif">FLAMBHUB</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
<rect width="${SIZE}" height="${SIZE}" fill="#05070c"/>
${flameDefsMarkup("flamb-hub")}
<defs>
${gradients}
</defs>
${rings}
${slices}
${hub}
</svg>`;
}

export async function downloadWheelPng(
  name: string,
  entries: WheelGeometryEntry[],
): Promise<void> {
  const svgMarkup = buildWheelSvgMarkup(entries);
  const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Impossible de générer l'image."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = SIZE * 2;
    canvas.height = SIZE * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non supporté.");
    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pngUrl = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = pngUrl;
    anchor.download = `${name.replace(/[^\w\d-]+/g, "-").toLowerCase() || "roue"}.png`;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
