"use client";

import { Lock, LockOpen, RotateCcw, Trash2, X } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/** Contextual controls for the currently-selected heart-collage tile. */
export function TileToolbar() {
  const selectedTileId = useDesignStore((s) => s.selectedTileId);
  const tile = useDesignStore((s) =>
    selectedTileId ? s.design.tiles[selectedTileId] : undefined
  );
  const setSelectedTile = useDesignStore((s) => s.setSelectedTile);
  const updateTileLive = useDesignStore((s) => s.updateTileLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const toggleTileLock = useDesignStore((s) => s.toggleTileLock);
  const clearTile = useDesignStore((s) => s.clearTile);
  const mutate = useDesignStore((s) => s.mutate);

  if (!selectedTileId || !tile) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Selected tile
        </span>
        <button
          onClick={() => setSelectedTile(null)}
          className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {tile.imageId ? (
        <>
          <div className="flex flex-col gap-1.5">
            <Label>Zoom</Label>
            <Slider
              min={1}
              max={3}
              step={0.01}
              value={[tile.zoom]}
              onValueChange={([v]) => updateTileLive(selectedTileId, { zoom: v })}
              onPointerDown={beginInteraction}
              onPointerUp={endInteraction}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Rotation</Label>
            <Slider
              min={-20}
              max={20}
              step={1}
              value={[tile.rotation]}
              onValueChange={([v]) => updateTileLive(selectedTileId, { rotation: v })}
              onPointerDown={beginInteraction}
              onPointerUp={endInteraction}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Corner rounding</Label>
            <Slider
              min={0}
              max={50}
              step={1}
              value={[tile.radius]}
              onValueChange={([v]) => updateTileLive(selectedTileId, { radius: v })}
              onPointerDown={beginInteraction}
              onPointerUp={endInteraction}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() =>
                mutate((d) => ({
                  ...d,
                  tiles: {
                    ...d.tiles,
                    [selectedTileId]: { ...d.tiles[selectedTileId], offsetX: 0, offsetY: 0, zoom: 1, rotation: 0 },
                  },
                }))
              }
            >
              <RotateCcw /> Reset
            </Button>
            <Button size="sm" variant="outline" onClick={() => toggleTileLock(selectedTileId)}>
              {tile.locked ? <LockOpen /> : <Lock />}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => clearTile(selectedTileId)}>
              <Trash2 />
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-neutral-400">
          Drag a photo here, or select a photo in the panel to insert it.
        </p>
      )}
    </div>
  );
}
