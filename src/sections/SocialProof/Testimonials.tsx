import type { CityData } from "@/lib/city/schema";
import { formatDate } from "@/lib/format";
import styles from "./Testimonials.module.scss";

type TestimonialsProps = {
  city: string;
  testimonials: CityData["testimonials"];
};

/** The quote that mentions seeing the math leads, since that is the promise. */
const leadIndex = (testimonials: CityData["testimonials"]) => {
  const index = testimonials.findIndex(({ quote }) => /\bmath\b/i.test(quote));
  return index === -1 ? 0 : index;
};

export function Testimonials({ city, testimonials }: TestimonialsProps) {
  const lead = leadIndex(testimonials);
  const ordered = [testimonials[lead], ...testimonials.filter((_, index) => index !== lead)];

  return (
    <div className={styles.testimonials}>
      <h3 className="visually-hidden">What {city} customers say</h3>
      {ordered.map(
        (item) =>
          item && (
            <figure key={item.author} className="reveal">
              <blockquote>
                <p>“{item.quote}”</p>
              </blockquote>
              <figcaption>
                <b>{item.author}</b>
                <span>
                  {item.neighborhood}, {city}
                </span>
                <time dateTime={item.date}>{formatDate(item.date)}</time>
              </figcaption>
            </figure>
          ),
      )}
    </div>
  );
}
