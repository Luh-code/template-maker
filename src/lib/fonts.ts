import type { FontId } from "@/types";

/** Maps our font ids to the real font-family names next/font loads them under. */
export const CANVAS_FONT_FAMILY: Record<FontId, string> = {
  "great-vibes": "Great Vibes",
  "dancing-script": "Dancing Script",
  parisienne: "Parisienne",
  sacramento: "Sacramento",
};

/** Ensures a given font is fully loaded before it's used on a <canvas>. */
export async function ensureFontLoaded(fontId: FontId, size = 64) {
  const family = CANVAS_FONT_FAMILY[fontId];
  try {
    await document.fonts.load(`${size}px "${family}"`);
    await document.fonts.ready;
  } catch {
    // Font loading APIs unavailable — canvas will fall back to a default font.
  }
}
