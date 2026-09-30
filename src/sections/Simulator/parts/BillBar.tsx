import type { CSSProperties } from "react";
import type { SimulatorResult } from "@/lib/solar/calc";
import { formatUsdCents } from "@/lib/format";
import styles from "./BillBar.module.scss";

type BillBarProps = { monthlyBill: number; result: SimulatorResult };

/**
 * The monthly bill as a bar: what solar covers, what is still paid to the
 * utility, and any extra generation that becomes credit instead of cash.
 */
export function BillBar({ monthlyBill, result }: BillBarProps) {
  const surplus = Math.max(0, result.generationValue - monthlyBill);
  const remaining = Math.max(0, monthlyBill - result.monthlySavings);
  const total = monthlyBill + surplus;
  const share = (value: number) => value / total;

  const segments = [
    { key: "covered", label: "Covered by solar", value: result.monthlySavings },
    { key: "remaining", label: "Still paid to the utility", value: remaining },
    { key: "credit", label: "Extra, kept as bill credit", value: surplus },
  ].filter((segment) => segment.value >= 0.005);

  return (
    <div className={styles.bill}>
      <div className={styles.bar} aria-hidden="true">
        {segments.map((segment) => (
          <span
            key={segment.key}
            data-kind={segment.key}
            style={{ "--share": share(segment.value) } as CSSProperties}
          />
        ))}
      </div>
      <dl className={styles.legend}>
        {segments.map((segment) => (
          <div key={segment.key} data-kind={segment.key}>
            <dt>{segment.label}</dt>
            <dd>{formatUsdCents(segment.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
