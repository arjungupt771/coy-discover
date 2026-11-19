"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Profile } from "@/types/profile";
import ProfileCard from "./ProfileCard";
import LikeIndicator from "./LikeIndicator";
import PassIndicator from "./PassIndicator";
import { appConfig } from "@/config/app.config";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "LIKE" | "PASS") => void;
  isProcessing: boolean;
  isTop: boolean;
}

export default function SwipeCard({ profile, onSwipe, isProcessing, isTop }: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const passOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isProcessing) return;

    const threshold = appConfig.swipe.threshold;

    if (info.offset.x >= threshold) {
      onSwipe("LIKE");
    } else if (info.offset.x <= -threshold) {
      onSwipe("PASS");
    }
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scale: 0.95, opacity: 0.7 }}
        animate={{
          scale: appConfig.card.nextCardScale,
          opacity: appConfig.card.nextCardOpacity,
          y: appConfig.card.nextCardYOffset,
        }}
        transition={{ duration: 0.3 }}
      >
        <ProfileCard profile={profile} />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ x, rotate, zIndex: 10 }}
      drag={isProcessing ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={appConfig.swipe.elasticity}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      exit={{
        x: x.get() > 0 ? appConfig.swipe.exitDistance : -appConfig.swipe.exitDistance,
        rotate: x.get() > 0 ? appConfig.swipe.exitRotation : -appConfig.swipe.exitRotation,
        opacity: 0,
        transition: { duration: appConfig.swipe.animationDuration },
      }}
    >
      <motion.div style={{ opacity: likeOpacity }} className="pointer-events-none">
        <LikeIndicator opacity={1} />
      </motion.div>
      <motion.div style={{ opacity: passOpacity }} className="pointer-events-none">
        <PassIndicator opacity={1} />
      </motion.div>
      <ProfileCard profile={profile} />
    </motion.div>
  );
}
