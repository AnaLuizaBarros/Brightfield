import { ImageResponse } from "next/og";
import type { CityData } from "@/lib/city/schema";
import { formatUsd } from "@/lib/format";
import { calculate } from "@/lib/solar/calc";
import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";

const OG_SIZE = { width: 1200, height: 630 };

const COLORS = {
  canvas: "#fbfbf9",
  ink: "#16181a",
  sun: "#ff7a1a",
  stone: "#f2f2ee",
} as const;

/** The link preview of a city page: its headline and the default estimate. */
export function renderCityOgImage(city: CityData) {
  const result = calculate(DEFAULT_SCENARIO, city);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLORS.canvas,
          color: COLORS.ink,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 800 }}>
          <div style={{ width: 44, height: 22, background: COLORS.sun, borderRadius: "44px 44px 0 0" }} />
          Brightfield
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: COLORS.ink, opacity: 0.7, fontWeight: 700 }}>
            {`${city.city}, ${city.state} · ${city.utilityName}`}
          </div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            {`Solar for ${city.city} homes, priced to the panel.`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 30 }}>
          <Chip label={`${formatUsd(DEFAULT_SCENARIO.monthlyBill)} bill → ${result.panels} panels`} />
          <Chip label={`${result.paybackYears.toFixed(1)} year payback`} highlight />
          <Chip label={`${city.avgRating.toFixed(1)} rating · ${city.installsCompleted.toLocaleString("en-US")} installs`} />
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

function Chip({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "14px 26px",
        borderRadius: 6,
        background: highlight ? COLORS.sun : COLORS.stone,
        color: COLORS.ink,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}
