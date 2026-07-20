"use client";

import { generateBarcodeBars } from "@/lib/spotify-barcode";
import type { SpotifyData } from "@/types";

/** Spotify-logo glyph drawn with plain SVG circles/paths (no external asset). */
function SpotifyGlyph({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
      <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.4" />
      <path
        d="M6.5 9.5c3-1 8-.6 10.6 1.1M7 13c2.4-.8 6.4-.5 8.7.9M7.5 16.2c2-.6 5-.4 6.8.8"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpotifyCode({
  spotify,
  accentColor,
  textColor,
}: {
  spotify: SpotifyData;
  accentColor: string;
  textColor: string;
}) {
  const bars = generateBarcodeBars(spotify.url || spotify.songName);

  return (
    <div className="flex w-full flex-col gap-1.5" style={{ color: textColor }}>
      <div className="flex items-center gap-2">
        <SpotifyGlyph color={accentColor} />
        {spotify.barcodeImage ? (
          <img
            src={spotify.barcodeImage}
            alt="Spotify scan code"
            className="h-6 flex-1 object-contain object-left"
          />
        ) : (
          <div className="flex h-6 flex-1 items-center gap-[2px] overflow-hidden">
            {bars.map((h, i) => (
              <span
                key={i}
                className="inline-block w-[2px] shrink-0 rounded-full"
                style={{ height: `${h * 100}%`, backgroundColor: accentColor }}
              />
            ))}
          </div>
        )}
      </div>
      {(spotify.songName || spotify.artist) && (
        <div className="text-[10px] leading-tight opacity-80">
          {spotify.songName}
          {spotify.songName && spotify.artist ? " — " : ""}
          {spotify.artist}
        </div>
      )}
    </div>
  );
}
