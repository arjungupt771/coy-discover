"use client";

import { motion } from "framer-motion";

interface LikeIndicatorProps {
  opacity: number;
}

export default function LikeIndicator({ opacity }: LikeIndicatorProps) {
  return (
    <motion.div
      className="absolute left-6 top-8 z-20 -rotate-12 rounded-lg border-4 border-green-500 px-4 py-2"
      style={{ opacity }}
    >
      <span className="text-3xl font-extrabold tracking-wider text-green-500">
        LIKE
      </span>
    </motion.div>
  );
}
