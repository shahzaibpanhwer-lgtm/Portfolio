import { booking } from "@/data/site";

/**
 * Pure scheduling helpers for the booking calendar. Everything is done
 * with Intl, so slots are correct in any visitor zone, across DST changes
 * on the visitor's side, without a date library.
 */

export type Slot = {
  /** Start instant, ms since epoch. */
  start: number;
  /** YYYY-MM-DD of the start in the zone the calendar is displayed in. */
  dayKey: string;
};

const partsCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  let f = partsCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
    partsCache.set(timeZone, f);
  }
  return f;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Wall-clock fields of an instant as seen in `timeZone`. */
export function zonedParts(ms: number, timeZone: string) {
  const out: Record<string, string> = {};
  for (const p of partsFormatter(timeZone).formatToParts(ms)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour),
    minute: Number(out.minute),
    weekday: WEEKDAYS.indexOf(out.weekday),
  };
}

export function dayKeyOf(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone);
  return toDayKey(p.year, p.month, p.day);
}

export function toDayKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** The instant at which `timeZone`'s wall clock reads the given time. */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
) {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const offsetAt = (ms: number) => {
    const p = zonedParts(ms, timeZone);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - ms;
  };
  // Two passes settle the offset even when the guess lands across a DST
  // boundary from the answer.
  let ms = asUtc - offsetAt(asUtc);
  ms = asUtc - offsetAt(ms);
  return ms;
}

/**
 * Every bookable start between now + notice and the end of the window,
 * grouped by day in `displayZone`.
 */
export function buildSlots(now: number, displayZone: string) {
  const host = booking.timeZone;
  const earliest = now + booking.noticeHours * 3_600_000;
  const byDay = new Map<string, Slot[]>();

  const today = zonedParts(now, host);
  for (let d = 0; d <= booking.windowDays; d++) {
    // Date.UTC normalises day overflow into the next month for us.
    const base = new Date(Date.UTC(today.year, today.month - 1, today.day + d));
    const y = base.getUTCFullYear();
    const m = base.getUTCMonth() + 1;
    const day = base.getUTCDate();
    if (!(booking.days as readonly number[]).includes(base.getUTCDay())) continue;

    for (
      let mins = booking.firstHour * 60;
      mins <= booking.lastHour * 60;
      mins += booking.stepMinutes
    ) {
      const start = zonedTimeToUtc(y, m, day, Math.floor(mins / 60), mins % 60, host);
      if (start < earliest) continue;
      const dayKey = dayKeyOf(start, displayZone);
      const list = byDay.get(dayKey) ?? [];
      list.push({ start, dayKey });
      byDay.set(dayKey, list);
    }
  }
  return byDay;
}

/** Calendar cells for a month: leading blanks (Mon-first), then days. */
export function monthGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: (number | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function formatTime(ms: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(ms);
}

export function formatLongDate(ms: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(ms);
}

/** "GMT+5", "GMT-4" … for showing which zone a time is in. */
export function zoneOffsetLabel(ms: number, timeZone: string) {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(ms)
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? timeZone;
}

/* ---------------- calendar hand-off ---------------- */

const icsStamp = (ms: number) =>
  new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(opts: {
  start: number;
  minutes: number;
  title: string;
  details: string;
}) {
  const end = opts.start + opts.minutes * 60_000;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${icsStamp(opts.start)}/${icsStamp(end)}`,
    details: opts.details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function icsFile(opts: {
  start: number;
  minutes: number;
  title: string;
  details: string;
}) {
  const end = opts.start + opts.minutes * 60_000;
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shahzaib Panhwer//Portfolio//EN",
    "BEGIN:VEVENT",
    `UID:${opts.start}-${Math.random().toString(36).slice(2)}@portfolio`,
    `DTSTAMP:${icsStamp(Date.now())}`,
    `DTSTART:${icsStamp(opts.start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${esc(opts.title)}`,
    `DESCRIPTION:${esc(opts.details)}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
