import type { SimulatorInput } from "./calc";

/**
 * Starting point of the simulator and the scenario quoted in the FAQ.
 * It reproduces the first row of the brief's example table.
 */
export const DEFAULT_SCENARIO: SimulatorInput = {
  monthlyBill: 220,
  coverage: 0.8,
};
