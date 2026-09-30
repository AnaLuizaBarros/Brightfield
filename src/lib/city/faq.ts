import { calculate } from "@/lib/solar/calc";
import type { CityData } from "./schema";
import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";
import { formatUsd } from "@/lib/format";

export type ResolvedFaqItem = { q: string; a: string };

/**
 * FAQ answers in the data file use `{{tokens}}` for every number that comes
 * from the calculation, so the FAQ, the simulator and the structured data
 * cannot disagree.
 */
function buildTokens(city: CityData): Record<string, string> {
  const result = calculate(DEFAULT_SCENARIO, city);
  return {
    city: city.city,
    utility: city.utilityName,
    sunHours: String(city.peakSunHoursPerDay),
    sampleBill: String(DEFAULT_SCENARIO.monthlyBill),
    coveragePct: String(Math.round(DEFAULT_SCENARIO.coverage * 100)),
    panels: String(result.panels),
    costPerWatt: city.costPerWattInstalled.toFixed(2),
    grossCost: formatUsd(result.grossCost),
    netCost: formatUsd(result.netCost),
    creditPct: String(Math.round(city.federalCreditRate * 100)),
    paybackWhole: String(Math.round(result.paybackYears)),
    permitDays: String(city.avgPermitDays),
    installDaysText:
      city.installDays === 1 ? "one day" : `${city.installDays} days`,
  };
}

function fillTokens(template: string, tokens: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = tokens[key];
    if (value === undefined) {
      throw new Error(`Unknown FAQ token "{{${key}}}"`);
    }
    return value;
  });
}

export function resolveFaq(city: CityData): ResolvedFaqItem[] {
  const tokens = buildTokens(city);
  return city.faq.map(({ q, a }) => ({
    q: fillTokens(q, tokens),
    a: fillTokens(a, tokens),
  }));
}
