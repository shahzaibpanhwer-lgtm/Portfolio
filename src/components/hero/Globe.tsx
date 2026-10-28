"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { HeroVisualFrame } from "@/components/hero/Frame";

/* Home, and a few places work has gone to. */
const HOME = { lat: 30.4, lon: 69.3 };
const PLACES = [
  { lat: 51.5, lon: -0.1 },
  { lat: 40.7, lon: -74 },
  { lat: 25.2, lon: 55.3 },
  { lat: -33.9, lon: 151.2 },
  { lat: 1.35, lon: 103.8 },
  { lat: 52.5, lon: 13.4 },
];

const rad = (d: number) => (d * Math.PI) / 180;
const toVec = (lat: number, lon: number) => {
  const la = rad(lat);
  const lo = rad(lon);
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

/**
 * A dotted globe turning slowly, with arcs flying out from Pakistan —
 * "based here, working anywhere" without a line of copy.
 * Canvas, so a thousand points cost one draw call per frame.
 */
export function Globe() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() ||
      "#c6f25a";

    const N = 1400;
    const pts: number[][] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }

    let raf = 0;
    let rot = rad(-HOME.lon);
    const tilt = rad(-18);
    const start = performance.now();

    const draw = (now: number) => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.4;
      const cx = w / 2;
      const cy = h / 2;

      const project = (v: number[]) => {
        const x1 = v[0] * Math.cos(rot) + v[2] * Math.sin(rot);
        const z1 = -v[0] * Math.sin(rot) + v[2] * Math.cos(rot);
        const y2 = v[1] * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = v[1] * Math.sin(tilt) + z1 * Math.cos(tilt);
        return [cx + x1 * R, cy - y2 * R, z2];
      };

      // halo
      const g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.25);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.75, `color-mix(in srgb, ${accent} 12%, transparent)`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of pts) {
        const [x, y, z] = project(p);
        if (z < -0.15) continue;
        const a = 0.18 + Math.max(0, z) * 0.7;
        ctx.fillStyle = `rgba(245,245,245,${a})`;
        ctx.fillRect(x, y, 1.7, 1.7);
      }

      // arcs
      const t = (now - start) / 1000;
      const home = toVec(HOME.lat, HOME.lon);
      PLACES.forEach((pl, i) => {
        const dest = toVec(pl.lat, pl.lon);
        const phase = ((t * 0.35 + i / PLACES.length) % 1);
        ctx.beginPath();
        let started = false;
        const steps = 48;
        for (let s = 0; s <= steps; s++) {
          const f = s / steps;
          const lift = 1 + Math.sin(f * Math.PI) * 0.28;
          const v = home.map((h0, k) => h0 * (1 - f) + dest[k] * f);
          const len = Math.hypot(v[0], v[1], v[2]);
          const [x, y, z] = project(v.map((c) => (c / len) * lift));
          if (z < -0.05) { started = false; continue; }
          if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `color-mix(in srgb, ${accent} 55%, transparent)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // travelling spark
        const f = phase;
        const lift = 1 + Math.sin(f * Math.PI) * 0.28;
        const v = home.map((h0, k) => h0 * (1 - f) + dest[k] * f);
        const len = Math.hypot(v[0], v[1], v[2]);
        const [x, y, z] = project(v.map((c) => (c / len) * lift));
        if (z > -0.05) {
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        const [dx, dy, dz] = project(dest);
        if (dz > 0) {
          ctx.fillStyle = `rgba(245,245,245,0.8)`;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // home pin, pulsing
      const [hx, hy, hz] = project(home);
      if (hz > 0) {
        const pulse = (t % 2) / 2;
        ctx.strokeStyle = `color-mix(in srgb, ${accent} ${Math.round((1 - pulse) * 80)}%, transparent)`;
        ctx.beginPath();
        ctx.arc(hx, hy, 4 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) {
        // Sway around home rather than spinning it out of view.
        rot = rad(-HOME.lon) + Math.sin(t * 0.18) * 0.75;
        raf = requestAnimationFrame(draw);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <HeroVisualFrame>
      <canvas ref={ref} className="h-full w-full" />
    </HeroVisualFrame>
  );
}
