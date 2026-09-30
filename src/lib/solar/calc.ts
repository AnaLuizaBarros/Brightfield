import type { PricingInputs } from "@/lib/city/schema";

const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
/** Guards `ceil` against float noise such as 16.700000000000003. */
const PANEL_ROUNDING_DECIMALS = 6;

export type SimulatorInput = {
  /** Average monthly electric bill in dollars. */
  monthlyBill: number;
  /** Share of usage to cover, from 0 to 1. */
  coverage: number;
};

export type SimulatorResult = {
  /** Panels the coverage target asks for, before rounding. */
  requestedPanels: number;
  /** Panels actually installed: rounded up, never below the city minimum. */
  panels: number;
  kwhPerPanelPerMonth: number;
  monthlyUsageKwh: number;
  generationKwhPerMonth: number;
  /** Share of monthly usage the installed system produces (can exceed 1). */
  systemCoverage: number;
  grossCost: number;
  federalCredit: number;
  netCost: number;
  /** Value of everything the system generates, before the bill cap. */
  generationValue: number;
  /** Savings after capping at the bill. */
  monthlySavings: number;
  paybackYears: number;
  /** The city minimum forced a larger system than the coverage asked for. */
  minimumApplied: boolean;
  /** Generation is worth more than the bill, so savings stop at the bill. */
  savingsCapped: boolean;
};

const roundTo = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export function calculate(
  { monthlyBill, coverage }: SimulatorInput,
  city: PricingInputs,
): SimulatorResult {
  const monthlyUsageKwh = monthlyBill / city.utilityRatePerKwh;
  const targetKwh = monthlyUsageKwh * coverage;
  const kwhPerPanelPerMonth =
    (city.panelWatts / 1000) *
    city.peakSunHoursPerDay *
    DAYS_PER_MONTH *
    city.performanceRatio;

  const requestedPanels = targetKwh / kwhPerPanelPerMonth;
  const roundedUp = Math.ceil(roundTo(requestedPanels, PANEL_ROUNDING_DECIMALS));
  const panels = Math.max(roundedUp, city.minPanels);

  const grossCost = panels * city.panelWatts * city.costPerWattInstalled;
  const federalCredit = grossCost * city.federalCreditRate;
  const netCost = grossCost - federalCredit;

  const generationKwhPerMonth = panels * kwhPerPanelPerMonth;
  const generationValue = generationKwhPerMonth * city.utilityRatePerKwh;
  const monthlySavings = Math.min(generationValue, monthlyBill);
  const paybackYears = netCost / (monthlySavings * MONTHS_PER_YEAR);

  return {
    requestedPanels,
    panels,
    kwhPerPanelPerMonth,
    monthlyUsageKwh,
    generationKwhPerMonth,
    systemCoverage: generationKwhPerMonth / monthlyUsageKwh,
    grossCost,
    federalCredit,
    netCost,
    generationValue,
    monthlySavings,
    paybackYears,
    minimumApplied: roundedUp < city.minPanels,
    savingsCapped: roundTo(generationValue, 2) > monthlyBill,
  };
}
