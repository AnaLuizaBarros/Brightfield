import { Info } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import styles from "./Notice.module.scss";

/** Explains a number that differs from what the person asked for. */
export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="note" className={styles.notice}>
      <Info size={20} weight="bold" aria-hidden="true" className={styles.icon} />
      <p>
        <strong>{title}</strong> {children}
      </p>
    </div>
  );
}
