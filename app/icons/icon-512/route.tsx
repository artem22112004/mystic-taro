import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#0D0B1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 108,
        }}
      >
        <div
          style={{
            fontSize: 280,
            color: "#D4AF37",
            lineHeight: 1,
            fontFamily: "serif",
          }}
        >
          ☽
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
