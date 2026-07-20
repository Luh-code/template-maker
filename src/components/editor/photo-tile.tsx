"use client";

import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { ImagePlus, Lock } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { useElementSize } from "@/hooks/use-element-size";
import { clamp, cn } from "@/lib/utils";

const IMAGE_DATA_TYPE = "application/x-mfd-image-id";
const TILE_DATA_TYPE = "application/x-mfd-tile-id";

export function PhotoTile({ tileId }: { tileId: string }) {
  const tile = useDesignStore((s) => s.design.tiles[tileId]);
  const image = useDesignStore((s) =>
    s.design.images.find((img) => img.id === tile?.imageId)
  );
  const selectedTileId = useDesignStore((s) => s.selectedTileId);
  const setSelectedTile = useDesignStore((s) => s.setSelectedTile);
  const assignImageToTile = useDesignStore((s) => s.assignImageToTile);
  const updateTileLive = useDesignStore((s) => s.updateTileLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);

  const { ref: clipRef, size } = useElementSize<HTMLDivElement>();
  const nodeRef = useRef<HTMLImageElement | null>(null);
  const wheelActive = useRef(false);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!tile) return null;

  const isSelected = selectedTileId === tileId;
  const pxX = (tile.offsetX / 100) * size.width;
  const pxY = (tile.offsetY / 100) * size.height;
  const overflow = Math.max(size.width, size.height) * tile.zoom;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (tile.locked) return;
    const imageId = e.dataTransfer.getData(IMAGE_DATA_TYPE);
    const sourceTileId = e.dataTransfer.getData(TILE_DATA_TYPE);
    if (imageId) {
      assignImageToTile(tileId, imageId);
    } else if (sourceTileId && sourceTileId !== tileId) {
      const store = useDesignStore.getState();
      const sourceImageId = store.design.tiles[sourceTileId]?.imageId;
      if (sourceImageId) {
        store.mutate((d) => ({
          ...d,
          tiles: {
            ...d.tiles,
            [tileId]: { ...d.tiles[tileId], imageId: sourceImageId, offsetX: 0, offsetY: 0, zoom: 1 },
            [sourceTileId]: { ...d.tiles[sourceTileId], imageId: tile.imageId, offsetX: 0, offsetY: 0, zoom: 1 },
          },
        }));
      }
    }
  }

  function handleWheel(e: React.WheelEvent) {
    if (!image || tile.locked) return;
    e.preventDefault();
    if (!wheelActive.current) {
      beginInteraction();
      wheelActive.current = true;
    }
    const delta = -e.deltaY * 0.001;
    updateTileLive(tileId, { zoom: clamp(tile.zoom + delta, 1, 3) });
    if (wheelTimer.current) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {
      endInteraction();
      wheelActive.current = false;
    }, 500);
  }

  return (
    <div
      ref={clipRef}
      onClick={() => setSelectedTile(tileId)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onWheel={handleWheel}
      draggable={Boolean(image) && !tile.locked}
      onDragStart={(e) => {
        if (image) e.dataTransfer.setData(TILE_DATA_TYPE, tileId);
      }}
      style={{ borderRadius: `${tile.radius}%` }}
      className={cn(
        "relative h-full w-full cursor-pointer overflow-hidden bg-neutral-200/60",
        !image && "placeholder-checker flex items-center justify-center",
        isSelected && "ring-2 ring-amber-400 ring-offset-1",
        isDragOver && "ring-2 ring-emerald-400"
      )}
    >
      {image ? (
        <div
          className="absolute inset-0"
          style={{ transform: `rotate(${tile.rotation}deg) scale(${tile.zoom})` }}
        >
          <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLElement>}
            position={{ x: pxX, y: pxY }}
            disabled={tile.locked}
            bounds={{ left: -overflow, right: overflow, top: -overflow, bottom: overflow }}
            onStart={() => beginInteraction()}
            onDrag={(_, data) => {
              if (size.width === 0 || size.height === 0) return;
              updateTileLive(tileId, {
                offsetX: (data.x / size.width) * 100,
                offsetY: (data.y / size.height) * 100,
              });
            }}
            onStop={() => endInteraction()}
          >
            <img
              ref={nodeRef}
              src={image.src}
              alt=""
              draggable={false}
              className="absolute left-0 top-0 h-full w-full select-none object-cover"
              style={{
                filter: `brightness(${image.brightness}%) contrast(${image.contrast}%) saturate(${image.saturation}%)`,
              }}
            />
          </Draggable>
        </div>
      ) : (
        <ImagePlus className="h-1/3 w-1/3 text-neutral-400" />
      )}
      {tile.locked && (
        <div className="absolute right-0.5 top-0.5 rounded bg-black/50 p-0.5">
          <Lock className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

export { IMAGE_DATA_TYPE, TILE_DATA_TYPE };
