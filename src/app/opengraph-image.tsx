import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

/**
 * Share card. Same composition language as the hero: warm off-centre
 * glow, tight display type, one accent rule.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: 80,
          position: "relative",
        }}
      >
        {/* warm glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -150,
            width: 800,
            height: 700,
            background:
              "radial-gradient(circle, rgba(198,242,90,0.16) 0%, rgba(198,242,90,0) 68%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 2, background: "#c6f25a" }} />
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 22,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ededed",
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            Full-Stack Developer
          </div>
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            <span style={{ color: "#c6f25a" }}>&</span>
            <span style={{ marginLeft: 20 }}>UI/UX Designer</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1f1f24",
            paddingTop: 32,
          }}
        >
          <div
            style={{
              color: "#ededed",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {site.name}
          </div>
          <div style={{ color: "#8b8b94", fontSize: 22 }}>
            Development · Design · WordPress
          </div>
        </div>
      </div>
    ),
    size,
  );
}
