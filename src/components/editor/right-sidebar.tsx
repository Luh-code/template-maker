"use client";

import { useDesignStore } from "@/store/design-store";
import { ImageThumbnail } from "./image-thumbnail";
import { TileToolbar } from "./tile-toolbar";
import { TextLayerToolbar } from "./text-layer-toolbar";

export function RightSidebar() {
  const images = useDesignStore((s) => s.design.images);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 thin-scrollbar">
      <TileToolbar />
      <TextLayerToolbar />

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Uploaded photos ({images.length})
        </h3>
        {images.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Upload photos from the left panel, then drag them onto the heart
            collage — or select a tile and click a photo to place it.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <ImageThumbnail key={image.id} image={image} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
