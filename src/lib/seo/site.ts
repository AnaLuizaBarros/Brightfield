export const SITE = {
  name: "Brightfield Solar",
  tagline: "Solar that shows its math.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brightfield.albseven.com",
  /**
   * Search engines may index the site only when NEXT_PUBLIC_ALLOW_INDEXING is
   * "true". Off by default, so a preview or portfolio deploy on a subdomain
   * never competes with the real site or the ad landing pages.
   */
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
} as const;

/** Digits only, for `tel:` links. */
export const toTelHref = (phone: string) => `tel:+1${phone.replace(/\D/g, "")}`;
