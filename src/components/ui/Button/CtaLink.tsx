"use client";

import { ArrowRight } from "@phosphor-icons/react";
import type { MouseEvent, ReactNode } from "react";
import { buildBookingHref, getLastScenario, track } from "@/lib/analytics/tracking";
import { buttonClass, type ButtonStyleProps } from "./buttonClass";

export type CtaLocation = "header" | "hero" | "simulator" | "sticky" | "final";

type BookingLinkProps = ButtonStyleProps & {
  citySlug: string;
  location: CtaLocation;
  children: ReactNode;
};

/**
 * Link to the visit request. The destination is built at click time so it
 * carries the current simulation and the campaign that brought the visitor.
 */
export function BookingLink({ citySlug, location, children, ...style }: BookingLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const scenario = getLastScenario();
    event.currentTarget.href = buildBookingHref({ citySlug, ...scenario });
    track("cta_click", { location, intent: "site_visit", ...scenario });
  };

  return (
    <a href={`/schedule?city=${citySlug}`} onClick={handleClick} className={buttonClass(style)}>
      {children}
      <ArrowRight size={18} weight="bold" aria-hidden="true" />
    </a>
  );
}

type AnchorLinkProps = ButtonStyleProps & {
  targetId: string;
  location: CtaLocation;
  children: ReactNode;
};

/** In-page jump (to the simulator) that is also tracked. */
export function AnchorLink({ targetId, location, children, ...style }: AnchorLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      onClick={() => track("cta_click", { location, intent: "simulate" })}
      className={buttonClass(style)}
    >
      {children}
      <ArrowRight size={18} weight="bold" aria-hidden="true" />
    </a>
  );
}
