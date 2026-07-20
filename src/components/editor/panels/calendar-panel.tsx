"use client";

import { useDesignStore } from "@/store/design-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MONTH_NAMES } from "@/lib/calendar";
import { cn } from "@/lib/utils";

export function CalendarPanel() {
  const calendar = useDesignStore((s) => s.design.calendar);
  const setCalendar = useDesignStore((s) => s.setCalendar);
  const daysInMonth = new Date(calendar.year, calendar.month + 1, 0).getDate();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cal-month">Month</Label>
          <Select
            value={String(calendar.month)}
            onValueChange={(v) => setCalendar({ month: Number(v), specialDate: null })}
          >
            <SelectTrigger id="cal-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.en.map((name, i) => (
                <SelectItem key={name} value={String(i)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cal-year">Year</Label>
          <Input
            id="cal-year"
            type="number"
            value={calendar.year}
            onChange={(e) => setCalendar({ year: Number(e.target.value) || calendar.year })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Special date</Label>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => setCalendar({ specialDate: day })}
              className={cn(
                "rounded-md py-1 text-xs font-medium transition-colors",
                calendar.specialDate === day
                  ? "bg-amber-500 text-neutral-950"
                  : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Highlight style</Label>
        <div className="flex gap-2">
          {(["filled", "outline"] as const).map((style) => (
            <Button
              key={style}
              size="sm"
              variant={calendar.highlightStyle === style ? "primary" : "outline"}
              onClick={() => setCalendar({ highlightStyle: style })}
              className="flex-1 capitalize"
            >
              {style} heart
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cal-lang">Day labels</Label>
        <Select
          value={calendar.dayLabels}
          onValueChange={(v) => setCalendar({ dayLabels: v as typeof calendar.dayLabels })}
        >
          <SelectTrigger id="cal-lang">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English (S M T W T F S)</SelectItem>
            <SelectItem value="pt">Português (D S T Q Q S S)</SelectItem>
            <SelectItem value="es">Español (D L M M J V S)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={calendar.weekStartsMonday}
          onChange={(e) => setCalendar({ weekStartsMonday: e.target.checked })}
        />
        Week starts on Monday
      </label>
    </div>
  );
}
