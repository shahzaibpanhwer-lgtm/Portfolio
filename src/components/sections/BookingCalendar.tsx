"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { booking, contact, site } from "@/data/site";
import {
  buildSlots,
  dayKeyOf,
  formatLongDate,
  formatTime,
  googleCalendarUrl,
  icsFile,
  monthGrid,
  toDayKey,
  zonedParts,
  zoneOffsetLabel,
  zonedTimeToUtc,
} from "@/lib/booking";
import { useHydrated } from "@/lib/useHydrated";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { EMAIL_RE, Field } from "@/components/sections/ContactForm";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Pick a day, pick a time, say who you are. Three steps that slide into
 * each other inside one card, so the visitor never leaves the page.
 *
 * Everything here depends on the visitor's clock and zone, which the
 * server can't know, so the server renders a same-sized skeleton and the
 * calendar mounts after hydration.
 */
export function BookingCalendar() {
  const hydrated = useHydrated();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/60 shadow-[0_40px_120px_-40px_color-mix(in_srgb,_var(--color-accent)_25%,_transparent)] backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 100% 0%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 60%)",
        }}
      />
      <div className="relative">
        {hydrated ? <Booking /> : <Skeleton />}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="min-h-[560px] p-6 md:p-8" aria-busy="true">
      <p className="label">Book a call</p>
      <div className="mt-8 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-line-soft/60" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Step = "pick" | "details" | "done";

