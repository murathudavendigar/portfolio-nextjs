"use client";
import { motion, useReducedMotion } from "framer-motion";

const RINGS = [
  { size: 200, opacity: 0.35 },
  { size: 340, opacity: 0.25 },
  { size: 500, opacity: 0.18 },
  { size: 680, opacity: 0.12 },
];

const BackgroundCircles = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none relative flex max-w-full items-center justify-center">
      {RINGS.map((ring, i) => (
        <motion.div
          key={ring.size}
          initial={{ opacity: reduceMotion ? ring.opacity : 0, scale: reduceMotion ? 1 : 0.9 }}
          animate={{ opacity: ring.opacity, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : i * 0.1,
            ease: "easeOut",
          }}
          className="absolute rounded-full border border-[#CA3E47]/40"
          style={{ height: ring.size, width: ring.size }}
        />
      ))}
    </div>
  );
};

export default BackgroundCircles;
