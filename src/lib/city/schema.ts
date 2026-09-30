import { z } from "zod";

export const BILL_RANGE = { min: 40, max: 600, step: 10 } as const;
export const COVERAGE_RANGE = { min: 50, max: 100, step: 5 } as const;

const crewSchema = z.object({
  name: z.string().min(1),
  installs: z.number().int().positive(),
  rating: z.number().min(1).max(5),
  since: z.number().int().min(1990),
  blurb: z.string().min(1),
  /** Optional. Without it the page shows the crew's initials. */
  photo: z
    .object({
      src: z.string().startsWith("/"),
      alt: z.string().min(1),
    })
    .optional(),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  neighborhood: z.string().min(1),
  date: z.iso.date(),
});

const householdProfileSchema = z.object({
  label: z.string().min(1),
  typicalBill: z.number().min(BILL_RANGE.min).max(BILL_RANGE.max),
});

const faqItemSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const citySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  city: z.string().min(1),
  state: z.string().length(2),
  stateFull: z.string().min(1),
  metroArea: z.string().min(1),
  utilityName: z.string().min(1),
  utilityRatePerKwh: z.number().positive(),
  peakSunHoursPerDay: z.number().min(1).max(9),
  panelWatts: z.number().positive(),
  performanceRatio: z.number().min(0.5).max(1),
  costPerWattInstalled: z.number().positive(),
  minPanels: z.number().int().min(1),
  federalCreditRate: z.number().min(0).max(1),
  stateIncentiveNote: z.string(),
  installsCompleted: z.number().int().positive(),
  crewsAvailable: z.number().int().positive(),
  avgRating: z.number().min(1).max(5),
  avgPermitDays: z.number().int().positive(),
  installDays: z.number().int().positive(),
  phone: z.string().min(7),
  popularNeighborhoods: z.array(z.string()).min(1),
  householdProfiles: z.array(householdProfileSchema).min(1),
  crews: z.array(crewSchema).min(1),
  testimonials: z.array(testimonialSchema).min(1),
  faq: z.array(faqItemSchema).min(1),
});

export type CityData = z.infer<typeof citySchema>;

/** The subset of city data the pure calculation needs. */
export type PricingInputs = Pick<
  CityData,
  | "utilityRatePerKwh"
  | "peakSunHoursPerDay"
  | "panelWatts"
  | "performanceRatio"
  | "costPerWattInstalled"
  | "minPanels"
  | "federalCreditRate"
>;
