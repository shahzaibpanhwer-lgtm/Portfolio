"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Isometric stack of wireframe planes, turning slowly, filling the right
 * half of the hero.
 *
 * The form is not arbitrary: four stacked layers for a full-stack
 * developer — interface, logic, API, data, labelled in that order from
 * the top. It reads as a diagram of the work rather than as an ornament,
 * which is the difference between a visual that belongs to this site and
 * one that could sit on any site.
 *
 * Purely decorative to assistive tech, and it stops entirely under
 * prefers-reduced-motion.
 */
export function HeroStack() {
  const reduce = useReducedMotion();

  const layers = [
    { label: "Interface", accent: true, delay: "0s" },
    { label: "Logic", accent: false, delay: "-1.6s" },
    { label: "API", accent: false, delay: "-3.2s" },
    { label: "Data", accent: false, delay: "-4.8s" },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 -translate-y-1/2",
        // Below md it would sit under the text, so it stays hidden there.
        // From md up it scales and repositions rather than vanishing.
        "hidden md:block",
        "md:right-[-18%] md:h-[380px] md:w-[380px] md:opacity-70",
        "lg:right-[-4%] lg:h-[560px] lg:w-[560px] lg:opacity-100",
        "xl:right-[2%]",
      )}
      style={{ perspective: "1400px" }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(56deg) rotateZ(-38deg)",
          animation: reduce ? undefined : "stack-turn 26s ease-in-out infinite",
        }}
      >
        {layers.map((layer, i) => (
          <div
            key={layer.label}
            className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(-50%, -50%) translateZ(${(layers.length - 1 - i) * 62}px)`,
              animation: reduce
                ? undefined
                : `stack-float 9s ease-in-out ${layer.delay} infinite`,
            }}
          >
            <div
              className="relative h-full w-full rounded-2xl border"
              style={{
                borderColor: layer.accent
                  ? "rgba(77,124,254,0.66)"
                  : "rgba(48,48,54,0.95)",
                background: layer.accent
                  ? "linear-gradient(135deg, rgba(77,124,254,0.16), rgba(77,124,254,0.03))"
                  : "linear-gradient(135deg, rgba(245,245,245,0.038), rgba(245,245,245,0.006))",
                boxShadow: layer.accent
                  ? "0 0 70px rgba(77,124,254,0.22)"
                  : undefined,
              }}
            >
              {/* interface grid on the plane */}
              <div
                className="absolute inset-0 rounded-2xl opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
                  backgroundSize: "38px 38px",
                  maskImage:
                    "radial-gradient(75% 75% at 50% 50%, #000 40%, transparent 85%)",
                  WebkitMaskImage:
                    "radial-gradient(75% 75% at 50% 50%, #000 40%, transparent 85%)",
                }}
              />

              {/* a line sweeping the top plane, like a render pass */}
              {layer.accent && !reduce ? (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div
                    className="h-12 w-full"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(77,124,254,0.33), transparent)",
                      animation: "stack-scan 7s ease-in-out infinite",
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
