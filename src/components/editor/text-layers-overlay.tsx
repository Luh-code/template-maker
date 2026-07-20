"use client";

import { useDesignStore } from "@/store/design-store";
import { TextLayer } from "./text-layer";

/** Renders every free-floating text layer on top of the frame's own content. */
export function TextLayersOverlay() {
  const textLayers = useDesignStore((s) => s.design.textLayers);

  return (
    <div className="pointer-events-none absolute inset-0">
      {textLayers.map((layer) => (
        <TextLayer key={layer.id} layerId={layer.id} />
      ))}
    </div>
  );
}
