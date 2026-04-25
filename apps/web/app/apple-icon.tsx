import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 40,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 32 32">
          <path d="M16 7 L29 13 L16 19 L3 13 Z" fill="#ffffff" />
          <path
            d="M9 16 L9 22 C9 24.2 12.1 25.5 16 25.5 C19.9 25.5 23 24.2 23 22 L23 16 L16 19 Z"
            fill="#ffffff"
          />
          <path
            d="M28.2 13.4 L28.2 20"
            stroke="#f59e0b"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="28.2" cy="21.4" r="1.5" fill="#f59e0b" />
        </svg>
      </div>
    ),
    size,
  );
}
