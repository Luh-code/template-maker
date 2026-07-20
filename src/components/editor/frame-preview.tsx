"use client";

import { useDesignStore } from "@/store/design-store";
import { FrameCanvas } from "./frame-canvas";
import { BlackAnniversaryLayout } from "./templates/black-anniversary-layout";
import { WhiteValentineLayout } from "./templates/white-valentine-layout";

export function FramePreview() {
  const design = useDesignStore((s) => s.design);

  return (
    <FrameCanvas frame={design.frame}>
      {design.template === "black-anniversary" ? (
        <BlackAnniversaryLayout design={design} />
      ) : (
        <WhiteValentineLayout design={design} />
      )}
    </FrameCanvas>
  );
}
