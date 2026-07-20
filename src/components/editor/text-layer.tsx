"use client";

import { useContext, useRef, useState } from "react";
import { useDesignStore } from "@/store/design-store";
import { MatRefContext } from "./frame-canvas";
import { FONT_OPTIONS } from "@/types";
import { clamp, cn } from "@/lib/utils";

/**
 * A free-floating text field the user can drag anywhere on the frame.
 * Position is tracked as a percentage of the mat's real on-screen box (via
 * `MatRefContext`), so dragging stays accurate no matter how much the
 * preview is currently scaled down for the viewport.
 */
export function TextLayer({ layerId }: { layerId: string }) {
  const layer = useDesignStore((s) => s.design.textLayers.find((l) => l.id === layerId));
  const isSelected = useDesignStore((s) => s.selectedTextLayerId === layerId);
  const setSelectedTextLayer = useDesignStore((s) => s.setSelectedTextLayer);
  const updateTextLayerLive = useDesignStore((s) => s.updateTextLayerLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const matRef = useContext(MatRefContext);
  const [isEditing, setIsEditing] = useState(false);
  const dragging = useRef(false);

  if (!layer) return null;
  const fontClass = FONT_OPTIONS.find((f) => f.id === layer.font)?.className ?? "font-sans";

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isEditing) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    setSelectedTextLayer(layerId);
    beginInteraction();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !layer || !matRef?.current) return;
    const rect = matRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    updateTextLayerLive(layerId, {
      xPercent: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
      yPercent: clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100),
    });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    endInteraction();
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={cn(
        "pointer-events-auto absolute cursor-move whitespace-nowrap px-1 py-0.5 select-none",
        isSelected && !isEditing && "outline outline-2 outline-dashed outline-amber-400",
        fontClass
      )}
      style={{
        left: `${layer.xPercent}%`,
        top: `${layer.yPercent}%`,
        fontSize: layer.fontSize,
        color: layer.color,
        fontWeight: layer.bold ? 700 : 400,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
      }}
    >
      {isEditing ? (
        <input
          autoFocus
          value={layer.content}
          onChange={(e) => updateTextLayerLive(layerId, { content: e.target.value })}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          size={Math.max(layer.content.length, 1)}
          className="min-w-[2ch] bg-transparent text-center outline-none"
          style={{ font: "inherit", color: "inherit" }}
        />
      ) : (
        layer.content || " "
      )}
    </div>
  );
}
