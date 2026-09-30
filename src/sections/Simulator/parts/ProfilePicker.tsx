import type { CityData } from "@/lib/city/schema";
import { formatUsd } from "@/lib/format";
import styles from "./ProfilePicker.module.scss";

type ProfilePickerProps = {
  profiles: CityData["householdProfiles"];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

/** Shortcuts that fill in a typical bill. The person can adjust after picking. */
export function ProfilePicker({ profiles, selectedIndex, onSelect }: ProfilePickerProps) {
  return (
    <fieldset className={styles.picker}>
      <legend>Start from the home closest to yours</legend>
      <ul>
        {profiles.map((profile, index) => (
          <li key={profile.label}>
            <button
              type="button"
              aria-pressed={index === selectedIndex}
              onClick={() => onSelect(index)}
              className={styles.option}
            >
              <span>{profile.label}</span>
              <span className={styles.bill}>{formatUsd(profile.typicalBill)}</span>
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
