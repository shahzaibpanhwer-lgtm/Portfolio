"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A single soft warm light that trails the pointer. Deliberately near the
 * threshold of perception — it should register as depth, not as an effect.
 *
 * Off entirely for coarse pointers (touch), reduced-motion users, and
 * anyone whose device reports a small viewport.
 */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () =>
      setEnabled(fine.matches && wide.matches && !still.matches);

    evaluate();
    fine.addEventListener("change", evaluate);
    wide.addEventListener("change", evaluate);
    still.addEventListener("change", evaluate);

    return () => {
      fine.removeEventListener("change", evaluate);
      wide.removeEventListener("change", evaluate);
      still.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    /* Lerp toward the pointer so the light lags slightly — an exact
       follow reads as a cursor, a trailing one reads as lighting. */
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.075;
      current.current.y += (target.current.y - current.current.y) * 0.075;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      frame.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{ marginLeft: "-18rem", marginTop: "-18rem" }}
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,167,92,0.055) 0%, rgba(232,167,92,0.018) 35%, transparent 68%)",
        }}
      />
    </div>
  );
}
