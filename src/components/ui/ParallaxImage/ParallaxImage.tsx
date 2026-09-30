"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import styles from "./ParallaxImage.module.scss";

type ParallaxImageProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  /** How far the photo drifts inside its frame, as a share of its height. */
  strength?: number;
  priority?: boolean;
  className?: string;
};

/**
 * A photo that drifts slower than the page while its frame scrolls by.
 * The frame takes its size from `className`; with reduced motion it is still.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  strength = 0.08,
  priority = false,
  className = "",
}: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });

  const travel = reduceMotion ? 0 : strength * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);

  return (
    <div ref={frame} className={`${styles.frame} ${className}`}>
      <motion.div className={styles.drift} style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className={styles.image}
        />
      </motion.div>
    </div>
  );
}
