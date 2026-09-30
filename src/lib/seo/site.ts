export const SITE = {
  name: "Brightfield Solar",
  tagline: "Solar that shows its math.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brightfield-solar.example",
} as const;

export const cityPath = (slug: string) => `/${slug}`;
export const cityUrl = (slug: string) => `${SITE.url}${cityPath(slug)}`;

/** Digits only, for `tel:` links. */
export const toTelHref = (phone: string) => `tel:+1${phone.replace(/\D/g, "")}`;
