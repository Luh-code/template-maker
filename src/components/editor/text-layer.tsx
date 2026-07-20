"use client";

import { useContext, useRef } from "react";
import { Pencil } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { MatRefContext, DESIGN_WIDTH } from "./frame-canvas";
import { FONT_OPTIONS } from "@/types";
import { clamp, cn } from "@/lib/utils";

const DEFAULT_WIDTH_PERCENT = 34;

/**
 * A free-floating text field the user can drag anywhere on the frame.
 * Position is tracked as a percentage of the mat's real on-screen box (via
 * `MatRefContext`), so dragging stays accurate no matter how much the
 * preview is currently scaled down for the viewport.
 *
 * Selecting it (tap/drag) never opens anything by itself — only the small
 * edit (pencil) button that appears once selected surfaces the "Text" panel.
 * Typing the words always happens there, never on the canvas: an editable
 * overlay directly on the frame fights mobile browsers' native
 * text-selection UI (the long-press callout, the Cut/Copy/Paste bubble on
 * focus) no matter how it's configured, since it's an input sitting on an
 * absolutely-positioned, CSS-transformed surface rather than in ordinary
 * document flow.
 */
export function TextLayer({ layerId }: { layerId: string }) {
  const layer = useDesignStore((s) => s.design.textLayers.find((l) => l.id === layerId));
  const isSelected = useDesignStore((s) => s.selectedTextLayerId === layerId);
  const setSelectedTextLayer = useDesignStore((s) => s.setSelectedTextLayer);
  const openTextEditor = useDesignStore((s) => s.openTextEditor);
  const updateTextLayerLive = useDesignStore((s) => s.updateTextLayerLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const matRef = useContext(MatRefContext);
  const dragging = useRef(false);

  if (!layer) return null;
  const fontClass = FONT_OPTIONS.find((f) => f.id === layer.font)?.className ?? "font-sans";
  const widthPx = ((layer.width ?? DEFAULT_WIDTH_PERCENT) / 100) * DESIGN_WIDTH;
  const align = layer.align ?? "center";

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
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
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "pointer-events-auto absolute cursor-move touch-none select-none whitespace-pre-wrap break-words px-1 py-0.5",
        isSelected && "outline outline-2 outline-dashed outline-amber-400",
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
        WebkitTouchCallout: "none",
      }}
    >
      {layer.content || "Tap to select, then edit it"}
      {isSelected && (
        <button
          type="button"
          aria-label="Edit text"
          title="Edit text"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            openTextEditor(layerId);
          }}
          className="pointer-events-auto absolute -right-3 -top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-amber-400 bg-white text-amber-600 shadow hover:bg-amber-50"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
