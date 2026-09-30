import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { calculate } from "./calc";
import { citySchema, type CityData } from "@/lib/city/schema";
import { resolveFaq } from "@/lib/city/faq";

const phoenix: CityData = citySchema.parse(
  JSON.parse(
    readFileSync(path.join(process.cwd(), "data/cities/phoenix-az.json"), "utf8"),
  ),
);

/** A second city with different numbers proves nothing is hardcoded. */
const otherCity: CityData = {
  ...phoenix,
  utilityRatePerKwh: 0.2,
  peakSunHoursPerDay: 5,
  panelWatts: 400,
  costPerWattInstalled: 3,
  minPanels: 6,
  federalCreditRate: 0.25,
};

describe("the brief's example table (Phoenix)", () => {
  const rows = [
    { bill: 220, coverage: 0.8, panels: 17, net: 14726.25, savings: 179.01, payback: "6.9" },
    { bill: 430, coverage: 0.8, panels: 33, net: 28586.25, savings: 347.49, payback: "6.9" },
    { bill: 430, coverage: 1.0, panels: 41, net: 35516.25, savings: 430.0, payback: "6.9" },
    { bill: 90, coverage: 0.8, panels: 8, net: 6930.0, savings: 84.24, payback: "6.9" },
    { bill: 60, coverage: 0.8, panels: 8, net: 6930.0, savings: 60.0, payback: "9.6" },
    { bill: 60, coverage: 0.5, panels: 8, net: 6930.0, savings: 60.0, payback: "9.6" },
  ];

  it.each(rows)(
    "bill $bill at $coverage coverage",
    ({ bill, coverage, panels, net, savings, payback }) => {
      const result = calculate({ monthlyBill: bill, coverage }, phoenix);
      expect(result.panels).toBe(panels);
      expect(result.netCost).toBeCloseTo(net, 2);
      expect(result.monthlySavings).toBeCloseTo(savings, 2);
      expect(result.paybackYears.toFixed(1)).toBe(payback);
    },
  );
});

describe("the three adjustments", () => {
  it("caps savings at the bill and flags it, keeping the uncapped value", () => {
    const result = calculate({ monthlyBill: 430, coverage: 1 }, phoenix);
    expect(result.savingsCapped).toBe(true);
    expect(result.generationValue).toBeCloseTo(431.73, 2);
    expect(result.monthlySavings).toBe(430);
  });

  it("applies the minimum and flags it when the calculation asks for less", () => {
    const result = calculate({ monthlyBill: 90, coverage: 0.8 }, phoenix);
    expect(Math.ceil(result.requestedPanels)).toBe(7);
    expect(result.panels).toBe(8);
    expect(result.minimumApplied).toBe(true);
  });

  it("rounds panels up and drives cost from the rounded number", () => {
    const result = calculate({ monthlyBill: 220, coverage: 0.8 }, phoenix);
    expect(result.requestedPanels).toBeCloseTo(16.71, 2);
    expect(result.panels).toBe(17);
    expect(result.grossCost).toBeCloseTo(17 * 450 * 2.75, 2);
  });

  it("flags nothing for an ordinary house", () => {
    const result = calculate({ monthlyBill: 220, coverage: 0.8 }, phoenix);
    expect(result.minimumApplied).toBe(false);
    expect(result.savingsCapped).toBe(false);
  });

  it("gives the same result when lowering coverage under the minimum", () => {
    const high = calculate({ monthlyBill: 60, coverage: 0.8 }, phoenix);
    const low = calculate({ monthlyBill: 60, coverage: 0.5 }, phoenix);
    expect(low).toEqual({ ...high, requestedPanels: low.requestedPanels });
  });
});

describe("range extremes and other cities", () => {
  it("handles the smallest and the largest inputs", () => {
    expect(calculate({ monthlyBill: 40, coverage: 0.5 }, phoenix).panels).toBe(8);
    const largest = calculate({ monthlyBill: 600, coverage: 1 }, phoenix);
    expect(largest.panels).toBeGreaterThan(50);
    expect(Number.isFinite(largest.paybackYears)).toBe(true);
  });

  it("uses only the city's own numbers", () => {
    const result = calculate({ monthlyBill: 220, coverage: 0.8 }, otherCity);
    const kwhPerPanel = 0.4 * 5 * 30 * 0.8;
    const expectedPanels = Math.ceil((220 / 0.2) * 0.8 / kwhPerPanel);
    expect(result.panels).toBe(expectedPanels);
    expect(result.netCost).toBeCloseTo(expectedPanels * 400 * 3 * 0.75, 2);
  });
});

describe("FAQ answers", () => {
  it("quote the same figures the simulator shows in its starting state", () => {
    const answers = resolveFaq(phoenix).map(({ a }) => a).join(" ");
    expect(answers).toContain("about 17 panels");
    expect(answers).toContain("$21,038");
    expect(answers).toContain("$14,726");
    expect(answers).toContain("about 7 years");
    expect(answers).toContain("21 days");
  });

  it("fail loudly on an unknown token", () => {
    const broken = { ...phoenix, faq: [{ q: "Q {{nope}}", a: "A" }] };
    expect(() => resolveFaq(broken)).toThrow(/nope/);
  });
});
