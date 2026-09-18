import { cn } from "@/lib/cn";

/**
 * SP monogram.
 *
 * Drawn as paths rather than set in a typeface, so the mark is
 * font-independent, stays crisp at favicon size, and can be exported as
 * an asset. Stroke geometry (single weight, round caps) matches the
 * hairline language the rest of the site is built from.
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
      className={cn("h-9 w-9", className)}
    >
      {/* Tile — same radius and hairline as the site's cards */}
      <rect
        x="0.7"
        y="0.7"
        width="30.6"
        height="30.6"
        rx="9"
        className="fill-surface stroke-line transition-colors duration-300"
        strokeWidth="1.4"
      />

      {/* Letterforms are scaled about the tile centre so the optical
          padding stays even, and the P is nudged right to open up the
          join between the two glyphs. */}
      <g transform="translate(16 16) scale(0.8) translate(-16 -16)">
        {/* S */}
        <path
          d="M14.6 11.6c0-1.7-1.6-2.6-3.5-2.6-2.1 0-4.1.9-4.1 3 0 3.9 7.6 2.8 7.6 7.3 0 2.4-2.1 3.5-4.2 3.5-2.1 0-4-.8-4.5-2.6"
          className="stroke-ink transition-colors duration-300"
          strokeWidth="2.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* P */}
        <path
          d="M19.5 23V9h4.3c2.5 0 4.1 1.8 4.1 4.2s-1.6 4.2-4.1 4.2h-4.3"
          className="stroke-accent transition-colors duration-300"
          strokeWidth="2.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Full lockup: mark + wordmark. The wordmark drops away below `sm`,
 * leaving the mark to carry the identity.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark
        className={cn(
          "h-9 w-9 shrink-0",
          "[&>rect]:group-hover/logo:stroke-accent/50",
        )}
      />
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-300 group-hover/logo:text-accent sm:inline">
        Shahzaib Panhwer
      </span>
    </span>
  );
}
