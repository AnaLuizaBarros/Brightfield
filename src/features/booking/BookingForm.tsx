"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useActionState, useEffect, useId, useRef } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics/tracking";
import type { CityData } from "@/lib/city/schema";
import { formatUsd } from "@/lib/format";
import { toTelHref } from "@/lib/seo/site";
import { submitBooking } from "./actions";
import styles from "./BookingForm.module.scss";
import { PERSON_FIELDS, TIME_WINDOWS, type BookingFormState, type PersonField } from "./schema";

type BookingFormProps = {
  city: CityData;
  /** Estimate and campaign values from the page URL, passed on unchanged. */
  carried: Record<string, string>;
};

const LABELS: Record<PersonField, string> = {
  name: "Your name",
  phone: "Phone number",
  neighborhood: "Neighborhood",
  timeWindow: "Best time for the visit",
  notes: "Anything the crew should know",
};

export function BookingForm({ city, carried }: BookingFormProps) {
  const [state, action, pending] = useActionState<BookingFormState, FormData>(submitBooking, {
    status: "idle",
  });
  const baseId = useId();
  const form = useRef<HTMLFormElement>(null);

  // After a failed submit, focus the first field with a problem.
  useEffect(() => {
    if (state.status !== "error") return;
    const first = PERSON_FIELDS.find((field) => state.errors[field]);
    if (!first) return;
    form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  useEffect(() => {
    if (state.status === "success") {
      track("booking_submitted", { reference: state.reference, timeWindow: state.booking.timeWindow });
    }
  }, [state]);

  if (state.status === "success") {
    const window = TIME_WINDOWS.find((w) => w.value === state.booking.timeWindow);
    return (
      <div role="status" className={styles.success}>
        <CheckCircle size={40} weight="fill" aria-hidden="true" />
        <h2>Request received</h2>
        <p>
          Reference <b>{state.reference}</b>. A {city.city} crew will call{" "}
          <b>{state.booking.phone.replace(/^1?(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")}</b> to
          confirm a visit in {state.booking.neighborhood}. Preferred time:{" "}
          {window?.label.toLowerCase()}.
        </p>
        <p>
          Need to change something? Call <a href={toTelHref(city.phone)}>{city.phone}</a> and
          quote the reference.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const errorList = PERSON_FIELDS.filter((field) => errors[field]);
  const fieldId = (field: PersonField) => `${baseId}-${field}`;
  const describedBy = (field: PersonField) =>
    errors[field] ? `${fieldId(field)}-error` : undefined;

  return (
    <form ref={form} action={action} noValidate className={styles.form}>
      {errorList.length > 0 && (
        <div role="alert" className={styles.summary}>
          <WarningCircle size={20} weight="bold" aria-hidden="true" />
          <p>
            Please check {errorList.length === 1 ? "one field" : `${errorList.length} fields`}:{" "}
            {errorList.map((field) => LABELS[field].toLowerCase()).join(", ")}.
          </p>
        </div>
      )}

      {Object.entries(carried).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <div className={styles.field}>
        <label htmlFor={fieldId("name")}>{LABELS.name}</label>
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={values.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
        />
        <FieldError id={`${fieldId("name")}-error`} message={errors.name} />
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("phone")}>{LABELS.phone}</label>
        <input
          id={fieldId("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(602) 555-0147"
          defaultValue={values.phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone")}
        />
        <FieldError id={`${fieldId("phone")}-error`} message={errors.phone} />
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("neighborhood")}>{LABELS.neighborhood}</label>
        <input
          id={fieldId("neighborhood")}
          name="neighborhood"
          type="text"
          list={`${baseId}-neighborhoods`}
          autoComplete="address-level3"
          defaultValue={values.neighborhood}
          aria-invalid={Boolean(errors.neighborhood)}
          aria-describedby={describedBy("neighborhood")}
        />
        <datalist id={`${baseId}-neighborhoods`}>
          {city.popularNeighborhoods.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <FieldError id={`${fieldId("neighborhood")}-error`} message={errors.neighborhood} />
      </div>

      <fieldset
        className={styles.field}
        aria-invalid={Boolean(errors.timeWindow)}
        aria-describedby={describedBy("timeWindow")}
      >
        <legend>{LABELS.timeWindow}</legend>
        <div className={styles.options}>
          {TIME_WINDOWS.map((window) => (
            <label key={window.value} className={styles.option}>
              <input
                type="radio"
                name="timeWindow"
                value={window.value}
                defaultChecked={values.timeWindow === window.value}
              />
              {window.label}
            </label>
          ))}
        </div>
        <FieldError id={`${fieldId("timeWindow")}-error`} message={errors.timeWindow} />
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={fieldId("notes")}>
          {LABELS.notes} <span>(optional)</span>
        </label>
        <textarea
          id={fieldId("notes")}
          name="notes"
          rows={3}
          defaultValue={values.notes}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy("notes")}
        />
        <FieldError id={`${fieldId("notes")}-error`} message={errors.notes} />
      </div>

      <div className={styles.submit}>
        <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass()}>
          {pending ? "Sending…" : "Request a site visit"}
        </button>
        <p>
          Your estimate ({formatUsd(Number(carried.bill))} bill, {carried.coverage}% coverage) goes
          with the request.
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={styles.error}>
      <WarningCircle size={16} weight="bold" aria-hidden="true" />
      {message}
    </p>
  );
}
