import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Same SP monogram as the navbar mark, so the tab icon matches the site. */
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
          background: "#111114",
          borderRadius: 16,
        }}
      >
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
          <g transform="translate(16 16) scale(0.86) translate(-16 -16)">
            <path
              d="M14.6 11.6c0-1.7-1.6-2.6-3.5-2.6-2.1 0-4.1.9-4.1 3 0 3.9 7.6 2.8 7.6 7.3 0 2.4-2.1 3.5-4.2 3.5-2.1 0-4-.8-4.5-2.6"
              stroke="#f5f5f5"
              strokeWidth="2.85"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.5 23V9h4.3c2.5 0 4.1 1.8 4.1 4.2s-1.6 4.2-4.1 4.2h-4.3"
              stroke="#4d7cfe"
              strokeWidth="2.85"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
