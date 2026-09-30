import styles from "./Wordmark.module.scss";

/** Half-disc sun on a horizon line, followed by the name. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.wordmark} ${className}`}>
      <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
        <path d="M4 15a11 11 0 0 1 22 0Z" className={styles.sun} />
        <rect x="0" y="17" width="30" height="3" className={styles.horizon} />
      </svg>
      Brightfield
    </span>
  );
}
