import { z } from "zod";
import { BILL_RANGE, COVERAGE_RANGE } from "@/lib/city/schema";

export const TIME_WINDOWS = [
  { value: "morning", label: "Morning, 8 to 11" },
  { value: "midday", label: "Midday, 11 to 2" },
  { value: "afternoon", label: "Afternoon, 2 to 5" },
] as const;

export type TimeWindow = (typeof TIME_WINDOWS)[number]["value"];

const timeWindowValues = TIME_WINDOWS.map((w) => w.value) as [TimeWindow, ...TimeWindow[]];

/** A US phone number: ten digits once the punctuation is gone. */
const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(z.string().regex(/^1?\d{10}$/, "Enter a phone number with area code, like (602) 555-0147."));

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your name so the crew knows who to ask for."),
  phone,
  neighborhood: z.string().trim().min(1, "Tell us the neighborhood so we send the nearest crew."),
  timeWindow: z.enum(timeWindowValues, { message: "Pick the time of day that suits you." }),
  notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional(),

  // Carried from the estimate and the campaign, never typed by the person.
  city: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  bill: z.coerce.number().min(BILL_RANGE.min).max(BILL_RANGE.max),
  coverage: z.coerce.number().min(COVERAGE_RANGE.min).max(COVERAGE_RANGE.max),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  gclid: z.string().max(200).optional(),
  fbclid: z.string().max(200).optional(),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type Booking = z.output<typeof bookingSchema>;

/** Fields the person fills in, in the order they appear on the form. */
export const PERSON_FIELDS = ["name", "phone", "neighborhood", "timeWindow", "notes"] as const;
export type PersonField = (typeof PERSON_FIELDS)[number];

export type BookingFormState =
  | { status: "idle" }
  | { status: "error"; errors: Partial<Record<PersonField, string>>; values: Record<string, string> }
  | { status: "success"; reference: string; booking: Booking };
