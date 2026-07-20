"use client";

import { useDesignStore } from "@/store/design-store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { FrameStyle } from "@/types";

const TEXTURES: { id: FrameStyle["texture"]; label: string }[] = [
  { id: "none", label: "None" },
  { id: "linen", label: "Linen" },
  { id: "paper", label: "Paper" },
  { id: "grain", label: "Grain" },
];

export function StylePanel() {
  const frame = useDesignStore((s) => s.design.frame);
  const setFrameLive = useDesignStore((s) => s.setFrameLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bg-color">Frame background</Label>
        <div className="flex items-center gap-2">
          <input
            id="bg-color"
            type="color"
            value={frame.backgroundColor}
            onFocus={beginInteraction}
            onBlur={endInteraction}
            onChange={(e) => setFrameLive({ backgroundColor: e.target.value })}
            className="h-9 w-12 cursor-pointer rounded border border-neutral-300"
          />
          <span className="text-sm text-neutral-500">{frame.backgroundColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="accent-color">Accent color</Label>
        <div className="flex items-center gap-2">
          <input
            id="accent-color"
            type="color"
            value={frame.accentColor}
            onFocus={beginInteraction}
            onBlur={endInteraction}
            onChange={(e) => setFrameLive({ accentColor: e.target.value })}
            className="h-9 w-12 cursor-pointer rounded border border-neutral-300"
          />
          <span className="text-sm text-neutral-500">{frame.accentColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Background texture</Label>
        <div className="grid grid-cols-2 gap-2">
          {TEXTURES.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={frame.texture === t.id ? "primary" : "outline"}
              onClick={() => setFrameLive({ texture: t.id })}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Print margin guides</Label>
          <p className="text-xs text-neutral-400">Editor-only, hidden from exports</p>
        </div>
        <Switch
          checked={frame.showPrintMargins}
          onCheckedChange={(v) => setFrameLive({ showPrintMargins: v })}
        />
      </div>
    </div>
  );
}
