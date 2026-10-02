import type { CityData } from "@/lib/city/schema";
import type { ResolvedFaqItem } from "@/lib/city/faq";
import { cityPath, cityUrl } from "@/lib/city/paths";
import { SITE } from "./site";

type JsonLd = Record<string, unknown>;

/**
 * Only facts visible on the page are marked up. The data file has no review
 * count, so no `aggregateRating` is emitted: Google requires a count and
 * inventing one would be a false claim.
 */
export function buildStructuredData(
  city: CityData,
  faq: ResolvedFaqItem[],
): JsonLd[] {
  const url = cityUrl(city.slug);

  const business: JsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${url}#business`,
    name: SITE.name,
    description: `Residential solar installation in ${city.city}, ${city.stateFull}.`,
    url,
    telephone: city.phone,
    areaServed: [
      { "@type": "City", name: city.city },
      ...city.popularNeighborhoods.map((name) => ({
        "@type": "Place",
        name: `${name}, ${city.city}`,
      })),
    ],
  };

  const faqPage: JsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbs: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: `Solar in ${city.city}, ${city.state}`,
        item: url,
      },
    ],
  };

  // A trail of one is noise: skip it when the city is the site root.
  return cityPath(city.slug) === "/" ? [business, faqPage] : [business, faqPage, breadcrumbs];
}

/** Escapes `<` so a value can never close the script tag. */
export const serializeJsonLd = (data: JsonLd[]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
