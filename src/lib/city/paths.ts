import { SITE } from "@/lib/seo/site";
import { homeCity } from "./cities";

/** The home city lives at the site root; every other city at `/<slug>`. */
export const cityPath = (slug: string) => (slug === homeCity().slug ? "/" : `/${slug}`);
export const cityUrl = (slug: string) => `${SITE.url}${cityPath(slug)}`;
