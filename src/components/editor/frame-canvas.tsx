"use client";

import type { FrameStyle } from "@/types";
import { useElementSize } from "@/hooks/use-element-size";
import { cn } from "@/lib/utils";

const TEXTURE_CLASS: Record<FrameStyle["texture"], string> = {
  none: "",
  linen: "texture-linen",
  paper: "texture-paper",
  grain: "texture-grain",
};

/** Reference design size (matches the exporter's BASE_WIDTH) that every
 * percentage-based layout and fixed-px font size below is authored against. */
const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 800;

/**
 * The physical picture-frame chrome: a bevelled border around the printable
 * mat, matching the wooden/black frames in the reference photos.
 *
 * Content is laid out at a fixed 1200x800 reference size, then the whole
 * thing is CSS-scaled to fit the actual rendered width. Without this, fixed
 * px font sizes (titles, calendar numbers) wouldn't shrink on small screens
 * and would overflow/clip — this keeps the preview proportionally identical
 * at any size, matching how the print exporter scales too.
 */
export function FrameCanvas({
  frame,
  children,
}: {
  frame: FrameStyle;
  children: React.ReactNode;
}) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const scale = size.width > 0 ? size.width / DESIGN_WIDTH : 0;

  return (
    <div
      className="mx-auto aspect-[3/2] w-full rounded-[2px] bg-neutral-800 p-[3%] shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #3a3a3a, #161616 60%, #3a3a3a)",
      }}
    >
      <div
        ref={ref}
        className={cn("relative h-full w-full overflow-hidden", TEXTURE_CLASS[frame.texture])}
        style={{ backgroundColor: frame.backgroundColor }}
      >
        {frame.showPrintMargins && (
          <div className="pointer-events-none absolute inset-[4%] z-10 border border-dashed border-red-400/60" />
        )}
        {scale > 0 && (
          <div
            className="absolute left-0 top-0 flex flex-col p-[5%]"
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
