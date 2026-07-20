/**
 * Spotify "code" scan bars are generated server-side from a track's audio
 * analysis, which isn't available client-side. We approximate the look with
 * a deterministic pseudo-random bar pattern seeded from the track URL/name,
 * so the same input always renders the same "barcode" (and it visibly
 * updates whenever the user changes the link). Users can also upload a real
 * scan-code image to override this.
 */

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32 seeded PRNG for stable, repeatable bar heights. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns normalized bar heights (0.15-1) for a Spotify-style code. */
export function generateBarcodeBars(seed: string, barCount = 55): number[] {
  const rng = mulberry32(hashString(seed || "memory-frame-designer"));
  return Array.from({ length: barCount }, () => 0.15 + rng() * 0.85);
}
