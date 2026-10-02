import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CityPage, cityMetadata } from "@/features/city-page";
import { getCity, homeCity, listCitySlugs } from "@/lib/city/cities";

type PageProps = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  return city ? cityMetadata(city) : {};
}

export default async function CityRoute({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  // The home city lives at the site root, so its own slug points there.
  if (city.slug === homeCity().slug) permanentRedirect("/");
  return <CityPage city={city} />;
}
