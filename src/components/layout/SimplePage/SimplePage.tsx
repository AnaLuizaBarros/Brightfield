import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import styles from "./SimplePage.module.scss";

type SimplePageProps = { title: string; children: ReactNode };

/** Plain single-column page for the index, the schedule stub and the 404. */
export function SimplePage({ title, children }: SimplePageProps) {
  return (
    <main id="main" className={styles.page}>
      <a href="/" aria-label="Brightfield Solar home" className={styles.home}>
        <Wordmark />
      </a>
      <h1>{title}</h1>
      {children}
    </main>
  );
}
