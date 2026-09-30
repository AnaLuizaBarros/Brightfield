import { useSimulator } from "@/features/simulator";
import { formatInt } from "@/lib/format";
import styles from "./UsageReadout.module.scss";

/**
 * The first two steps of the math, read straight from the inputs: how much
 * power the bill buys, and how much of it solar is asked to cover.
 */
export function UsageReadout() {
  const { city, result, monthlyBill, coveragePercent } = useSimulator();
  const targetKwh = (result.monthlyUsageKwh * coveragePercent) / 100;

  return (
    <dl className={styles.readout}>
      <div>
        <dt>Your usage each month</dt>
        <dd>
          {formatInt(result.monthlyUsageKwh)} kWh
          <small>
            ${monthlyBill} at ${city.utilityRatePerKwh.toFixed(2)} per kWh
          </small>
        </dd>
      </div>
      <div>
        <dt>Solar should cover</dt>
        <dd>
          {formatInt(targetKwh)} kWh
          <small>{coveragePercent}% of it</small>
        </dd>
      </div>
      <div>
        <dt>One panel makes</dt>
        <dd>
          {result.kwhPerPanelPerMonth.toFixed(0)} kWh
          <small>
            {city.peakSunHoursPerDay} sun hours a day in {city.city}
          </small>
        </dd>
      </div>
    </dl>
  );
}
