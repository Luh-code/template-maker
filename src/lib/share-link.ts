import type { DesignState } from "@/types";

/**
 * Encodes the full design into the URL hash so a design can be shared via a
 * link with no backend. Note this has no size limit protection: designs with
 * many high-resolution photos produce very long links, since photos are
 * embedded as data URLs. It's best suited for sharing text/calendar/spotify
 * tweaks, not as a substitute for real image hosting.
 */
export function encodeDesignToHash(design: DesignState): string {
  const json = JSON.stringify(design);
  const encoded = btoa(encodeURIComponent(json));
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#d=${encoded}`;
}

export function decodeDesignFromHash(hash: string): DesignState | null {
  const match = /d=([^&]+)/.exec(hash);
  if (!match) return null;
  try {
    const json = decodeURIComponent(atob(match[1]));
    return JSON.parse(json) as DesignState;
  } catch {
    return null;
  }
}
