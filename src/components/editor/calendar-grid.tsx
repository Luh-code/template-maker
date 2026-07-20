"use client";

import { Heart } from "lucide-react";
import { generateMonthGrid, getOrderedDayLabels, MONTH_NAMES } from "@/lib/calendar";
import type { CalendarSettings } from "@/types";
import { cn } from "@/lib/utils";

export function CalendarGrid({
  settings,
  accentColor,
  textColor,
  isDark,
}: {
  settings: CalendarSettings;
  accentColor: string;
  textColor: string;
  isDark: boolean;
}) {
  const weeks = generateMonthGrid(settings.month, settings.year, settings.weekStartsMonday);
  const dayLabels = getOrderedDayLabels(settings.dayLabels, settings.weekStartsMonday);
  const monthLabel = MONTH_NAMES[settings.dayLabels][settings.month];

  return (
    <div className="w-full select-none" style={{ color: textColor }}>
      <div className="mb-2 font-handwritten-1 text-lg leading-none" style={{ color: accentColor }}>
        {monthLabel} {settings.year}
      </div>
      <div
        className="grid grid-cols-7 gap-x-2 gap-y-1 border-t pt-1.5 text-[11px] font-medium tracking-wide"
        style={{ borderColor: isDark ? "rgba(232,200,116,0.35)" : "rgba(0,0,0,0.15)" }}
      >
        {dayLabels.map((label, i) => (
          <div key={i} className="text-center opacity-70">
            {label}
          </div>
        ))}
        {weeks.flat().map((day, i) => {
          const isSpecial = day !== null && day === settings.specialDate;
          return (
            <div key={i} className="relative flex items-center justify-center py-0.5 text-center">
              {isSpecial ? (
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <Heart
                    className={cn(
                      "absolute inset-0 h-full w-full",
                      settings.highlightStyle === "filled" ? "fill-red-500 text-red-500" : "fill-none text-red-500"
                    )}
                    strokeWidth={settings.highlightStyle === "outline" ? 2 : 1}
                  />
                  <span
                    className={cn(
                      "relative text-[10px] font-semibold",
                      settings.highlightStyle === "filled" ? "text-white" : ""
                    )}
                  >
                    {day}
                  </span>
                </span>
              ) : (
                <span>{day ?? ""}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
