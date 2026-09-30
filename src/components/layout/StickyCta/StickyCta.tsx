"use client";

import { Phone } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { BookingLink } from "@/components/ui/Button";
import { toTelHref } from "@/lib/seo/site";
import styles from "./StickyCta.module.scss";

type StickyCtaProps = { citySlug: string; phone: string };

/** Sections that already show a call to action; the bar hides while one is on screen. */
const COVERING_SECTIONS = ["hero", "final-cta"] as const;

/** Phone-only bottom bar with the visit request, shown once the hero scrolls away. */
export function StickyCta({ citySlug, phone }: StickyCtaProps) {
  const [covered, setCovered] = useState<Record<string, boolean>>({ hero: true });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setCovered((previous) => {
        const next = { ...previous };
        for (const entry of entries) next[entry.target.id] = entry.isIntersecting;
        return next;
      });
    });
    for (const id of COVERING_SECTIONS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  const hidden = COVERING_SECTIONS.some((id) => covered[id]);

  return (
    <div className={styles.bar} data-hidden={hidden} aria-hidden={hidden} inert={hidden}>
      <BookingLink citySlug={citySlug} location="sticky" block>
        Request a site visit
      </BookingLink>
      <a href={toTelHref(phone)} aria-label={`Call ${phone}`} className={styles.call}>
        <Phone size={22} weight="bold" aria-hidden="true" />
      </a>
    </div>
  );
}
