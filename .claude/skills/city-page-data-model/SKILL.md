---
name: city-page-data-model
description: Defines the city data schema, validation and Next.js App Router wiring so about 120 city pages come from one template. Use when adding a city, changing the data shape, or touching routing and static generation.
---

# City page data model

## Rule
Swapping `phoenix-az.json` for another city file must produce that city's page with zero code changes. Any string, number or list that differs between cities lives in the data file. Templates hold only structure and city-independent copy.

## Layout
```
data/cities/phoenix-az.json
src/lib/city/schema.ts        zod schema, exported CityData type
src/lib/city/cities.ts        getCity(slug), listCities(), listCitySlugs(), homeCity()
src/lib/city/faq.ts           fills the {{tokens}} in FAQ answers
src/lib/solar/calc.ts         calculate(), pure
src/lib/seo/                  site constants, structured data
src/lib/analytics/tracking.ts attribution and events
src/app/page.tsx              the home city (first data file by name) at the site root
src/app/[city]/page.tsx       every other city; the home slug redirects to /
src/features/city-page/       CityPage (six sections) and cityMetadata, shared by both routes
src/lib/city/paths.ts         cityPath(slug), cityUrl(slug): "/" for the home city
src/sections/<Name>/          page sections, each receives `city` as a prop
src/components/<group>/<Name>/ shared pieces (ui, layout, brand, analytics)
```

## Schema (zod)
- Numbers with bounds: `utilityRatePerKwh > 0`, `peakSunHoursPerDay` 1 to 9, `performanceRatio` 0.5 to 1, `federalCreditRate` 0 to 1, `minPanels >= 1`.
- `householdProfiles` non-empty; each `typicalBill` must sit inside the simulator range (40 to 600, step 10) or be snapped by the loader.
- `faq[].a` may contain the city's numbers. Do not store computed values that go stale. Keep FAQ answers as templates with tokens (`{{panels}}`, `{{netCost}}`) filled by `calculate()` at build time, so FAQ, simulator and JSON-LD can never disagree. The sample FAQ in the brief hardcodes 17 panels and $14,726; check them against the calculator in a test.
- `stateIncentiveNote` is display only and never reaches `calculate()`.

## Build-time validation
Parse every file in `data/cities` in `generateStaticParams`. A bad file fails the build with the file name and the field path. Never fall back silently.

## Next.js notes
- App Router, `params` is a Promise in current versions: `const { city } = await params`.
- `dynamicParams = false` so unknown slugs 404 instead of rendering empty.
- Server component for the page; only the simulator is `"use client"`. Pass it the numeric constants, not the whole file.
- `generateMetadata` reads the same file, see `city-page-seo-geo`.

## Adding a city
Copy the JSON, change values, run the validator. Do a real copy read on the FAQ and testimonials. Do not reuse another city's neighborhoods or utility name.