function Booking() {
  const reduce = usePrefersReducedMotion();
  const [now] = useState(() => Date.now());
  const localZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || booking.timeZone,
    [],
  );
  const sameZone =
    zoneOffsetLabel(now, localZone) === zoneOffsetLabel(now, booking.timeZone);
  const [useHostZone, setUseHostZone] = useState(false);
  const zone = useHostZone ? booking.timeZone : localZone;

  const slotsByDay = useMemo(() => buildSlots(now, zone), [now, zone]);
  const dayKeys = useMemo(() => [...slotsByDay.keys()].sort(), [slotsByDay]);

  const [duration, setDuration] = useState<number>(booking.durations[1].minutes);
  const [selectedDay, setSelectedDay] = useState<string | null>(dayKeys[0] ?? null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("pick");

  const first = dayKeys[0] ?? dayKeyOf(now, zone);
  const last = dayKeys[dayKeys.length - 1] ?? first;
  const [view, setView] = useState(() => ({
    year: Number(first.slice(0, 4)),
    month: Number(first.slice(5, 7)),
  }));
  const [direction, setDirection] = useState(1);

  /* Switching zones moves slots across midnight; follow the chosen time,
     or fall back to the first open day. */
  const switchZone = (host: boolean) => {
    const nextZone = host ? booking.timeZone : localZone;
    const nextSlots = buildSlots(now, nextZone);
    const day =
      selectedSlot !== null
        ? dayKeyOf(selectedSlot, nextZone)
        : selectedDay && nextSlots.has(selectedDay)
          ? selectedDay
          : ([...nextSlots.keys()].sort()[0] ?? null);
    setUseHostZone(host);
    setSelectedDay(day);
    if (day) setView({ year: Number(day.slice(0, 4)), month: Number(day.slice(5, 7)) });
  };

  const monthKey = (y: number, m: number) => y * 12 + m;
  const canPrev =
    monthKey(view.year, view.month) >
    monthKey(Number(first.slice(0, 4)), Number(first.slice(5, 7)));
  const canNext =
    monthKey(view.year, view.month) <
    monthKey(Number(last.slice(0, 4)), Number(last.slice(5, 7)));

  const shiftMonth = (delta: number) => {
    setDirection(delta);
    setView(({ year, month }) => {
      const m = month + delta;
      return m < 1
        ? { year: year - 1, month: 12 }
        : m > 12
          ? { year: year + 1, month: 1 }
          : { year, month: m };
    });
  };

  const slots = selectedDay ? (slotsByDay.get(selectedDay) ?? []) : [];

  /* Live clock on the host's side — "it's 4:12 PM for me" does more to
     set expectations about reply times than any line of copy. */
  const [clock, setClock] = useState(now);
  useEffect(() => {
    const id = window.setInterval(() => setClock(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const panel = {
    initial: reduce ? false : { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, x: -40 },
    transition: { duration: 0.45, ease: EASE },
  } as const;

  return (
    <div className="min-h-[560px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-soft px-6 py-5 md:px-8">
        <div>
          <p className="label">Book a call</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-dim">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            It&rsquo;s{" "}
            <span className="tabular-nums text-ink">
              {formatTime(clock, booking.timeZone)}
            </span>{" "}
            for me in {booking.zoneLabel}
          </p>
        </div>

        {step === "pick" ? (
          <div
            role="radiogroup"
            aria-label="Call length"
            className="relative flex rounded-full border border-line bg-bg p-1"
          >
            {booking.durations.map((d) => {
              const active = duration === d.minutes;
              return (
                <button
                  key={d.minutes}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDuration(d.minutes)}
                  className={cn(
                    "relative rounded-full px-3.5 py-2.5 text-xs transition-colors duration-300 sm:py-1.5",
                    active ? "text-bg" : "text-ink-dim hover:text-ink",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="duration-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">
                    {d.minutes} min
                    <span className="hidden sm:inline"> · {d.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === "pick" ? (
          <motion.div key="pick" {...panel}>
            <div className="grid md:grid-cols-[1fr_minmax(0,220px)]">
              {/* Month */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="relative h-7 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                      <motion.p
                        key={`${view.year}-${view.month}`}
                        custom={direction}
                        initial={reduce ? false : { y: direction * 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { y: direction * -24, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="font-display text-lg font-semibold tracking-tight"
                        aria-live="polite"
                      >
                        {MONTHS[view.month - 1]}{" "}
                        <span className="text-ink-faint">{view.year}</span>
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-1.5">
                    <MonthButton
                      label="Previous month"
                      disabled={!canPrev}
                      onClick={() => shiftMonth(-1)}
                      flip
                    />
                    <MonthButton
                      label="Next month"
                      disabled={!canNext}
                      onClick={() => shiftMonth(1)}
                    />
                  </div>
                </div>

                <MonthGrid
                  year={view.year}
                  month={view.month}
                  direction={direction}
                  todayKey={dayKeyOf(now, zone)}
                  slotsByDay={slotsByDay}
                  selectedDay={selectedDay}
                  onSelect={(key) => {
                    setSelectedDay(key);
                    setSelectedSlot(null);
                  }}
                  reduce={reduce}
                />
              </div>

              {/* Times */}
              <div className="flex flex-col border-t border-line-soft p-6 md:border-l md:border-t-0 md:p-6">
                <p className="text-sm font-medium text-ink">
                  {selectedDay
                    ? formatLongDate(
                        zonedTimeToUtc(
                          Number(selectedDay.slice(0, 4)),
                          Number(selectedDay.slice(5, 7)),
                          Number(selectedDay.slice(8, 10)),
                          12,
                          0,
                          zone,
                        ),
                        zone,
                      )
                    : "Pick a day"}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  {slots.length} {slots.length === 1 ? "time" : "times"} open
                </p>

                <div
                  data-lenis-prevent
                  className="mt-4 max-h-[300px] flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ul
                      key={`${selectedDay}-${zone}`}
                      className="grid grid-cols-2 gap-2 md:grid-cols-1"
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: reduce ? 0 : 0.025 } },
                      }}
                    >
                      {slots.map((slot) => {
                        const active = selectedSlot === slot.start;
                        return (
                          <motion.li
                            key={slot.start}
                            variants={{
                              hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 10 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
                            }}
                          >
                            <button
                              type="button"
                              aria-pressed={active}
                              onClick={() => setSelectedSlot(slot.start)}
                              className={cn(
                                "relative h-11 w-full rounded-xl border text-sm tabular-nums transition-colors duration-300",
                                active
                                  ? "border-accent text-bg"
                                  : "border-line text-ink-dim hover:border-accent/60 hover:text-ink",
                              )}
                            >
                              {active ? (
                                <motion.span
                                  layoutId="slot-pill"
                                  className="absolute inset-0 rounded-[11px] bg-accent"
                                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                />
                              ) : null}
                              <span className="relative">{formatTime(slot.start, zone)}</span>
                            </button>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {selectedSlot !== null ? (
                    <motion.button
                      type="button"
                      onClick={() => setStep("details")}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="group/btn mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent"
                    >
                      Continue
                      <Arrow />
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Zone */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-6 py-4 text-xs text-ink-faint md:px-8">
              <span>
                Times shown in{" "}
                <span className="text-ink-dim">
                  {useHostZone ? `${booking.zoneLabel} time` : "your time"} (
                  {zoneOffsetLabel(now, zone)})
                </span>
              </span>
              {!sameZone ? (
                <button
                  type="button"
                  onClick={() => switchZone(!useHostZone)}
                  className="tap text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  Show in {useHostZone ? "my time" : `${booking.zoneLabel} time`}
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {step !== "pick" && selectedSlot !== null ? (
          <motion.div key={step} {...panel}>
            {step === "details" ? (
              <Details
                start={selectedSlot}
                minutes={duration}
                zone={zone}
                localZone={localZone}
                onBack={() => setStep("pick")}
                onDone={() => setStep("done")}
              />
            ) : (
              <Done
                start={selectedSlot}
                minutes={duration}
                zone={zone}
                onReset={() => {
                  setSelectedSlot(null);
                  setStep("pick");
                }}
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MonthButton({
  label,
  disabled,
  onClick,
  flip,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-dim transition-colors duration-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn("h-3.5 w-3.5", flip && "rotate-180")}>
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function MonthGrid({
  year,
  month,
  direction,
  todayKey,
  slotsByDay,
  selectedDay,
  onSelect,
  reduce,
}: {
  year: number;
  month: number;
  direction: number;
  todayKey: string;
  slotsByDay: Map<string, unknown[]>;
  selectedDay: string | null;
  onSelect: (key: string) => void;
  reduce: boolean;
}) {
  const cells = monthGrid(year, month);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Arrow keys walk to the nearest open day in that direction. */
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, day: number) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    const total = cells.filter(Boolean).length;
    for (let d = day + step; d >= 1 && d <= total; d += step) {
      const btn = gridRef.current?.querySelector<HTMLButtonElement>(
        `[data-day="${d}"]:not([disabled])`,
      );
      if (btn) {
        btn.focus();
        return;
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-1.5 pb-2">
        {WEEK.map((d) => (
          <span key={d} className="text-center text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            <span aria-hidden="true">{d.slice(0, 2)}</span>
            <span className="sr-only">{d}</span>
          </span>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            ref={gridRef}
            initial={reduce ? false : { x: `${direction * 30}%`, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: `${direction * -30}%`, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="grid grid-cols-7 gap-1.5"
          >
            {cells.map((day, i) => {
              if (day === null) return <span key={`b${i}`} aria-hidden="true" />;
              const key = toDayKey(year, month, day);
              const count = slotsByDay.get(key)?.length ?? 0;
              const open = count > 0;
              const selected = key === selectedDay;
              const isToday = key === todayKey;
              return (
                <motion.button
                  key={key}
                  type="button"
                  data-day={day}
                  disabled={!open}
                  aria-pressed={selected}
                  aria-label={`${formatLongDate(Date.UTC(year, month - 1, day, 12), "UTC")}${open ? `, ${count} times open` : ", unavailable"}`}
                  onClick={() => onSelect(key)}
                  onKeyDown={(e) => onKeyDown(e, day)}
                  whileTap={reduce ? undefined : { scale: 0.92 }}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-xl text-sm tabular-nums transition-colors duration-300",
                    open
                      ? selected
                        ? "text-bg"
                        : "bg-accent/[0.07] font-medium text-ink hover:bg-accent/20"
                      : "cursor-default text-ink-faint/50",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="day-pill"
                      className="absolute inset-0 rounded-xl bg-accent shadow-[0_8px_30px_-6px_color-mix(in_srgb,_var(--color-accent)_70%,_transparent)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">{day}</span>
                  {isToday ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                        selected ? "bg-bg" : "bg-ink-faint",
                      )}
                    />
                  ) : null}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Errors = Partial<Record<"name" | "email", string>>;

function Details({
  start,
  minutes,
  zone,
  localZone,
  onBack,
  onDone,
}: {
  start: number;
  minutes: number;
  zone: string;
  localZone: string;
  onBack: () => void;
  onDone: () => void;
}) {
  const [values, setValues] = useState({ name: "", email: "", notes: "" });
  const [topic, setTopic] = useState<string>(booking.topics[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const set = (key: keyof typeof values) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) return;

    const found: Errors = {};
    if (!values.name.trim()) found.name = "Please add your name.";
    if (!values.email.trim()) found.email = "Please add an email address.";
    else if (!EMAIL_RE.test(values.email.trim()))
      found.email = "That email address doesn't look right.";
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("sending");
    const when = (z: string) =>
      `${formatLongDate(start, z)}, ${formatTime(start, z)} (${zoneOffsetLabel(start, z)})`;
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          topic,
          length: `${minutes} minutes`,
          requested_time_yours: when(booking.timeZone),
          requested_time_theirs: `${when(localZone)} — ${localZone}`,
          requested_time_utc: new Date(start).toISOString(),
          message: values.notes.trim() || "(no notes)",
          _subject: `Call request: ${topic} — ${formatLongDate(start, booking.timeZone)}, ${formatTime(start, booking.timeZone)}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
      if (!res.ok || String(data?.success) !== "true") throw new Error(String(res.status));
      onDone();
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="p-6 md:p-8">
      <SlotSummary start={start} minutes={minutes} zone={zone} onChange={onBack} />

      <fieldset className="mt-8">
        <legend className="mb-3 text-xs font-medium text-ink-dim">What&rsquo;s it about?</legend>
        <div className="flex flex-wrap gap-2">
          {booking.topics.map((t) => {
            const active = topic === t;
            return (
              <label
                key={t}
                className={cn(
                  "relative cursor-pointer rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                  active ? "border-accent bg-accent/15 text-ink" : "border-line text-ink-dim hover:text-ink",
                )}
              >
                <input
                  type="radio"
                  name="topic"
                  value={t}
                  checked={active}
                  onChange={() => setTopic(t)}
                  className="sr-only"
                />
                {t}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="book-name" label="Name" value={values.name} onChange={set("name")} error={errors.name} autoComplete="name" disabled={sending} />
        <Field id="book-email" label="Email" type="email" value={values.email} onChange={set("email")} error={errors.email} autoComplete="email" disabled={sending} />
      </div>
      <div className="mt-5">
        <Field id="book-notes" label="Anything I should know? (optional)" value={values.notes} onChange={set("notes")} multiline disabled={sending} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="book-company">Company</label>
        <input id="book-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ink-dim transition-colors hover:text-ink"
        >
          &larr; Back
        </button>
        <button
          type="submit"
          disabled={sending}
          className="group/btn inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-accent px-7 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending…" : "Request this time"}
          {!sending ? <Arrow /> : null}
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-ink-dim">
        {status === "error" ? (
          <>
            That didn&rsquo;t go through. You can email me at{" "}
            <a href={`mailto:${contact.email}`} className="text-accent underline underline-offset-4">
              {contact.email}
            </a>{" "}
            instead.
          </>
        ) : null}
      </p>
    </form>
  );
}

function SlotSummary({
  start,
  minutes,
  zone,
  onChange,
}: {
  start: number;
  minutes: number;
  zone: string;
  onChange?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/[0.06] p-4">
      <div className="flex items-center gap-4">
        <DateBadge start={start} zone={zone} />
        <div>
          <p className="text-sm font-medium text-ink">{formatLongDate(start, zone)}</p>
          <p className="mt-0.5 text-xs text-ink-dim tabular-nums">
            {formatTime(start, zone)} – {formatTime(start + minutes * 60_000, zone)} ·{" "}
            {minutes} min · {zoneOffsetLabel(start, zone)}
          </p>
        </div>
      </div>
      {onChange ? (
        <button
          type="button"
          onClick={onChange}
          className="shrink-0 text-xs text-accent underline-offset-4 hover:underline"
        >
          Change
        </button>
      ) : null}
    </div>
  );
}

/** Tear-off calendar leaf for the chosen day. */
function DateBadge({ start, zone }: { start: number; zone: string }) {
  const p = zonedParts(start, zone);
  return (
    <div className="w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-bg text-center" aria-hidden="true">
      <div className="bg-accent py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-bg">
        {MONTHS[p.month - 1].slice(0, 3)}
      </div>
      <div className="py-1 font-display text-lg font-semibold leading-tight">{p.day}</div>
    </div>
  );
}

function Done({
  start,
  minutes,
  zone,
  onReset,
}: {
  start: number;
  minutes: number;
  zone: string;
  onReset: () => void;
}) {
  const reduce = usePrefersReducedMotion();
  const event = {
    start,
    minutes,
    title: `Call with ${site.name}`,
    details: `Requested via ${site.url}. Shahzaib will confirm by email.`,
  };
  const [icsHref] = useState(
    () => `data:text/calendar;charset=utf-8,${encodeURIComponent(icsFile(event))}`,
  );

  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center p-8 text-center">
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
        <motion.circle
          cx="32" cy="32" r="30" fill="none" stroke="var(--color-accent)" strokeWidth="2"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        <motion.path
          d="M20 33l8 8 16-17" fill="none" stroke="var(--color-accent)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.55, ease: EASE }}
        />
      </svg>

      <p role="status" className="mt-6 font-display text-2xl font-semibold tracking-tight">Request sent</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-dim">
        I&rsquo;ll confirm by email within a day, with a meeting link. Until
        then, hold the time in your calendar:
      </p>

      <div className="mt-6 w-full max-w-sm text-left">
        <SlotSummary start={start} minutes={minutes} zone={zone} />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Google Calendar
        </a>
        <a
          href={icsHref}
          download="call-with-shahzaib.ics"
          className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Apple / Outlook (.ics)
        </a>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-xs text-ink-faint underline-offset-4 hover:text-ink hover:underline"
      >
        Book another time
      </button>
    </div>
  );
}
