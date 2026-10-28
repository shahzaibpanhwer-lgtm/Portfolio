import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Same layer mark as the navbar, on a dark tile so it holds up on light
 * browser chrome as well as dark.
 */
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
          background: "#0f0f12",
          borderRadius: 16,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
          <path
            d="M4 19.5 16 26l12-6.5"
            stroke="#8b8b94"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 14.5 16 21l12-6.5"
            stroke="#a1a1aa"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.5 28 10 16 16.5 4 10Z"
            fill="rgba(198,242,90,0.2)"
            stroke="#c6f25a"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
