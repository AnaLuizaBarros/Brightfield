import { Phone } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/brand/Wordmark";
import { BookingLink } from "@/components/ui/Button";
import type { CityData } from "@/lib/city/schema";
import { toTelHref } from "@/lib/seo/site";
import styles from "./Header.module.scss";

export function Header({ city }: { city: CityData }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.home} aria-label="Brightfield Solar home">
          <Wordmark />
        </a>
        <div className={styles.actions}>
          <a href={toTelHref(city.phone)} className={styles.phone}>
            <Phone size={18} weight="bold" aria-hidden="true" />
            {city.phone}
          </a>
          <div className={styles.cta}>
            <BookingLink citySlug={city.slug} location="header" variant="onNight" compact>
              Request a site visit
            </BookingLink>
          </div>
        </div>
      </div>
    </header>
  );
}
