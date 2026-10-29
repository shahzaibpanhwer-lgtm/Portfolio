import Image from "next/image";
import Link from "next/link";
import { projects, wordpressProjects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/* Resting fan, and how far each card swings out when the card is hovered. */
const FAN = [
  "-translate-x-[30%] rotate-[-9deg] group-hover/more:-translate-x-[46%] group-hover/more:rotate-[-13deg]",
  "-translate-x-[10%] rotate-[-3deg] group-hover/more:-translate-x-[16%] group-hover/more:-translate-y-3 group-hover/more:rotate-[-4deg]",
  "translate-x-[10%] rotate-[3deg] group-hover/more:translate-x-[16%] group-hover/more:-translate-y-3 group-hover/more:rotate-[4deg]",
  "translate-x-[30%] rotate-[9deg] group-hover/more:translate-x-[46%] group-hover/more:rotate-[13deg]",
];

/**
 * Closes the home page's work section: the projects that did not make
 * the top rows, as a fan of screenshots that opens on hover, and one
 * clear way through to /work. Counts and names come from the data, so
 * adding a project updates the copy.
 */
export function ExploreMore({ shown }: { shown: number }) {
  const moreProducts = projects.slice(shown);
  const seen = new Set<string>();
  const more = [
    ...moreProducts.map((p) => ({ title: p.title, cover: p.cover })),
    ...wordpressProjects.map((p) => ({ title: p.title, cover: p.cover })),
  ].filter((p) => {
    if (!p.cover || seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });

  if (more.length === 0) return null;

  const names = more.slice(0, 3).map((p) => p.title);
  const parts = [
    moreProducts.length > 0 &&
      `${moreProducts.length} more case ${moreProducts.length === 1 ? "study" : "studies"}`,
    wordpressProjects.length > 0 &&
      `${wordpressProjects.length} WordPress ${wordpressProjects.length === 1 ? "website" : "websites"}`,
  ].filter(Boolean);

  return (
    <Reveal className="mt-24 md:mt-36">
      <Link
        href="/work"
        aria-label="Explore all projects"
        className="group/more relative grid items-center gap-10 overflow-hidden rounded-3xl border border-line bg-surface/50 p-8 transition-colors duration-500 hover:border-ink-faint/40 md:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-60 transition-opacity duration-700 group-hover/more:opacity-100"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent)",
          }}
        />

        <div className="relative">
          <p className="label">More work</p>
          <h3 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            <span className="silver">Explore more projects</span>
          </h3>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-dim">
            {parts.join(" and ")} — {names.join(", ")} and more.
          </p>
          <span className="mt-8 inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-7 text-sm font-medium text-bg transition-[background-color,transform,box-shadow] duration-300 group-hover/more:-translate-y-0.5 group-hover/more:bg-accent-soft group-hover/more:shadow-[0_8px_24px_-8px_color-mix(in_srgb,_var(--color-accent)_65%,_transparent)]">
            View all projects
            <Arrow className="group-hover/more:translate-x-1" />
          </span>
        </div>

        {/* the fan */}
        <div aria-hidden="true" className="relative h-[200px] sm:h-[260px]">
          {more.slice(0, 4).map((p, i) => (
            <div
              key={p.title}
              className={cn(
                "absolute left-1/2 top-1/2 w-[58%] -ml-[29%] -mt-[18%] overflow-hidden rounded-xl border border-white/10 bg-surface p-1 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]",
                "transition-[translate,rotate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                FAN[i],
              )}
              style={{ zIndex: i === 1 || i === 2 ? 2 : 1 }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[9px]">
                <Image
                  src={p.cover!}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 340px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>
      </Link>
    </Reveal>
  );
}
