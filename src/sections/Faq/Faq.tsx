import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { CityData } from "@/lib/city/schema";
import type { ResolvedFaqItem } from "@/lib/city/faq";
import { toTelHref } from "@/lib/seo/site";
import styles from "./Faq.module.scss";

type FaqProps = { city: CityData; items: ResolvedFaqItem[] };

/** Answers stay in the HTML (native details) so crawlers and assistants can read them. */
export function Faq({ city, items }: FaqProps) {
  return (
    <section aria-labelledby="faq-title" className={styles.section}>
      <header className={`${styles.intro} reveal`}>
        <h2 id="faq-title">Solar in {city.city}, answered</h2>
        <p>
          Something we did not cover? Call{" "}
          <a href={toTelHref(city.phone)}>{city.phone}</a> and talk to the {city.city} team.
        </p>
      </header>

      <div className={styles.list}>
        {items.map((item, index) => (
          <details key={item.q} open={index === 0}>
            <summary>
              <h3>{item.q}</h3>
              <Plus size={20} weight="bold" aria-hidden="true" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
