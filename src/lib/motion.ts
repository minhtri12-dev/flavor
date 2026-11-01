import type { Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
} as const;

export const SPRING = {
  type: "spring",
  stiffness: 500,
  damping: 28,
} as const;

export const VIEWPORT_ONCE = { once: true, margin: "-60px" } as const;

export const PRESS = { scale: 0.96 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

export function stagger(delay = 0.08): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: delay } },
  };
}