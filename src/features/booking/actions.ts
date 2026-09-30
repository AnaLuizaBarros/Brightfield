"use server";

import { getCity } from "@/lib/city/cities";
import { calculate } from "@/lib/solar/calc";
import { bookingSchema, PERSON_FIELDS, type BookingFormState, type PersonField } from "./schema";

/** Short, readable reference the person can quote on the phone. */
const makeReference = () =>
  `BF-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random() * 36 ** 2)
    .toString(36)
    .padStart(2, "0")
    .toUpperCase()}`;

/**
 * Receives a site visit request. There is no database in this case: the
 * request is validated, given a reference, and written to the server log with
 * the estimate and the campaign attached, which is what the team would read
 * on Monday to see which ad brought it in.
 */
export async function submitBooking(
  _previous: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, value]) => typeof value === "string") as [string, string][],
  );

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<PersonField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && (PERSON_FIELDS as readonly string[]).includes(field)) {
        errors[field as PersonField] ??= issue.message;
      }
    }
    return { status: "error", errors, values: raw };
  }

  const booking = parsed.data;
  const city = getCity(booking.city);
  const estimate = city
    ? calculate({ monthlyBill: booking.bill, coverage: booking.coverage / 100 }, city)
    : null;
  const reference = makeReference();

  console.info(
    JSON.stringify({
      event: "site_visit_requested",
      reference,
      receivedAt: new Date().toISOString(),
      city: booking.city,
      neighborhood: booking.neighborhood,
      timeWindow: booking.timeWindow,
      estimate: estimate && {
        bill: booking.bill,
        coverage: booking.coverage,
        panels: estimate.panels,
        netCost: Math.round(estimate.netCost),
        monthlySavings: Math.round(estimate.monthlySavings * 100) / 100,
        paybackYears: Math.round(estimate.paybackYears * 10) / 10,
      },
      campaign: {
        source: booking.utm_source,
        medium: booking.utm_medium,
        campaign: booking.utm_campaign,
        content: booking.utm_content,
        term: booking.utm_term,
        gclid: booking.gclid,
        fbclid: booking.fbclid,
      },
    }),
  );

  return { status: "success", reference, booking };
}
