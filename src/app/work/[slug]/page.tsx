import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, getNextProject } from "@/data/projects";
import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudyBody } from "@/components/casestudy/CaseStudyBody";
import {
  LiveProject,
  NextProject,
} from "@/components/casestudy/CaseStudyFooter";

type Params = { params: Promise<{ slug: string }> };

/** Every case study is known at build time — all four prerender. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Not found" };

  const title = `${project.title} — ${project.tagline}`;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      type: "article",
      title,
      description: project.description,
      url: `/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
    },
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getNextProject(slug);

  return (
    <article>
      <CaseStudyHero project={project} />
      <div className="mt-20 md:mt-28">
        <CaseStudyBody blocks={project.caseStudy} />
      </div>
      <LiveProject project={project} />
      {next && next.slug !== project.slug ? (
        <NextProject project={next} />
      ) : null}
    </article>
  );
}
