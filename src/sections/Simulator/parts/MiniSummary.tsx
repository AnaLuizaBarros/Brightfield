import { formatUsd, formatYears } from "@/lib/format";
import type { SimulatorResult } from "@/lib/solar/calc";
import styles from "./MiniSummary.module.scss";

/**
 * Phone only. Stays at the top of the screen while the controls are in view,
 * so nobody has to scroll to see what their thumb just changed.
 */
export function MiniSummary({ result }: { result: SimulatorResult }) {
  return (
    <dl className={styles.summary} aria-hidden="true">
      <div>
        <dt>Panels</dt>
        <dd>{result.panels}</dd>
      </div>
      <div>
        <dt>Price</dt>
        <dd>{formatUsd(result.netCost)}</dd>
      </div>
      <div>
        <dt>Saves</dt>
        <dd>{formatUsd(result.monthlySavings)}/mo</dd>
      </div>
      <div>
        <dt>Payback</dt>
        <dd>{formatYears(result.paybackYears)} yr</dd>
      </div>
    </dl>
  );
}
