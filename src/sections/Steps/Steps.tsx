import roofPhoto from "@/assets/images/steps-tile-roof.jpg";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { CityData } from "@/lib/city/schema";
import styles from "./Steps.module.scss";

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

export function Steps({ city }: { city: CityData }) {
  const steps = [
    {
      title: "A crew checks your roof",
      body: `A ${city.city} crew measures the roof and confirms the panel count from your estimate.`,
      duration: "1 visit",
    },
    {
      title: "We file the permit",
      body: "We handle the paperwork with the city and tell you the timeline up front.",
      duration: `${plural(city.avgPermitDays, "day")} on average`,
    },
    {
      title: "The panels go up",
      body: `The crew installs and photographs the work, then ${city.utilityName} connects the system to the grid.`,
      duration: plural(city.installDays, "day"),
    },
  ];

  return (
    <section aria-labelledby="steps-title" className={styles.section}>
      <ParallaxImage
        src={roofPhoto}
        alt="Gloved hands fix a mounting rail and cables onto a clay tile roof"
        sizes="(min-width: 64rem) 42vw, 100vw"
        className={styles.photo}
      />

      <div className={styles.content}>
        <h2 id="steps-title" className="reveal">
          Three steps from estimate to power
        </h2>
        <ol className={styles.list}>
          {steps.map((step, index) => (
            <li key={step.title} className="reveal">
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <p className={styles.duration}>{step.duration}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
