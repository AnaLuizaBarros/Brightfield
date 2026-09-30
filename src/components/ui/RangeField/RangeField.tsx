import type { CSSProperties, ReactNode } from "react";
import styles from "./RangeField.module.scss";

type RangeFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** The value as shown on screen, for example "$220". */
  display: string;
  /** The value as read aloud, for example "220 dollars per month". */
  spoken: string;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
  children?: ReactNode;
};

export function RangeField({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  spoken,
  minLabel,
  maxLabel,
  onChange,
  children,
}: RangeFieldProps) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        type="range"
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={spoken}
        style={{ "--fill": `${fill}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className={styles.scale} aria-hidden="true">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {children}
    </div>
  );
}
