import { Wordmark } from "@/components/brand/Wordmark";
import type { CityData } from "@/lib/city/schema";
import { SITE, toTelHref } from "@/lib/seo/site";
import styles from "./Footer.module.scss";

export function Footer({ city }: { city: CityData }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Wordmark />
          <p>{SITE.tagline}</p>
        </div>

        <div className={styles.column}>
          <h2>Where we install</h2>
          <ul>
            {city.popularNeighborhoods.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h2>Talk to a person</h2>
          <a href={toTelHref(city.phone)} className={styles.phone}>
            {city.phone}
          </a>
          <p>
            Serving {city.metroArea}, {city.stateFull}.
          </p>
        </div>

        <p className={styles.legal}>
          Estimates use {city.utilityName} rates and {city.city} sun hours. The site visit
          confirms the final design and price. Brightfield Solar is a fictional company created
          for a design and engineering exercise, and nothing on this page is an offer.
        </p>
      </div>
    </footer>
  );
}
