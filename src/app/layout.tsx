import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import type { ReactNode } from "react";
import { AttributionInit } from "@/components/analytics";
import { SITE } from "@/lib/seo/site";
import "@/styles/global.scss";

// One family for the whole page. Weight and size carry the hierarchy.
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  applicationName: SITE.name,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#fbfbf9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AttributionInit />
        {children}
      </body>
    </html>
  );
}
