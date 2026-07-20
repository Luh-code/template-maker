"use client";

import { HEART_COLS, HEART_MATRIX, HEART_ROWS, generateHeartClipPath } from "@/lib/heart-layout";
import { useElementSize } from "@/hooks/use-element-size";
import { PhotoTile } from "./photo-tile";

/**
 * Renders the heart-shaped photo grid: a dense CSS grid of tiles, softened
 * into a smooth heart silhouette via a generated clip-path so the bitmap's
 * staircase edges disappear.
 */
export function HeartCollage() {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const clipPath =
    size.width > 0 && size.height > 0
      ? generateHeartClipPath(size.width, size.height)
      : undefined;

  return (
    <div
      ref={ref}
      className="grid h-full w-full gap-[3px]"
      style={{
        gridTemplateColumns: `repeat(${HEART_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${HEART_ROWS}, 1fr)`,
        clipPath,
      }}
    >
      {HEART_MATRIX.map((rowArr, row) =>
        rowArr.map((active, col) =>
          active ? (
            <div key={`${row}_${col}`} style={{ gridRow: row + 1, gridColumn: col + 1 }}>
              <PhotoTile tileId={`tile_${row}_${col}`} />
            </div>
          ) : (
            <div key={`${row}_${col}`} style={{ gridRow: row + 1, gridColumn: col + 1 }} />
          )
        )
      )}
    </div>
  );
}
