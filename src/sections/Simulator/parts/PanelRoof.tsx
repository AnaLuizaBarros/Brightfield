import type { CSSProperties } from "react";
import styles from "./PanelRoof.module.scss";

type PanelRoofProps = {
  /** Panels that will be installed. */
  panels: number;
  /** Panels the person's numbers asked for, rounded up. */
  requested: number;
  systemKw: number;
};

/** Columns that keep each cell close to a real panel's proportions. */
const columnsFor = (panels: number) => Math.ceil(Math.sqrt(panels * 2));

/**
 * The array drawn panel by panel. When the city minimum adds panels, the
 * added ones are drawn differently, so the person sees what changed.
 */
export function PanelRoof({ panels, requested, systemKw }: PanelRoofProps) {
  const added = Math.max(0, panels - requested);
  const description =
    added > 0
      ? `${panels} panels: ${requested} from your numbers plus ${added} added to reach the minimum.`
      : `${panels} panels.`;

  return (
    <figure className={styles.roof}>
      <div
        className={styles.grid}
        style={{ "--columns": columnsFor(panels) } as CSSProperties}
        role="img"
        aria-label={description}
      >
        {Array.from({ length: panels }, (_, index) => (
          <span key={index} data-added={index >= requested} />
        ))}
      </div>
      <figcaption>
        <span>
          <b>{panels}</b> panels
        </span>
        <span>
          <b>{systemKw.toFixed(2)}</b> kW system
        </span>
        {added > 0 && (
          <span className={styles.key}>
            <i aria-hidden="true" />
            {added} added by the minimum
          </span>
        )}
      </figcaption>
    </figure>
  );
}
