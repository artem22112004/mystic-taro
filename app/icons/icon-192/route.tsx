import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#0D0B1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            fontSize: 100,
            color: "#D4AF37",
            lineHeight: 1,
            fontFamily: "serif",
          }}
        >
          ☽
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
