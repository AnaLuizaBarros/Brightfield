import type { CSSProperties } from "react";
import heroPhoto from "@/assets/images/hero-install.jpg";
import { AnchorLink, buttonClass } from "@/components/ui/Button";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { CityData } from "@/lib/city/schema";
import { toTelHref } from "@/lib/seo/site";
import styles from "./Hero.module.scss";
import { TrustStrip } from "./TrustStrip";

/** Position in the page-load entrance sequence. */
const step = (index: number) => ({ "--i": index }) as CSSProperties;

export function Hero({ city }: { city: CityData }) {
  const creditPct = Math.round(city.federalCreditRate * 100);

  return (
    <section id="hero" className={styles.hero}>
      <ParallaxImage
        src={heroPhoto}
        alt="An installer in safety glasses and gloves sets a solar panel above the clay tiles of a stucco home"
        sizes="100vw"
        strength={0.06}
        priority
        className={styles.photo}
      />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={`${styles.tag} enter`} style={step(0)}>
            {city.city}, {city.stateFull}
          </p>
          <h1 className={`${styles.title} enter`} style={step(1)}>
            Solar for {city.city} homes, priced to the panel.
          </h1>
          <p className={`${styles.lead} enter`} style={step(2)}>
            See your panel count, your price after the {creditPct}% federal credit and your
            payback time, with the math shown.
          </p>
          <div className={`${styles.actions} enter`} style={step(3)}>
            <AnchorLink targetId="simulator" location="hero">
              See my savings
            </AnchorLink>
            <a href={toTelHref(city.phone)} className={buttonClass({ variant: "onNight" })}>
              Call {city.phone}
            </a>
          </div>
        </div>

        <div className={`${styles.trust} enter`} style={step(4)}>
          <TrustStrip city={city} />
        </div>
      </div>
    </section>
  );
}
