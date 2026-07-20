"use client";

import { useState } from "react";
import { Copy, SlidersHorizontal, Trash2 } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { UploadedImage } from "@/types";
import { cn } from "@/lib/utils";
import { IMAGE_DATA_TYPE } from "./photo-tile";

export function ImageThumbnail({ image, index }: { image: UploadedImage; index: number }) {
  const selectedTileId = useDesignStore((s) => s.selectedTileId);
  const assignImageToTile = useDesignStore((s) => s.assignImageToTile);
  const removeImage = useDesignStore((s) => s.removeImage);
  const duplicateImage = useDesignStore((s) => s.duplicateImage);
  const reorderImages = useDesignStore((s) => s.reorderImages);
  const updateImageLive = useDesignStore((s) => s.updateImageLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(IMAGE_DATA_TYPE, image.id);
        e.dataTransfer.setData("application/x-mfd-image-index", String(index));
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const fromIndex = Number(e.dataTransfer.getData("application/x-mfd-image-index"));
        if (!Number.isNaN(fromIndex) && fromIndex !== index) {
          reorderImages(fromIndex, index);
        }
      }}
      onClick={() => {
        if (selectedTileId) assignImageToTile(selectedTileId, image.id);
      }}
      className={cn(
        "group relative aspect-square cursor-grab overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700",
        isDragOver && "ring-2 ring-amber-400"
      )}
      title={selectedTileId ? "Click to place in selected tile" : "Drag onto a tile"}
    >
      <img src={image.src} alt={image.name} className="h-full w-full object-cover" draggable={false} />

      <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto rounded bg-white/90 p-1 text-neutral-700 hover:bg-white"
            >
              <SlidersHorizontal className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            className="w-56"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label>Brightness</Label>
                <Slider
                  min={40}
                  max={160}
                  step={1}
                  value={[image.brightness]}
                  onValueChange={([v]) => updateImageLive(image.id, { brightness: v })}
                  onPointerDown={beginInteraction}
                  onPointerUp={endInteraction}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Contrast</Label>
                <Slider
                  min={40}
                  max={160}
                  step={1}
                  value={[image.contrast]}
                  onValueChange={([v]) => updateImageLive(image.id, { contrast: v })}
                  onPointerDown={beginInteraction}
                  onPointerUp={endInteraction}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Saturation</Label>
                <Slider
                  min={0}
                  max={200}
                  step={1}
                  value={[image.saturation]}
                  onValueChange={([v]) => updateImageLive(image.id, { saturation: v })}
                  onPointerDown={beginInteraction}
                  onPointerUp={endInteraction}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateImage(image.id);
          }}
          className="pointer-events-auto rounded bg-white/90 p-1 text-neutral-700 hover:bg-white"
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeImage(image.id);
          }}
          className="pointer-events-auto rounded bg-white/90 p-1 text-red-600 hover:bg-white"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
