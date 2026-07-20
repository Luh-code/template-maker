"use client";

import { HeartCollage } from "@/components/editor/heart-collage";
import { CalendarGrid } from "@/components/editor/calendar-grid";
import type { DesignState } from "@/types";
import { FONT_OPTIONS } from "@/types";

export function WhiteValentineLayout({ design }: { design: DesignState }) {
  const fontClass =
    FONT_OPTIONS.find((f) => f.id === design.text.font)?.className ?? "font-handwritten-1";

  return (
    <div className="flex h-full w-full flex-col gap-[3%]">
      <div className="shrink-0 text-center">
        <div className={`text-3xl ${fontClass}`} style={{ color: design.text.color }}>
          {design.text.primary}
        </div>
        {design.text.secondary && (
          <div className="mt-1 text-xs tracking-wide text-neutral-500">
            {design.text.secondary}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 gap-[6%]">
        <div className="h-full w-[52%] shrink-0">
          <HeartCollage />
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-end pb-[4%]">
          <CalendarGrid
            settings={design.calendar}
            accentColor={design.frame.accentColor}
            textColor="#2a2a2a"
            isDark={false}
          />
        </div>
      </div>
    </div>
  );
}
