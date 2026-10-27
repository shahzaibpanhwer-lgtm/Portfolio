"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookingCalendar } from "@/components/sections/BookingCalendar";
import { ContactForm } from "@/components/sections/ContactForm";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "book", label: "Book a call" },
  { id: "message", label: "Send a message" },
] as const;

/**
 * The calendar on its own, or — on /contact — the calendar and the
 * message form behind a two-way switch, so neither pushes the other
 * below the fold.
 */
export function ContactPanel({ withForm }: { withForm: boolean }) {
  const reduce = usePrefersReducedMotion();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("book");

  if (!withForm) return <BookingCalendar />;

  return (
    <div>
      <div
        role="tablist"
        aria-label="How to get in touch"
        className="mb-4 inline-flex rounded-full border border-line bg-surface/60 p-1"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                active ? "text-bg" : "text-ink-dim hover:text-ink",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="contact-tab"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {tab === "book" ? <BookingCalendar /> : <ContactForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
