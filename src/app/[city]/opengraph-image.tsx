import { getCity, homeCity, listCitySlugs } from "@/lib/city/cities";
import { renderCityOgImage } from "@/lib/seo/og-image";
import { SITE } from "@/lib/seo/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The home city's preview is served from the site root.
export function generateStaticParams() {
  return listCitySlugs()
    .filter((slug) => slug !== homeCity().slug)
    .map((city) => ({ city }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return new Response("Not found", { status: 404 });
  return renderCityOgImage(city);
}
