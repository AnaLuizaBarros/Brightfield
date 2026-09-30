import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { citySchema, type CityData } from "./schema";

const CITIES_DIR = path.join(process.cwd(), "data", "cities");

function parseCityFile(fileName: string): CityData {
  const raw = JSON.parse(readFileSync(path.join(CITIES_DIR, fileName), "utf8"));
  const parsed = citySchema.safeParse(raw);
  if (!parsed.success) {
    // A bad data file must fail the build and say which field is wrong.
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid city data in ${fileName}\n${issues}`);
  }
  return parsed.data;
}

const loadAllCities = cache((): CityData[] =>
  readdirSync(CITIES_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .map(parseCityFile),
);

export const listCities = () => loadAllCities();

export const listCitySlugs = () => loadAllCities().map((city) => city.slug);

export const getCity = (slug: string): CityData | undefined =>
  loadAllCities().find((city) => city.slug === slug);
