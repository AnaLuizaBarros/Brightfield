import { TrackingContext } from "@/components/analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";
import { resolveFaq } from "@/lib/city/faq";
import type { CityData } from "@/lib/city/schema";
import { buildStructuredData, serializeJsonLd } from "@/lib/seo/structured-data";
import { Faq } from "@/sections/Faq";
import { FinalCta } from "@/sections/FinalCta";
import { Hero } from "@/sections/Hero";
import { Simulator } from "@/sections/Simulator";
import { SocialProof } from "@/sections/SocialProof";
import { Steps } from "@/sections/Steps";

/** The six sections of a city page, in the order the brief gives them. */
export function CityPage({ city }: { city: CityData }) {
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
