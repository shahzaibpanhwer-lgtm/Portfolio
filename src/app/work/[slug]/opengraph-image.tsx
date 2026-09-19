import { ImageResponse } from "next/og";
import { projects, getProject } from "@/data/projects";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/**
 * Per-case-study share card. Without this, generateMetadata's openGraph
 * block replaces the root one and these routes ship with no image at all.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -160,
            width: 820,
            height: 720,
            background:
              "radial-gradient(circle, rgba(232,167,92,0.16) 0%, rgba(232,167,92,0) 68%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              color: "#e8a75c",
              fontSize: 22,
              letterSpacing: "0.2em",
              fontWeight: 600,
            }}
          >
            {project?.number ?? "—"}
          </div>
          <div style={{ width: 40, height: 1, background: "#242428" }} />
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {project?.tagline ?? "Case study"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f5f5f5",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              display: "flex",
            }}
          >
            {project?.title ?? "Work"}
          </div>
          <div
            style={{
              marginTop: 22,
              color: "#a1a1aa",
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 900,
              display: "flex",
            }}
          >
            {project?.description ?? ""}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #242428",
            paddingTop: 32,
          }}
        >
          <div
            style={{
              color: "#f5f5f5",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {site.name}
          </div>
          <div style={{ color: "#6b6b74", fontSize: 22 }}>
            {project?.role ?? site.role}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
