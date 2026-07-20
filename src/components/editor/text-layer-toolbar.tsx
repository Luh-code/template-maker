"use client";

import { AlignCenter, AlignLeft, AlignRight, Bold, Pencil, Trash2, X } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FONT_OPTIONS, type FontId } from "@/types";

/** Contextual style controls for the currently-selected free-floating text field. */
export function TextLayerToolbar() {
  const selectedTextLayerId = useDesignStore((s) => s.selectedTextLayerId);
  const layer = useDesignStore((s) =>
    selectedTextLayerId ? s.design.textLayers.find((l) => l.id === selectedTextLayerId) : undefined
  );
  const setSelectedTextLayer = useDesignStore((s) => s.setSelectedTextLayer);
  const setEditingTextLayer = useDesignStore((s) => s.setEditingTextLayer);
  const updateTextLayerLive = useDesignStore((s) => s.updateTextLayerLive);
  const beginInteraction = useDesignStore((s) => s.beginInteraction);
  const endInteraction = useDesignStore((s) => s.endInteraction);
  const removeTextLayer = useDesignStore((s) => s.removeTextLayer);
  const mutate = useDesignStore((s) => s.mutate);

  if (!selectedTextLayerId || !layer) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Selected text
        </span>
        <button
          onClick={() => setSelectedTextLayer(null)}
          className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <Button size="sm" variant="outline" onClick={() => setEditingTextLayer(selectedTextLayerId)}>
        <Pencil /> Edit words
      </Button>
      <p className="text-xs text-neutral-400">
        Or double-click/double-tap it directly on the frame.
      </p>

      <div className="flex flex-col gap-1.5">
        <Label>Font</Label>
        <Select
          value={layer.font}
          onValueChange={(v) => updateTextLayerLive(selectedTextLayerId, { font: v as FontId })}
        >
          <SelectTrigger>
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
        <Label>Size</Label>
        <Slider
          min={12}
          max={72}
          step={1}
          value={[layer.fontSize]}
          onValueChange={([v]) => updateTextLayerLive(selectedTextLayerId, { fontSize: v })}
          onPointerDown={beginInteraction}
          onPointerUp={endInteraction}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Paragraph width</Label>
        <Slider
          min={10}
          max={90}
          step={1}
          value={[layer.width ?? 34]}
          onValueChange={([v]) => updateTextLayerLive(selectedTextLayerId, { width: v })}
          onPointerDown={beginInteraction}
          onPointerUp={endInteraction}
        />
        <p className="text-xs text-neutral-400">
          How wide before longer sentences wrap to the next line.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Alignment</Label>
        <div className="flex gap-2">
          {([
            { value: "left", icon: AlignLeft },
            { value: "center", icon: AlignCenter },
            { value: "right", icon: AlignRight },
          ] as const).map(({ value, icon: Icon }) => (
            <Button
              key={value}
              size="sm"
              variant={(layer.align ?? "center") === value ? "primary" : "outline"}
              className="flex-1"
              onClick={() =>
                mutate((d) => ({
                  ...d,
                  textLayers: d.textLayers.map((l) =>
                    l.id === selectedTextLayerId ? { ...l, align: value } : l
                  ),
                }))
              }
            >
              <Icon />
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Rotation</Label>
        <Slider
          min={-45}
          max={45}
          step={1}
          value={[layer.rotation]}
          onValueChange={([v]) => updateTextLayerLive(selectedTextLayerId, { rotation: v })}
          onPointerDown={beginInteraction}
          onPointerUp={endInteraction}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-layer-color">Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="text-layer-color"
            type="color"
            value={layer.color}
            onFocus={beginInteraction}
            onBlur={endInteraction}
            onChange={(e) => updateTextLayerLive(selectedTextLayerId, { color: e.target.value })}
            className="h-9 w-12 cursor-pointer rounded border border-neutral-300"
          />
          <Input
            value={layer.color}
            onFocus={beginInteraction}
            onBlur={endInteraction}
            onChange={(e) => updateTextLayerLive(selectedTextLayerId, { color: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant={layer.bold ? "primary" : "outline"}
          className="flex-1"
          onClick={() =>
            mutate((d) => ({
              ...d,
              textLayers: d.textLayers.map((l) =>
                l.id === selectedTextLayerId ? { ...l, bold: !l.bold } : l
              ),
            }))
          }
        >
          <Bold /> Bold
        </Button>
        <Button size="sm" variant="destructive" onClick={() => removeTextLayer(selectedTextLayerId)}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
