"use client";

import { useRef } from "react";
import { useDesignStore } from "@/store/design-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fileToResizedDataUrl } from "@/lib/image-utils";

export function SpotifyPanel() {
  const spotify = useDesignStore((s) => s.design.spotify);
  const setSpotify = useDesignStore((s) => s.setSpotify);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="song-name">Song name</Label>
        <Input
          id="song-name"
          value={spotify.songName}
          onChange={(e) => setSpotify({ songName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="artist">Artist</Label>
        <Input
          id="artist"
          value={spotify.artist}
          onChange={(e) => setSpotify({ artist: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="spotify-url">Spotify URL</Label>
        <Input
          id="spotify-url"
          placeholder="https://open.spotify.com/track/..."
          value={spotify.url}
          onChange={(e) => setSpotify({ url: e.target.value })}
        />
        <p className="text-xs text-neutral-400">
          A scan-code style barcode is generated automatically from this link.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Custom barcode image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const src = await fileToResizedDataUrl(file, 800, 0.9);
            setSpotify({ barcodeImage: src });
          }}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Upload barcode
          </Button>
          {spotify.barcodeImage && (
            <Button size="sm" variant="ghost" onClick={() => setSpotify({ barcodeImage: null })}>
              Use generated
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
