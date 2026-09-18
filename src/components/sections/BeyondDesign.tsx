import Link from "next/link";
import { beyondDesign } from "@/data/content";
import { getProject } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";

/**
 * Intentionally the quietest major section on the page: no section
 * heading scale, no large visuals. It supports the primary positioning
 * rather than competing with it — but it is anchored by DevFlow, which
 * is a real shipped product, not a "currently learning" list.
 */
export function BeyondDesign() {
  const devflow = getProject("devflow");

  return (
    <section id="beyond-design" className="py-20 md:py-28">
      <div className="container-edge">
        <Reveal className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-12">
          {/* Heading — deliberately smaller than a primary section */}
          <div className="lg:col-span-4">
            <p className="label mb-5">Also</p>
            <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] font-semibold leading-tight tracking-[-0.025em] text-ink-dim">
              {beyondDesign.heading}
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="max-w-xl text-base leading-relaxed text-ink-dim">
              {beyondDesign.body}
            </p>

            {/* Areas */}
            <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {beyondDesign.areas.map((area) => (
                <div key={area.title}>
                  <dt className="text-sm font-medium text-ink">
                    {area.title}
                  </dt>
                  <dd className="mt-2 text-sm text-ink-faint">
                    {area.items.join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Proof point */}
            {devflow ? (
              <div className="mt-12 rounded-xl border border-line bg-surface/50 p-6">
                <p className="label mb-4">Built end to end</p>
                <Link
                  href={`/work/${devflow.slug}`}
                  className="group/btn block"
                >
                  <span className="font-display text-xl font-semibold tracking-tight transition-colors duration-300 group-hover/btn:text-accent">
                    {devflow.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink-dim">
                    {devflow.tagline}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-300 group-hover/btn:text-accent">
                    View case study
                    <Arrow />
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
