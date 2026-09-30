import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { SimplePage } from "@/components/layout/SimplePage";
import { listCities } from "@/lib/city/cities";
import { cityPath, SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Residential solar by city",
  description: `${SITE.name} installs residential solar in these cities. ${SITE.tagline}`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SimplePage title="Where we install">
      <ul>
        {listCities().map((city) => (
          <li key={city.slug}>
            <a href={cityPath(city.slug)}>
              {city.city}, {city.state}
              <ArrowRight size={22} weight="bold" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </SimplePage>
  );
}
