import type { DayLabelStyle } from "@/types";

export const DAY_LABELS: Record<DayLabelStyle, string[]> = {
  en: ["S", "M", "T", "W", "T", "F", "S"],
  pt: ["D", "S", "T", "Q", "Q", "S", "S"],
  es: ["D", "L", "M", "M", "J", "V", "S"],
};

export const MONTH_NAMES: Record<DayLabelStyle, string[]> = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  pt: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ],
  es: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ],
};

/** One calendar cell: a day number, or null for a leading/trailing blank. */
export type CalendarCell = number | null;

/**
 * Builds a full-week grid (array of 7-cell weeks) for the given month/year.
 * `weekStartsMonday` shifts the first column from Sunday to Monday.
 */
export function generateMonthGrid(
  month: number,
  year: number,
  weekStartsMonday: boolean
): CalendarCell[][] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const leadingBlanks = weekStartsMonday
    ? (firstDayIndex + 6) % 7
    : firstDayIndex;

  const cells: CalendarCell[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function getOrderedDayLabels(
  style: DayLabelStyle,
  weekStartsMonday: boolean
): string[] {
  const labels = DAY_LABELS[style];
  return weekStartsMonday ? [...labels.slice(1), labels[0]] : labels;
}
