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
          background: "#0b0b0c",
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
              "radial-gradient(circle, rgba(77,124,254,0.16) 0%, rgba(77,124,254,0) 68%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 2, background: "#4d7cfe" }} />
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
              color: "#f5f5f5",
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
            <span style={{ color: "#4d7cfe" }}>&</span>
            <span style={{ marginLeft: 20 }}>UI/UX Designer</span>
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
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {site.name}
          </div>
          <div style={{ color: "#6b6b74", fontSize: 22 }}>
            Development · Design · WordPress
          </div>
        </div>
      </div>
    ),
    size,
  );
}
