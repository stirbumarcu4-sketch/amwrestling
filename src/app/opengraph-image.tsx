import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.nume} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f8f6f2",
          padding: "72px",
          borderTop: "16px solid #a63d2f",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6b7680",
            }}
          >
            Echipament de armwrestling
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "#14181c",
            }}
          >
            {site.nume}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36, color: "#2b333b" }}>{site.tagline}</div>
          <div style={{ marginTop: 16, fontSize: 26, color: "#6b7680" }}>
            Mese · Mânere · Grippere · Protecții · Livrare în toată Moldova
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
