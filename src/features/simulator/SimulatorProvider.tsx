"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { setLastScenario, track } from "@/lib/analytics/tracking";
import { BILL_RANGE, COVERAGE_RANGE, type CityData } from "@/lib/city/schema";
import { calculate, type SimulatorResult } from "@/lib/solar/calc";
import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";

/** Wait for the last slider movement before reporting a result. */
const RESULT_EVENT_DELAY_MS = 800;
const DEFAULT_COVERAGE_PERCENT = Math.round(DEFAULT_SCENARIO.coverage * 100);

export type SimulatorState = {
  city: CityData;
  monthlyBill: number;
  coveragePercent: number;
  profileIndex: number | null;
  result: SimulatorResult;
  changeBill: (value: number) => void;
  changeCoverage: (value: number) => void;
  selectProfile: (index: number) => void;
};

type Range = { min: number; max: number; step: number };

const snap = (value: number, { min, max, step }: Range) => {
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round((clamped - min) / step) * step + min;
};

const findProfileIndex = (city: CityData, bill: number) => {
  const index = city.householdProfiles.findIndex((p) => p.typicalBill === bill);
  return index === -1 ? null : index;
};

const SimulatorContext = createContext<SimulatorState | null>(null);

type SimulatorProviderProps = { city: CityData; children: ReactNode };

/** The simulator's state, shared by its controls, its sheet and its phone summary. */
export function SimulatorProvider({ city, children }: SimulatorProviderProps) {
  const [monthlyBill, setMonthlyBill] = useState(DEFAULT_SCENARIO.monthlyBill);
  const [coveragePercent, setCoveragePercent] = useState(DEFAULT_COVERAGE_PERCENT);

  const result = useMemo(
    () => calculate({ monthlyBill, coverage: coveragePercent / 100 }, city),
    [monthlyBill, coveragePercent, city],
  );

  const started = useRef(false);
  const reportStart = (source: string) => {
    if (started.current) return;
    started.current = true;
    track("sim_started", { source });
  };

  const changeBill = (value: number) => {
    reportStart("bill");
    setMonthlyBill(snap(value, BILL_RANGE));
  };

  const changeCoverage = (value: number) => {
    reportStart("coverage");
    setCoveragePercent(snap(value, COVERAGE_RANGE));
  };

  /**
   * A profile is a starting point: it sets the bill and returns coverage to
   * the default. The brief's example needs this, since an apartment picked at
   * 100% coverage would need 9 panels, not the 8 the example shows.
   */
  const selectProfile = (index: number) => {
    const profile = city.householdProfiles[index];
    if (!profile) return;
    reportStart("profile");
    setMonthlyBill(snap(profile.typicalBill, BILL_RANGE));
    setCoveragePercent(DEFAULT_COVERAGE_PERCENT);
    track("profile_selected", { profile: profile.label });
  };

  // Publish the scenario for every call to action, and report settled results.
  const firstRender = useRef(true);
  useEffect(() => {
    setLastScenario({ monthlyBill, coveragePercent });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      track("sim_result", {
        bill: monthlyBill,
        coverage: coveragePercent,
        panels: result.panels,
        netCost: Math.round(result.netCost),
        monthlySavings: Math.round(result.monthlySavings * 100) / 100,
        paybackYears: Math.round(result.paybackYears * 10) / 10,
        minimumApplied: result.minimumApplied,
        savingsCapped: result.savingsCapped,
      });
    }, RESULT_EVENT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [monthlyBill, coveragePercent, result]);

  const state: SimulatorState = {
    city,
    monthlyBill,
    coveragePercent,
    // A profile reads as selected whenever the bill matches it.
    profileIndex: findProfileIndex(city, monthlyBill),
    result,
    changeBill,
    changeCoverage,
    selectProfile,
  };

  return <SimulatorContext.Provider value={state}>{children}</SimulatorContext.Provider>;
}

export function useSimulator(): SimulatorState {
  const state = useContext(SimulatorContext);
  if (!state) throw new Error("useSimulator must be used inside <SimulatorProvider>");
  return state;
}
