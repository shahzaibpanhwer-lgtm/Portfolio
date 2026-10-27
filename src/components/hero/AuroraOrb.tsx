"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { HeroVisualFrame } from "@/components/hero/Frame";

/**
 * A soft, living sphere: a turning conic gradient inside a blob that
 * slowly changes shape, with a hairline ring orbiting it. Purely
 * atmospheric — it gives the hero a light source and nothing to read.
 */
export function AuroraOrb() {
  const reduce = usePrefersReducedMotion();
  const anim = (a: string) => (reduce ? undefined : a);

  return (
    <HeroVisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        {/* glow */}
        <div
          className="absolute h-[80%] w-[80%] rounded-full blur-3xl"
          style={{ background: "color-mix(in srgb, var(--color-accent) 22%, transparent)" }}
        />
        {/* blob */}
        <div
          className="relative h-[62%] w-[62%] overflow-hidden"
          style={{
            borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%",
            animation: anim("orb-morph 14s ease-in-out infinite"),
            boxShadow:
              "inset 0 0 60px rgba(0,0,0,0.55), 0 30px 120px -20px color-mix(in srgb, var(--color-accent) 60%, transparent)",
          }}
        >
          <div
            className="absolute -inset-1/2"
            style={{
              background:
                "conic-gradient(from 0deg, var(--color-accent), var(--color-accent-soft), var(--color-accent-deep), color-mix(in srgb, var(--color-accent-deep) 40%, var(--color-bg)), var(--color-accent))",
              animation: anim("orbit-spin 12s linear infinite"),
              filter: "blur(40px)",
            }}
          />
          <div className="absolute inset-0 grain" />
          {/* specular */}
          <div
            className="absolute left-[18%] top-[14%] h-[30%] w-[38%] rounded-full blur-2xl"
            style={{ background: "rgba(255,255,255,0.22)" }}
          />
        </div>
        {/* orbit ring */}
        <div
          className="absolute h-[86%] w-[86%] rounded-full border border-line"
          style={{ transform: "rotateX(70deg) rotateZ(-20deg)" }}
        >
          <div className="absolute inset-0" style={{ animation: anim("orbit-spin 9s linear infinite") }}>
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_16px_var(--color-accent)]" />
          </div>
        </div>
      </div>
    </HeroVisualFrame>
  );
}
