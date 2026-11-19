"use client";

import { motion } from "framer-motion";

interface PassIndicatorProps {
  opacity: number;
}

export default function PassIndicator({ opacity }: PassIndicatorProps) {
  return (
    <motion.div
      className="absolute right-6 top-8 z-20 rotate-12 rounded-lg border-4 border-red-500 px-4 py-2"
      style={{ opacity }}
    >
      <span className="text-3xl font-extrabold tracking-wider text-red-500">
        PASS
      </span>
    </motion.div>
  );
}
