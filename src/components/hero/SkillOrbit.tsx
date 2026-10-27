"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { LogoMark } from "@/components/ui/Logo";
import { HeroVisualFrame } from "@/components/hero/Frame";

const RINGS = [
  { size: 46, duration: 28, items: ["Figma", "React", "WordPress"] },
  { size: 72, duration: 44, items: ["Next.js", "TypeScript", "Elementor", "Node.js"] },
  { size: 98, duration: 64, items: ["Tailwind", "UX Research", "APIs", "Git", "Prototyping"] },
];

/**
 * The toolset in orbit around the mark: inner ring for the daily tools,
 * outer for the rest. Rings turn at different speeds and the labels
 * counter-rotate, so they always read upright.
 */
export function SkillOrbit() {
  const reduce = usePrefersReducedMotion();

  return (
    <HeroVisualFrame placement="bleed">
      <div className="relative h-full w-full">
        {/* core */}
        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/40 bg-surface shadow-[0_0_80px_color-mix(in_srgb,_var(--color-accent)_45%,_transparent)]">
          <LogoMark className="h-10 w-10" />
        </div>

        {RINGS.map((ring, r) => (
          <div
            key={r}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
            style={{
              width: `${ring.size}%`,
              height: `${ring.size}%`,
              animation: reduce ? undefined : `orbit-spin ${ring.duration}s linear infinite ${r % 2 ? "reverse" : ""}`,
            }}
          >
            {ring.items.map((item, i) => {
              const angle = (360 / ring.items.length) * i + r * 25;
              return (
                <div
                  key={item}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className="absolute left-1/2 top-0"
                    style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}
                  >
                    <span
                      className="block whitespace-nowrap rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs text-ink-dim backdrop-blur"
                      style={{
                        animation: reduce ? undefined : `orbit-spin ${ring.duration}s linear infinite ${r % 2 ? "" : "reverse"}`,
                      }}
                    >
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                      {item}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </HeroVisualFrame>
  );
}
