"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks, site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const reduce = useReducedMotion();

  /* Solidify the bar once the hero starts leaving. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scrollspy for the section links on the home page. */
  useEffect(() => {
    const ids = navLinks
      .map((l) => l.href.split("#")[1])
      .filter(Boolean) as string[];

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    /* Track what is currently in the band rather than latching onto the
       last match — otherwise scrolling back to the hero leaves Contact
       highlighted. */
    const inBand = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inBand.set(entry.target.id, entry.intersectionRatio);
          } else {
            inBand.delete(entry.target.id);
          }
        }

        if (inBand.size === 0) {
          setActive("");
          return;
        }

        let best = "";
        let bestRatio = -1;
        for (const [id, ratio] of inBand) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        setActive(best);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Lock body scroll while the mobile sheet is open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape closes the sheet. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-line bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="container-edge flex h-16 items-center justify-between md:h-20"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group/logo shrink-0 rounded-xl"
            aria-label={`${site.name} — home`}
          >
            <Logo />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const id = link.href.split("#")[1];
              const isActive = active === id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      isActive
                        ? "text-ink"
                        : "text-ink-dim hover:text-ink",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ease-out",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {site.resumeUrl ? (
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 items-center rounded-full border border-line px-5 text-sm text-ink transition-colors duration-300 hover:border-accent hover:text-accent md:inline-flex"
              >
                Resume
              </a>
            ) : null}

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink-faint md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300 ease-out",
                    open ? "top-1.5 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300 ease-out",
                    open ? "top-1.5 -rotate-45" : "top-2.5",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-bg md:hidden"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-edge flex h-full flex-col justify-between pb-10 pt-28">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: reduce ? 0 : 0.06 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-line-soft"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-5 font-display text-3xl font-medium tracking-tight text-ink"
                    >
                      <span className="label text-[10px]">
                        0{i + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="space-y-6">
                {site.resumeUrl ? (
                  <a
                    href={site.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-full border border-line px-6 text-sm text-ink"
                  >
                    Resume
                  </a>
                ) : null}
                <p className="label">{site.role}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
