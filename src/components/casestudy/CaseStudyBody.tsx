import type { CaseStudyBlock, Shot } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { cn } from "@/lib/cn";

const pad = (n: number) => String(n).padStart(2, "0");

export function CaseStudyBody({
  blocks,
  liveUrl,
}: {
  blocks: CaseStudyBlock[];
  liveUrl: string;
}) {
  return (
    <div className="container-edge">
      {blocks.map((block, i) => (
        <Block
          key={`${block.kind}-${block.heading}`}
          block={block}
          number={pad(i + 1)}
          liveUrl={liveUrl}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Block({
  block,
  number,
  liveUrl,
}: {
  block: CaseStudyBlock;
  number: string;
  liveUrl: string;
}) {
  /* Prose sits in a narrow measure beside a sticky heading; visuals
     stack under a full-width heading so screenshots get real estate. */
  const isVisual = block.kind === "gallery" || block.kind === "compare";

  if (isVisual) {
    return (
      <section className="border-t border-line py-16 md:py-24">
        <Reveal>
          <SectionLabel number={number} heading={block.heading} />
          {"body" in block && block.body ? (
            <div className="mt-6 max-w-xl space-y-4">
              {block.body.map((p) => (
                <p key={p} className="text-base leading-relaxed text-ink-dim">
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </Reveal>

        <div className="mt-12 md:mt-16">
          {block.kind === "gallery" ? (
            <Gallery shots={block.shots} url={liveUrl} />
          ) : (
            <Compare before={block.before} after={block.after} url={liveUrl} />
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel number={number} heading={block.heading} />
          </div>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-7 lg:col-start-6">
          {block.kind === "text" ? (
            <div className="space-y-5">
              {block.body.map((p) => (
                <p
                  key={p}
                  className="text-base leading-relaxed text-ink-dim md:text-lg md:leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <>
              {block.body ? (
                <div className="mb-8 space-y-4">
                  {block.body.map((p) => (
                    <p
                      key={p}
                      className="text-base leading-relaxed text-ink-dim md:text-lg md:leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}

              <ul className="divide-y divide-line border-t border-line">
                {block.items.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-5 py-4 text-base text-ink"
                  >
                    <span
                      className="font-mono text-[11px] text-ink-faint"
                      aria-hidden="true"
                    >
                      {pad(i + 1)}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function SectionLabel({
  number,
  heading,
}: {
  number: string;
  heading: string;
}) {
  return (
    <>
      <div className="flex items-center gap-4">
        <span
          className="font-mono text-xs tracking-widest text-accent"
          aria-hidden="true"
        >
          {number}
        </span>
        <span className="h-px w-10 bg-line" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em]">
        {heading}
      </h2>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Gallery({ shots, url }: { shots: Shot[]; url: string }) {
  const cols =
    shots.length === 1
      ? "md:grid-cols-1"
      : shots.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <div className={cn("grid items-start gap-6 md:gap-8", cols)}>
      {shots.map((shot) => (
        <ShotFrame key={shot.label} shot={shot} url={url} />
      ))}
    </div>
  );
}

function Compare({
  before,
  after,
  url,
}: {
  before: Shot;
  after: Shot;
  url: string;
}) {
  return (
    <div className="grid items-start gap-8 md:grid-cols-2">
      <div>
        <p className="label mb-4 text-ink-faint">Before</p>
        <ShotFrame shot={before} url={url} />
      </div>
      <div>
        <p className="label mb-4 text-accent">After</p>
        <ShotFrame shot={after} url={url} />
      </div>
    </div>
  );
}

/** Portrait shots are capped so they do not tower over their neighbours. */
function ShotFrame({ shot, url }: { shot: Shot; url: string }) {
  const portrait = shot.ratio === "9/16";

  return (
    <div className={cn("group/card", portrait && "mx-auto w-full max-w-[300px]")}>
      <BrowserFrame
        src={shot.src}
        alt={shot.caption ?? shot.label}
        url={portrait ? undefined : url}
        label={shot.label}
        caption={shot.caption ?? shot.label}
        ratio={shot.ratio ?? "16/10"}
      />
    </div>
  );
}
