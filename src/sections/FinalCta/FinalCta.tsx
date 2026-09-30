import duskPhoto from "@/assets/images/dusk-panels.jpg";
import { BookingLink, buttonClass } from "@/components/ui/Button";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { CityData } from "@/lib/city/schema";
import { toTelHref } from "@/lib/seo/site";
import styles from "./FinalCta.module.scss";

export function FinalCta({ city }: { city: CityData }) {
  return (
    <section id="final-cta" aria-labelledby="final-title" className={styles.section}>
      <ParallaxImage
        src={duskPhoto}
        alt=""
        sizes="100vw"
        strength={0.1}
        className={styles.backdrop}
      />
      <div className={styles.inner}>
        <h2 id="final-title" className="reveal">
          Confirm the numbers on your own roof.
        </h2>
        <p className="reveal">
          A {city.city} crew measures your roof and confirms the panel count from your estimate.
          City permits average {city.avgPermitDays} days.
        </p>
        <div className={`${styles.actions} reveal`}>
          <BookingLink citySlug={city.slug} location="final">
            Request a site visit
          </BookingLink>
          <a href={toTelHref(city.phone)} className={buttonClass({ variant: "onNight" })}>
            Call {city.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
