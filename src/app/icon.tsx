import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** SP monogram on the site's own background — no stock favicon. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
          color: "#e8a75c",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 14,
        }}
      >
        SP
      </div>
    ),
    size,
  );
}
