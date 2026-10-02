import type { Metadata } from "next";
import { cityPath } from "@/lib/city/paths";
import type { CityData } from "@/lib/city/schema";
import { formatInt, formatUsd } from "@/lib/format";
import { SITE } from "@/lib/seo/site";
import { calculate } from "@/lib/solar/calc";
import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";

export function cityMetadata(city: CityData): Metadata {
  const title = `Solar Panels in ${city.city}, ${city.state}`;
  const result = calculate(DEFAULT_SCENARIO, city);
  const description =
    `Estimate panels, cost and payback for your ${city.utilityName} bill. ` +
    `A ${formatUsd(DEFAULT_SCENARIO.monthlyBill)} bill needs about ${result.panels} panels. ` +
    `${formatInt(city.installsCompleted)} installs, ${city.avgRating.toFixed(1)} rating, ` +
    `${city.avgPermitDays}-day average permits.`;

  return {
    title,
    description,
    alternates: { canonical: cityPath(city.slug) },
    robots: { index: SITE.indexable, follow: SITE.indexable },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      url: cityPath(city.slug),
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE.name}`, description },
  };
}
