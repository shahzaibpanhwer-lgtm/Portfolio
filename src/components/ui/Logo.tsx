import { cn } from "@/lib/cn";

/**
 * Layer mark.
 *
 * Three stacked strokes for the layers of a full-stack product: an
 * accent plane on top (interface) over two receding layers. Drawn as
 * paths so it stays crisp at favicon size and needs no font.
 *
 * Inside a `group/logo` the top plane lifts on hover. Motion-safe only.
 */
export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("h-8 w-8 overflow-visible", className)}
    >
      {/* Bottom layer */}
      <path
        d="M4 19.5 16 26l12-6.5"
        className="stroke-ink-faint"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle layer */}
      <path
        d="M4 14.5 16 21l12-6.5"
        className="stroke-ink-dim"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top plane */}
      <path
        d="M16 3.5 28 10 16 16.5 4 10Z"
        className="fill-accent/20 stroke-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/logo:-translate-y-[2px]"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full lockup: mark + name, with the accent full stop from the hero. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">
        Shahzaib Panhwer
        <span className="text-accent">.</span>
      </span>
    </span>
  );
}
