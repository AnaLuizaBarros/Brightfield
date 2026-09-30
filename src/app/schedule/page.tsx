import type { Metadata } from "next";
import { SimplePage } from "@/components/layout/SimplePage";
import { BookingForm } from "@/features/booking";
import { getCity, listCities } from "@/lib/city/cities";
import { BILL_RANGE, COVERAGE_RANGE } from "@/lib/city/schema";
import { formatInt, formatUsd, formatUsdCents, formatYears } from "@/lib/format";
import { calculate } from "@/lib/solar/calc";
import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";

export const metadata: Metadata = {
  title: "Request a site visit",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const CARRIED_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const inRange = (value: number, min: number, max: number) =>
  Number.isFinite(value) && value >= min && value <= max;

/**
 * The visit request. It carries the person's estimate and the campaign that
 * brought them, so the team knows both what convinced them and which ad paid.
 */
export default async function SchedulePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const city = getCity(first(params.city) ?? "") ?? listCities()[0];
  if (!city) return null;

  const billParam = Number(first(params.bill));
  const coverageParam = Number(first(params.coverage));
  const bill = inRange(billParam, BILL_RANGE.min, BILL_RANGE.max)
    ? billParam
    : DEFAULT_SCENARIO.monthlyBill;
  const coverage = inRange(coverageParam, COVERAGE_RANGE.min, COVERAGE_RANGE.max)
    ? coverageParam
    : Math.round(DEFAULT_SCENARIO.coverage * 100);
  const estimate = calculate({ monthlyBill: bill, coverage: coverage / 100 }, city);

  const carried: Record<string, string> = {
    city: city.slug,
    bill: String(bill),
    coverage: String(coverage),
  };
  for (const key of CARRIED_KEYS) {
    const value = first(params[key]);
    if (value) carried[key] = value.slice(0, 200);
  }

  return (
    <SimplePage title={`Request a site visit in ${city.city}`}>
      <p>
        A {city.city} crew measures your roof and confirms the estimate below. Permits average{" "}
        {city.avgPermitDays} days after that.
      </p>
      <dl>
        <div>
          <dt>Your estimate</dt>
          <dd>
            {formatInt(estimate.panels)} panels, {formatUsd(estimate.netCost)} after the credit
          </dd>
        </div>
        <div>
          <dt>Monthly savings</dt>
          <dd>{formatUsdCents(estimate.monthlySavings)}</dd>
        </div>
        <div>
          <dt>Payback</dt>
          <dd>{formatYears(estimate.paybackYears)} years</dd>
        </div>
      </dl>
      <BookingForm city={city} carried={carried} />
      <p>
        <a href={`/${city.slug}#simulator`}>Back to the estimate</a>
      </p>
    </SimplePage>
  );
}
