"use client";

import { RangeField } from "@/components/ui/RangeField";
import { SimulatorProvider, useSimulator } from "@/features/simulator";
import { BILL_RANGE, COVERAGE_RANGE, type CityData } from "@/lib/city/schema";
import { formatPercent, formatUsd } from "@/lib/format";
import { Assumptions } from "./parts/Assumptions";
import { EstimateSheet } from "./parts/EstimateSheet";
import { MiniSummary } from "./parts/MiniSummary";
import { PriceTable } from "./parts/PriceTable";
import { ProfilePicker } from "./parts/ProfilePicker";
import { UsageReadout } from "./parts/UsageReadout";
import styles from "./Simulator.module.scss";

export function Simulator({ city }: { city: CityData }) {
  return (
    <SimulatorProvider city={city}>
      <SimulatorSection />
    </SimulatorProvider>
  );
}

/**
 * Layout: the two questions first, side by side on desktop, then the whole
 * estimate at full width. Results read top down, most important first.
 */
function SimulatorSection() {
  const simulator = useSimulator();
  const { city, result, monthlyBill, coveragePercent } = simulator;

  return (
    <section id="simulator" aria-labelledby="simulator-title" className={styles.section}>
      <div className={styles.inner}>
        <header className={`${styles.intro} reveal`}>
          <h2 id="simulator-title">How much solar does your {city.city} home need?</h2>
          <p>
            Set your {city.utilityName} bill and how much of it solar should cover. The estimate
            updates as you move.
          </p>
        </header>

        <div className={styles.controls}>
          <MiniSummary result={result} />
          <div className={styles.home}>
            <ProfilePicker
              profiles={city.householdProfiles}
              selectedIndex={simulator.profileIndex}
              onSelect={simulator.selectProfile}
            />
            <UsageReadout />
          </div>
          <div className={styles.sliders}>
            <RangeField
              id="monthly-bill"
              label="Average monthly electric bill"
              value={monthlyBill}
              {...BILL_RANGE}
              display={formatUsd(monthlyBill)}
              spoken={`${monthlyBill} dollars per month`}
              minLabel={formatUsd(BILL_RANGE.min)}
              maxLabel={formatUsd(BILL_RANGE.max)}
              onChange={simulator.changeBill}
            />
            <RangeField
              id="coverage"
              label="Share of usage to cover"
              value={coveragePercent}
              {...COVERAGE_RANGE}
              display={`${coveragePercent}%`}
              spoken={`${coveragePercent} percent`}
              minLabel={`${COVERAGE_RANGE.min}%`}
              maxLabel={`${COVERAGE_RANGE.max}%`}
              onChange={simulator.changeCoverage}
            >
              {result.minimumApplied && (
                <p className={styles.hint}>
                  Lowering this will not change the estimate. The minimum of {city.minPanels}{" "}
                  panels already produces {formatPercent(result.systemCoverage)} of your usage.
                </p>
              )}
            </RangeField>
          </div>
        </div>

        <p className={styles.note}>{city.stateIncentiveNote}</p>

        <EstimateSheet />

        <Assumptions city={city} />

        <PriceTable city={city} />
      </div>
    </section>
  );
}
