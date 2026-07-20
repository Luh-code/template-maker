"use client";

import { useContext, useEffect, useRef } from "react";
import { useDesignStore } from "@/store/design-store";
import { MatRefContext, DESIGN_WIDTH } from "./frame-canvas";
import { FONT_OPTIONS } from "@/types";
import { clamp, cn } from "@/lib/utils";

const DEFAULT_WIDTH_PERCENT = 34;

/**
 * A free-floating text field the user can drag anywhere on the frame.
 * Position is tracked as a percentage of the mat's real on-screen box (via
 * `MatRefContext`), so dragging stays accurate no matter how much the
 * preview is currently scaled down for the viewport. Content wraps as a
 * paragraph within `width` rather than running on in a single line.
 *
 * Edit mode lives in the store (`editingTextLayerId`), not local state, so
 * it can also be triggered from the "Edit words" button in the sidebar —
 * double-tap-to-edit alone isn't reliable across all mobile browsers.
 */
export function TextLayer({ layerId }: { layerId: string }) {
  const layer = useDesignStore((s) => s.design.textLayers.find((l) => l.id === layerId));
  const isSelected = useDesignStore((s) => s.selectedTextLayerId === layerId);
  const isEditing = useDesignStore((s) => s.editingTextLayerId === layerId);
  const setSelectedTextLayer = useDesignStore((s) => s.setSelectedTextLayer);
  const setEditingTextLayer = useDesignStore((s) => s.setEditingTextLayer);
  const updateTextLayerLive = useDesignStore((s) => s.updateTextLayerLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const matRef = useContext(MatRefContext);
  const dragging = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [isEditing, layer?.content]);

  if (!layer) return null;
  const fontClass = FONT_OPTIONS.find((f) => f.id === layer.font)?.className ?? "font-sans";
  const widthPx = ((layer.width ?? DEFAULT_WIDTH_PERCENT) / 100) * DESIGN_WIDTH;
  const align = layer.align ?? "center";

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isEditing) return;
    // Without this, a touch-and-hold on mobile is indistinguishable from a
    // long-press, which opens the browser's native text callout (Copy /
    // Look Up / Share…) instead of letting us handle the drag ourselves.
    e.preventDefault();
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
        setEditingTextLayer(layerId);
      }}
      onContextMenu={(e) => {
        if (!isEditing) e.preventDefault();
      }}
      className={cn(
        "pointer-events-auto absolute whitespace-pre-wrap break-words px-1 py-0.5",
        !isEditing && "cursor-move touch-none select-none",
        isSelected && !isEditing && "outline outline-2 outline-dashed outline-amber-400",
        fontClass
      )}
      style={{
        left: `${layer.xPercent}%`,
        top: `${layer.yPercent}%`,
        width: widthPx,
        textAlign: align,
        fontSize: layer.fontSize,
        color: layer.color,
        fontWeight: layer.bold ? 700 : 400,
        lineHeight: 1.3,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
        WebkitTouchCallout: isEditing ? "default" : "none",
      }}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          autoFocus
          value={layer.content}
          onChange={(e) => updateTextLayerLive(layerId, { content: e.target.value })}
          onBlur={() => setEditingTextLayer(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") e.currentTarget.blur();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          rows={1}
          className="block w-full resize-none overflow-hidden bg-transparent outline-none"
          style={{ font: "inherit", color: "inherit", textAlign: "inherit", lineHeight: "inherit" }}
        />
      ) : (
        layer.content || " "
      )}
    </div>
  );
}
