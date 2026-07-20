"use client";

import { Heart } from "lucide-react";
import { HeartCollage } from "@/components/editor/heart-collage";
import { CalendarGrid } from "@/components/editor/calendar-grid";
import { SpotifyCode } from "@/components/editor/spotify-code";
import type { DesignState } from "@/types";
import { FONT_OPTIONS } from "@/types";

export function BlackAnniversaryLayout({ design }: { design: DesignState }) {
  const fontClass =
    FONT_OPTIONS.find((f) => f.id === design.text.font)?.className ?? "font-handwritten-1";

  return (
    <div className="flex h-full w-full flex-col gap-[4%]">
      <div
        className={`flex shrink-0 items-center justify-center gap-3 text-center text-3xl ${fontClass}`}
        style={{ color: design.text.color }}
      >
        <span>{design.text.primary}</span>
        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        <span>{design.text.secondary}</span>
      </div>

      <div className="flex min-h-0 flex-1 gap-[6%]">
        <div className="h-full w-[48%] shrink-0">
          <HeartCollage />
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-[8%]">
          <SpotifyCode
            spotify={design.spotify}
            accentColor={design.frame.accentColor}
            textColor={design.text.color}
          />
          <CalendarGrid
            settings={design.calendar}
            accentColor={design.frame.accentColor}
            textColor={design.text.color}
            isDark
          />
        </div>
      </div>
    </div>
  );
}
