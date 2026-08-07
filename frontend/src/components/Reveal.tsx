import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll entry. Heavy fade-up that resolves out of a blur, so content arrives
 * with mass rather than snapping in. Fires once, and collapses to static under
 * prefers-reduced-motion.
 *
 * The blur is a filter, not a transform, so it is the one property here that
 * costs compositing. Acceptable because it runs once per element on a handful
 * of blocks; it would not be on a scrubbed or looping animation.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
