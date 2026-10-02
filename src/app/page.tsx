import type { Metadata } from "next";
import { CityPage, cityMetadata } from "@/features/city-page";
import { homeCity } from "@/lib/city/cities";

export const generateMetadata = (): Metadata => cityMetadata(homeCity());

/** The site root is the home city's page; other cities live at /<slug>. */
export default function HomePage() {
  return <CityPage city={homeCity()} />;
}
