"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { getLenis, setLenis } from "@/lib/smoothScroll";

/**
 * Inertial page scroll. It is the single largest contributor to how
 * "expensive" a site feels, and it costs nothing in layout: Lenis only
 * eases window.scrollY, so sticky headings and native anchors still work.
 *
 * Off under prefers-reduced-motion and on touch, where the platform's own
 * momentum is already right and re-implementing it only adds lag.
 */
export function SmoothScroll() {
  const reduce = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -96 },
      lerp: 0.1,
      wheelMultiplier: 1,
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [reduce]);

  /* A new route starts at the top, not mid-glide from the last one. */
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
