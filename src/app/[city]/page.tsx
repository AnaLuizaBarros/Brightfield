import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackingContext } from "@/components/analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";
import { getCity, listCitySlugs } from "@/lib/city/cities";
import { resolveFaq } from "@/lib/city/faq";
import { formatInt, formatUsd } from "@/lib/format";
import { cityPath, SITE } from "@/lib/seo/site";
import { buildStructuredData, serializeJsonLd } from "@/lib/seo/structured-data";
import { calculate } from "@/lib/solar/calc";
import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";
import { Faq } from "@/sections/Faq";
import { FinalCta } from "@/sections/FinalCta";
import { Hero } from "@/sections/Hero";
import { Simulator } from "@/sections/Simulator";
import { SocialProof } from "@/sections/SocialProof";
import { Steps } from "@/sections/Steps";

type PageProps = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};

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
    robots: { index: true, follow: true },
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

export default async function CityPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const faq = resolveFaq(city);
  const structuredData = buildStructuredData(city, faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <TrackingContext city={city.slug} />
      <Header city={city} />
      <main id="main">
        <Hero city={city} />
        <Simulator city={city} />
        <Steps city={city} />
        <SocialProof city={city} />
        <Faq city={city} items={faq} />
        <FinalCta city={city} />
      </main>
      <Footer city={city} />
      <StickyCta citySlug={city.slug} phone={city.phone} />
    </>
  );
}
