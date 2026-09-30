"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/analytics/tracking";

/** Stores campaign parameters as early as possible in the session. */
export function AttributionInit() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
