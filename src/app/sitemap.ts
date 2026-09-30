import type { MetadataRoute } from "next";
import { listCities } from "@/lib/city/cities";
import { cityUrl, SITE } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "monthly", priority: 0.5 },
    ...listCities().map((city) => ({
      url: cityUrl(city.slug),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
