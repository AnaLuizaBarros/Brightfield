import type { CityData } from "@/lib/city/schema";
import { formatInt, formatUsd } from "@/lib/format";
import styles from "./PriceTable.module.scss";

const WATTS_PER_KW = 1000;
const DAYS_PER_MONTH = 30;

/** Sizes shown in the table: the city minimum, then common steps. */
const sizesFor = (minPanels: number) =>
  [minPanels, 12, 17, 25, 33, 41].filter((n, i, all) => n >= minPanels && all.indexOf(n) === i);

/**
 * What a system costs at each size, from the same inputs the simulator uses.
 * Static and server rendered, so it is readable without JavaScript.
 */
export function PriceTable({ city }: { city: CityData }) {
  const creditPct = Math.round(city.federalCreditRate * 100);
  const kwhPerPanel =
    (city.panelWatts / WATTS_PER_KW) *
    city.peakSunHoursPerDay *
    DAYS_PER_MONTH *
    city.performanceRatio;

  const rows = sizesFor(city.minPanels).map((panels) => {
    const gross = panels * city.panelWatts * city.costPerWattInstalled;
    const generation = panels * kwhPerPanel;
    return {
      panels,
      kw: (panels * city.panelWatts) / WATTS_PER_KW,
      gross,
      net: gross * (1 - city.federalCreditRate),
      generation,
      worth: generation * city.utilityRatePerKwh,
    };
  });

  return (
    <div className={styles.block}>
      <h3 id="price-table-title">What a system costs in {city.city}, by size</h3>
      <p>
        Every row uses the same rate, sun hours and price per watt as your estimate. Savings are
        worth up to the power's value; they never exceed your bill.
      </p>
      <div className={styles.scroll}>
        <table aria-labelledby="price-table-title">
          <thead>
            <tr>
              <th scope="col">Panels</th>
              <th scope="col">System</th>
              <th scope="col">Price</th>
              <th scope="col">After {creditPct}% credit</th>
              <th scope="col">Power a month</th>
              <th scope="col">Worth a month</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.panels}>
                <th scope="row">
                  {row.panels}
                  {row.panels === city.minPanels && <small>minimum</small>}
                </th>
                <td>{row.kw.toFixed(2)} kW</td>
                <td>{formatUsd(row.gross)}</td>
                <td>{formatUsd(row.net)}</td>
                <td>{formatInt(row.generation)} kWh</td>
                <td>{formatUsd(row.worth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
