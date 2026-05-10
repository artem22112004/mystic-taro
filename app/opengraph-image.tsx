import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Мистические расклады — AI Таро";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0D0B1A 0%, #1a0f2e 50%, #0D0B1A 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          fontFamily: "serif",
        }}
      >
        {/* Moon */}
        <div style={{ fontSize: 120, color: "#D4AF37", lineHeight: 1 }}>☽</div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            color: "#D4AF37",
            fontWeight: 700,
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          Мистические расклады
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(200,180,240,0.7)",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          AI-таролог · Карта дня · Да или Нет · На отношения
        </div>

        {/* Stars */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            fontSize: 20,
            color: "#D4AF37",
            opacity: 0.4,
          }}
        >
          ✦ ✦ ✦
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            fontSize: 20,
            color: "#D4AF37",
            opacity: 0.4,
          }}
        >
          ✦ ✦ ✦
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
