"use client";

import { useDesignStore } from "@/store/design-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FONT_OPTIONS, type FontId } from "@/types";

export function TextPanel() {
  const template = useDesignStore((s) => s.design.template);
  const text = useDesignStore((s) => s.design.text);
  const setTextLive = useDesignStore((s) => s.setTextLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);

  const isBlack = template === "black-anniversary";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-primary">{isBlack ? "Partner name 1" : "Title"}</Label>
        <Input
          id="text-primary"
          value={text.primary}
          onFocus={beginInteraction}
          onBlur={endInteraction}
          onChange={(e) => setTextLive({ primary: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-secondary">{isBlack ? "Partner name 2" : "Subtitle (optional)"}</Label>
        <Input
          id="text-secondary"
          value={text.secondary}
          onFocus={beginInteraction}
          onBlur={endInteraction}
          onChange={(e) => setTextLive({ secondary: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-font">Font</Label>
        <Select value={text.font} onValueChange={(v) => setTextLive({ font: v as FontId })}>
          <SelectTrigger id="text-font">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.id} value={font.id}>
                <span className={font.className}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-color">Text color</Label>
        <div className="flex items-center gap-2">
          <input
            id="text-color"
            type="color"
            value={text.color}
            onChange={(e) => setTextLive({ color: e.target.value })}
            onBlur={endInteraction}
            onFocus={beginInteraction}
            className="h-9 w-12 cursor-pointer rounded border border-neutral-300"
          />
          <Input
            value={text.color}
            onFocus={beginInteraction}
            onBlur={endInteraction}
            onChange={(e) => setTextLive({ color: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
