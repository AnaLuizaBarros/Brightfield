"use client";

import { useEffect } from "react";
import { setTrackingContext, track } from "@/lib/analytics/tracking";

/** Tells the tracker which city page this is, then reports the page view. */
export function TrackingContext({ city }: { city: string }) {
  useEffect(() => {
    setTrackingContext({ city });
    track("page_view");
  }, [city]);
  return null;
}
