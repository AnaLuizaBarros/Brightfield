/**
 * Campaign attribution without a back-end.
 *
 * Campaign parameters are stored once per browser session (first touch wins)
 * and attached to every event and to the booking link, so the campaign owner
 * can tell which ad produced which simulation.
 */

import { DEFAULT_SCENARIO } from "@/lib/solar/defaults";

const STORAGE_KEY = "bf_attribution";
const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export type Attribution = Partial<Record<(typeof CAMPAIGN_PARAMS)[number], string>>;
export type EventProps = Record<string, string | number | boolean | undefined>;

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  plausible?: (name: string, options: { props: EventProps }) => void;
};

let context: { city?: string } = {};

export function setTrackingContext(next: { city: string }) {
  context = { ...context, ...next };
}

function readStorage(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function writeStorage(value: Attribution) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be blocked. Attribution then lives only for this page view.
  }
}

let inMemory: Attribution = {};

/** Captures campaign params from the URL if this session has none yet. */
export function captureAttribution(search: string = window.location.search) {
  const stored = readStorage();
  if (stored && Object.keys(stored).length > 0) {
    inMemory = stored;
    return stored;
  }
  const params = new URLSearchParams(search);
  const found: Attribution = {};
  for (const key of CAMPAIGN_PARAMS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  inMemory = found;
  writeStorage(found);
  return found;
}

export const getAttribution = (): Attribution => inMemory;

export function track(name: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  const payload: EventProps = { ...getAttribution(), ...context, ...props };

  if (process.env.NODE_ENV !== "production") {
    console.debug(`[track] ${name}`, payload);
  }

  const w = window as TrackingWindow;
  w.dataLayer?.push({ event: name, ...payload });
  w.plausible?.(name, { props: payload });
  window.dispatchEvent(new CustomEvent("bf:track", { detail: { name, payload } }));
}

export type Scenario = { monthlyBill: number; coveragePercent: number };

let lastScenario: Scenario = {
  monthlyBill: DEFAULT_SCENARIO.monthlyBill,
  coveragePercent: Math.round(DEFAULT_SCENARIO.coverage * 100),
};

/** The simulator publishes its state here so any CTA can carry it. */
export const setLastScenario = (scenario: Scenario) => {
  lastScenario = scenario;
};
export const getLastScenario = (): Scenario => lastScenario;

type BookingLinkInput = {
  citySlug: string;
  monthlyBill: number;
  coveragePercent: number;
};

/** The visit request arrives carrying the ad and the number that convinced. */
export function buildBookingHref({
  citySlug,
  monthlyBill,
  coveragePercent,
}: BookingLinkInput): string {
  const params = new URLSearchParams({
    city: citySlug,
    bill: String(monthlyBill),
    coverage: String(coveragePercent),
  });
  for (const [key, value] of Object.entries(getAttribution())) {
    if (value) params.set(key, value);
  }
  return `/schedule?${params.toString()}`;
}
