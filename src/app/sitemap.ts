import type { MetadataRoute } from "next";
import { listCities } from "@/lib/city/cities";
import { cityUrl } from "@/lib/city/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  return listCities().map((city) => ({
    url: cityUrl(city.slug),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));
}
