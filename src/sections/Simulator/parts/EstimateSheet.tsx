import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { BookingLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { useSimulator } from "@/features/simulator";
import { formatInt, formatUsd, formatUsdCents, formatYears } from "@/lib/format";
import { BillBar } from "./BillBar";
import styles from "./EstimateSheet.module.scss";
import { MathBreakdown } from "./MathBreakdown";
import { PanelRoof } from "./PanelRoof";

const WATTS_PER_KW = 1000;
const formatPanels = (value: number) => formatInt(Math.round(value));
const formatCredit = (value: number) => `-${formatUsd(value)}`;

/**
 * The result, laid out like the estimate an installer would hand over.
 * The four figures the person came for lead; the working follows.
 */
export function EstimateSheet() {
  const { city, result, monthlyBill, coveragePercent } = useSimulator();
  const creditPct = Math.round(city.federalCreditRate * 100);
  const systemKw = (result.panels * city.panelWatts) / WATTS_PER_KW;
  const requested = Math.ceil(Number(result.requestedPanels.toFixed(6)));

  return (
    <div className={styles.sheet}>
      <header className={styles.head}>
        <h3>Your estimate</h3>
        <p role="status">
          A {formatUsd(monthlyBill)} monthly bill at {coveragePercent}% coverage needs{" "}
          {formatInt(result.panels)} panels, costs {formatUsd(result.netCost)} after the{" "}
          {creditPct}% federal credit, and pays back in about {formatYears(result.paybackYears)}{" "}
          years.
        </p>
      </header>

      <dl className={styles.figures}>
        <div>
          <dt>Solar panels</dt>
          <dd>
            <AnimatedNumber value={result.panels} format={formatPanels} />
          </dd>
        </div>
        <div>
          <dt>Price after the {creditPct}% credit</dt>
          <dd>
            <AnimatedNumber value={result.netCost} format={formatUsd} />
          </dd>
        </div>
        <div>
          <dt>Monthly savings</dt>
          <dd>
            <AnimatedNumber value={result.monthlySavings} format={formatUsdCents} />
          </dd>
        </div>
        <div>
          <dt>Pays for itself in</dt>
          <dd>
            <AnimatedNumber value={result.paybackYears} format={formatYears} />
            <small>years</small>
          </dd>
        </div>
      </dl>

      {(result.minimumApplied || result.savingsCapped) && (
        <div className={styles.notices}>
          {result.minimumApplied && (
            <Notice title={`We sized it at ${city.minPanels} panels.`}>
              Your numbers ask for {requested}, but every installation in {city.city} has a
              minimum of {city.minPanels}. The price and savings here are for {city.minPanels}{" "}
              panels.
            </Notice>
          )}
          {result.savingsCapped && (
            <Notice title="Your savings stop at your bill.">
              This system generates {formatUsdCents(result.generationValue)} of power a month,
              more than your {formatUsdCents(monthlyBill)} bill. {city.utilityName} turns the
              extra into credit on future bills, never into cash, so we count{" "}
              {formatUsdCents(result.monthlySavings)} and use that for the payback time.
            </Notice>
          )}
        </div>
      )}

      <div className={styles.working}>
        <div className={styles.column}>
          <h4>The array</h4>
          <PanelRoof panels={result.panels} requested={requested} systemKw={systemKw} />
        </div>

        <div className={styles.column}>
          <h4>The price</h4>
          <dl className={styles.lines}>
            <div>
              <dt>
                System price
                <small>
                  {result.panels} panels × {city.panelWatts} W × $
                  {city.costPerWattInstalled.toFixed(2)}
                </small>
              </dt>
              <dd>
                <AnimatedNumber value={result.grossCost} format={formatUsd} />
              </dd>
            </div>
            <div>
              <dt>Federal tax credit, {creditPct}%</dt>
              <dd>
                <AnimatedNumber value={result.federalCredit} format={formatCredit} />
              </dd>
            </div>
            <div className={styles.total}>
              <dt>Your price</dt>
              <dd>
                <AnimatedNumber value={result.netCost} format={formatUsd} />
              </dd>
            </div>
          </dl>
        </div>

        <div className={styles.column}>
          <h4>Your bill each month</h4>
          <BillBar monthlyBill={monthlyBill} result={result} />
        </div>
      </div>

      <MathBreakdown
        city={city}
        result={result}
        monthlyBill={monthlyBill}
        coveragePercent={coveragePercent}
      />

      <div className={styles.action}>
        <BookingLink citySlug={city.slug} location="simulator">
          Request a site visit
        </BookingLink>
        <p>A {city.city} crew confirms this estimate on your roof.</p>
      </div>
    </div>
  );
}
