"use client";

import { Plus, Trash2 } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FONT_OPTIONS, type FontId } from "@/types";

export function TextPanel() {
  const template = useDesignStore((s) => s.design.template);
  const text = useDesignStore((s) => s.design.text);
  const setTextLive = useDesignStore((s) => s.setTextLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const textLayers = useDesignStore((s) => s.design.textLayers);
  const addTextLayer = useDesignStore((s) => s.addTextLayer);
  const removeTextLayer = useDesignStore((s) => s.removeTextLayer);
  const selectedTextLayerId = useDesignStore((s) => s.selectedTextLayerId);
  const setSelectedTextLayer = useDesignStore((s) => s.setSelectedTextLayer);

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

      <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <Label>Custom text fields</Label>
        <p className="text-xs text-neutral-400">
          Add a text field anywhere on the frame — drag it into place, double-click to edit its words.
        </p>
        <Button size="sm" variant="outline" onClick={addTextLayer}>
          <Plus /> Add text field
        </Button>

        {textLayers.length > 0 && (
          <div className="mt-1 flex flex-col gap-1">
            {textLayers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => setSelectedTextLayer(layer.id)}
                className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer ${
                  selectedTextLayerId === layer.id
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="truncate">{layer.content || "(empty)"}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTextLayer(layer.id);
                  }}
                  className="shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-red-600 dark:hover:bg-neutral-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
