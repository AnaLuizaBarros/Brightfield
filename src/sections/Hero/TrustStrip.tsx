import { Star } from "@phosphor-icons/react/dist/ssr";
import type { CityData } from "@/lib/city/schema";
import { formatInt } from "@/lib/format";
import styles from "./TrustStrip.module.scss";

/** The city's track record, from its data file, along the foot of the hero. */
export function TrustStrip({ city }: { city: CityData }) {
  return (
    <dl className={styles.strip}>
      <div>
        <dt>average customer rating</dt>
        <dd>
          {city.avgRating.toFixed(1)}
          <Star size={22} weight="fill" aria-hidden="true" />
        </dd>
      </div>
      <div>
        <dt>homes installed in {city.metroArea}</dt>
        <dd>{formatInt(city.installsCompleted)}</dd>
      </div>
      <div>
        <dt>crews based in {city.city}</dt>
        <dd>{city.crewsAvailable}</dd>
      </div>
      <div>
        <dt>average city permit</dt>
        <dd>
          {city.avgPermitDays}
          <small>days</small>
        </dd>
      </div>
    </dl>
  );
}
