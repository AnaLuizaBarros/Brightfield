import valleyPhoto from "@/assets/images/valley.jpg";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { CityData } from "@/lib/city/schema";
import { CrewRoster } from "./CrewRoster";
import styles from "./SocialProof.module.scss";
import { Testimonials } from "./Testimonials";

const joinList = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export function SocialProof({ city }: { city: CityData }) {
  return (
    <section aria-labelledby="proof-title" className={styles.section}>
      <div className={styles.inner}>
        <header className={`${styles.intro} reveal`}>
          <p className={styles.tag}>{city.city} crews</p>
          <h2 id="proof-title">The people who will be on your roof</h2>
          <p>
            We install in {joinList(city.popularNeighborhoods)}, and across {city.metroArea}.
          </p>
        </header>

        <CrewRoster crews={city.crews} />

        <ParallaxImage
          src={valleyPhoto}
          alt={`Homes across the ${city.city} valley at the foot of a desert mountain, in late light`}
          sizes="(min-width: 80rem) 78rem, 100vw"
          strength={0.06}
          className={styles.photo}
        />

        <Testimonials city={city.city} testimonials={city.testimonials} />
      </div>
    </section>
  );
}
