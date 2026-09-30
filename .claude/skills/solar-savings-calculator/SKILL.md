---
name: solar-savings-calculator
description: Implements the Brightfield Solar savings simulator as a pure, tested function. Use when writing or changing the calculation, the simulator UI copy for edge cases (minimum panels, bill cap), or its tests.
---

# Solar savings calculator

## Contract
One pure function, no React, no I/O, in `src/lib/solar/calc.ts`:

```ts
calculate(input: { monthlyBill: number; coverage: number }, city: CityData): Result
```

Every constant comes from `CityData`. Never hardcode 0.15, 6.5, 450, 2.75, 8 or 0.3.

## Order of operations (do not reorder)
1. `monthlyKwh = bill / utilityRatePerKwh`
2. `targetKwh = monthlyKwh * coverage`
3. `kwhPerPanel = (panelWatts / 1000) * peakSunHoursPerDay * 30 * performanceRatio`
4. `rawPanels = targetKwh / kwhPerPanel`
5. `panels = max(ceil(rawPanels), minPanels)`  (ceil first, then the minimum)
6. `grossCost = panels * panelWatts * costPerWattInstalled`
7. `netCost = grossCost * (1 - federalCreditRate)`
8. `generationKwh = panels * kwhPerPanel`
9. `generationValue = generationKwh * utilityRatePerKwh`
10. `monthlySavings = min(generationValue, bill)`
11. `paybackYears = netCost / (monthlySavings * 12)`

Derive everything from the panel count in step 5, not from `rawPanels`. Round only for display.

## Flags the UI must explain
Return booleans, not strings. The UI owns the wording.
- `minimumApplied`: `ceil(rawPanels) < minPanels`. Show requested vs installed panels and why.
- `savingsCapped`: `generationValue > bill`. Show the uncapped value, the cap, and that the excess is credit and never cash.
- Coverage note (no separate flag): shown next to the slider whenever `minimumApplied` is true, because lowering coverage cannot change the result. Use `systemCoverage` (generation ÷ usage) to say how much of their usage the minimum system already covers, for example "94%" or "140%".

## Fixture (Phoenix, must pass exactly)
| bill | coverage | panels | net cost | savings/mo | payback | flags |
|---|---|---|---|---|---|---|
| 220 | 0.80 | 17 | 14726.25 | 179.01 | 6.9 | none |
| 430 | 0.80 | 33 | 28586.25 | 347.49 | 6.9 | none |
| 430 | 1.00 | 41 | 35516.25 | 430.00 | 6.9 | savingsCapped (uncapped 431.73) |
| 90 | 0.80 | 8 | 6930.00 | 84.24 | 6.9 | minimumApplied (raw 7) |
| 60 | 0.80 | 8 | 6930.00 | 60.00 | 9.6 | minimumApplied, savingsCapped |
| 60 | 0.50 | 8 | 6930.00 | 60.00 | 9.6 | minimumApplied, savingsCapped (coverage note shown) |

Floating point: compare with `toBeCloseTo(x, 2)`. Watch `ceil(16.7000000001)`; round `rawPanels` to 6 decimals before `ceil`.

## Inputs
- Bill: 40 to 600, step 10. Coverage: 50 to 100, step 5. Clamp and snap in the setter, never trust the DOM.
- A profile is a full starting point: it sets the bill and returns coverage to the default 80%. Verified against the brief's row 4, where an apartment picked after 100% coverage would otherwise need 9 panels, not 8. The person can still move both sliders afterwards.

## Tests
Vitest, one file, the six rows above plus: bill 40/coverage 50 (smallest), bill 600/coverage 100 (largest), and a second city fixture with different numbers to prove nothing is hardcoded.
