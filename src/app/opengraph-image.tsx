import { homeCity } from "@/lib/city/cities";
import { renderCityOgImage } from "@/lib/seo/og-image";
import { SITE } from "@/lib/seo/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderCityOgImage(homeCity());
}
