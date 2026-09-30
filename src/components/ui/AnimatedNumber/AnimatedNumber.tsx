"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const TWEEN_SECONDS = 0.35;

type AnimatedNumberProps = {
  value: number;
  format: (value: number) => string;
};

/**
 * Tweens between values by writing to the DOM directly, so a dragged slider
 * does not re-render React on every frame. The server renders the final value.
 */
export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const node = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = node.current;
    if (!element) return;

    if (reduceMotion) {
      shown.current = value;
      element.textContent = format(value);
      return;
    }

    const controls = animate(shown.current, value, {
      duration: TWEEN_SECONDS,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        shown.current = latest;
        element.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [value, format, reduceMotion]);

  return <span ref={node}>{format(value)}</span>;
}
