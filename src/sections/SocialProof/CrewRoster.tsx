import { Star } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { CityData } from "@/lib/city/schema";
import { formatInt } from "@/lib/format";
import styles from "./CrewRoster.module.scss";

type Crew = CityData["crews"][number];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => /^[A-Z]/.test(word) && word !== "The")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

/** The crew's photo from the data file, or its initials when there is none. */
function CrewPicture({ crew }: { crew: Crew }) {
  if (!crew.photo) {
    return (
      <span className={styles.badge} aria-hidden="true">
        {initials(crew.name)}
      </span>
    );
  }
  return (
    <div className={styles.photo}>
      <Image
        src={crew.photo.src}
        alt={crew.photo.alt}
        fill
        sizes="(min-width: 64rem) 18rem, 100vw"
      />
    </div>
  );
}

/** The city's crews as a roster: who they are, what they are good at, their record. */
export function CrewRoster({ crews }: { crews: CityData["crews"] }) {
  return (
    <ul className={styles.roster}>
      {crews.map((crew) => (
        <li key={crew.name} className="reveal">
          <CrewPicture crew={crew} />

          <div className={styles.who}>
            <h3>{crew.name}</h3>
            <p className={styles.since}>Installing since {crew.since}</p>
            <p>{crew.blurb}</p>
          </div>

          <dl className={styles.record}>
            <div>
              <dt>Installs</dt>
              <dd>{formatInt(crew.installs)}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>
                {crew.rating.toFixed(1)}
                <Star size={18} weight="fill" aria-hidden="true" />
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
