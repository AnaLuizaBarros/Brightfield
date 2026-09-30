import type { CityData } from "@/lib/city/schema";
import styles from "./Assumptions.module.scss";

/**
 * The inputs behind every estimate, shown in the open. They come straight
 * from the city's data file, so they are the same numbers the math uses.
 */
export function Assumptions({ city }: { city: CityData }) {
  const items = [
    { value: `$${city.utilityRatePerKwh.toFixed(2)}`, label: `per kWh, ${city.utilityName} rate` },
    { value: String(city.peakSunHoursPerDay), label: `peak sun hours a day in ${city.city}` },
    { value: `${city.panelWatts} W`, label: "per panel" },
    { value: `$${city.costPerWattInstalled.toFixed(2)}`, label: "per watt, installed" },
    { value: `${Math.round(city.federalCreditRate * 100)}%`, label: "federal tax credit" },
  ];

  return (
    <aside aria-labelledby="assumptions-title" className={styles.assumptions}>
      <h3 id="assumptions-title">What every estimate is based on</h3>
      <dl>
        {items.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
