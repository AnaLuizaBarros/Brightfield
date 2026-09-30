import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { CityData } from "@/lib/city/schema";
import { formatInt, formatUsdCents, formatYears } from "@/lib/format";
import type { SimulatorResult } from "@/lib/solar/calc";
import styles from "./MathBreakdown.module.scss";

type MathBreakdownProps = {
  city: CityData;
  result: SimulatorResult;
  monthlyBill: number;
  coveragePercent: number;
};

const kwh = (value: number) => `${formatInt(value)} kWh`;

/** Every step of the calculation with its inputs, in the order it is applied. */
export function MathBreakdown({ city, result, monthlyBill, coveragePercent }: MathBreakdownProps) {
  const creditPct = Math.round(city.federalCreditRate * 100);
  const targetKwh = (result.monthlyUsageKwh * coveragePercent) / 100;
  const minimumNote = result.minimumApplied
    ? `, raised to the minimum of ${city.minPanels}`
    : "";

  const steps: [term: string, working: string][] = [
    [
      "Your monthly usage",
      `${formatUsdCents(monthlyBill)} ÷ $${city.utilityRatePerKwh.toFixed(2)} per kWh = ${kwh(result.monthlyUsageKwh)}`,
    ],
    ["Usage to cover", `${kwh(result.monthlyUsageKwh)} × ${coveragePercent}% = ${kwh(targetKwh)}`],
    [
      "One panel makes",
      `${city.panelWatts / 1000} kW × ${city.peakSunHoursPerDay} sun hours × 30 days × ${city.performanceRatio} = ${result.kwhPerPanelPerMonth.toFixed(1)} kWh a month`,
    ],
    ["Panels", `${result.requestedPanels.toFixed(2)} rounded up${minimumNote} = ${result.panels}`],
    [
      "Price before credit",
      `${result.panels} × ${city.panelWatts} W × $${city.costPerWattInstalled.toFixed(2)} = ${formatUsdCents(result.grossCost)}`,
    ],
    [
      `After the ${creditPct}% credit`,
      `${formatUsdCents(result.grossCost)} less ${formatUsdCents(result.federalCredit)} = ${formatUsdCents(result.netCost)}`,
    ],
    [
      "Power generated",
      `${result.panels} × ${result.kwhPerPanelPerMonth.toFixed(1)} kWh = ${kwh(result.generationKwhPerMonth)} a month, worth ${formatUsdCents(result.generationValue)}`,
    ],
    [
      "Monthly savings",
      result.savingsCapped
        ? `${formatUsdCents(result.generationValue)} limited to your ${formatUsdCents(monthlyBill)} bill = ${formatUsdCents(result.monthlySavings)}`
        : formatUsdCents(result.monthlySavings),
    ],
    [
      "Payback",
      `${formatUsdCents(result.netCost)} ÷ (${formatUsdCents(result.monthlySavings)} × 12) = ${formatYears(result.paybackYears)} years`,
    ],
  ];

  return (
    <details className={styles.breakdown}>
      <summary>
        See every step of the math
        <CaretDown size={18} weight="bold" aria-hidden="true" />
      </summary>
      <ol>
        {steps.map(([term, working]) => (
          <li key={term}>
            <span>{term}</span>
            <code>{working}</code>
          </li>
        ))}
      </ol>
    </details>
  );
}
