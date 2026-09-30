import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "onNight";

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  compact?: boolean;
  block?: boolean;
  className?: string;
};

/** Class list for anything that should look like a button (links included). */
export function buttonClass({
  variant = "primary",
  compact = false,
  block = false,
  className = "",
}: ButtonStyleProps = {}): string {
  return [
    styles.button,
    styles[variant],
    compact && styles.compact,
    block && styles.block,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
