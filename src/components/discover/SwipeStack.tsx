"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Profile } from "@/types/profile";
import { SwipeDirection } from "@/types/swipe";
import ProfileCard from "./ProfileCard";
import { appConfig } from "@/config/app.config";

interface SwipeStackProps {
  currentProfile: Profile | null;
  nextProfile: Profile | null;
  onSwipe: (direction: SwipeDirection) => void;
  isProcessing: boolean;
}

function TopCard({
  profile,
  onSwipe,
  isProcessing,
  exitDirection,
}: {
  profile: Profile;
  onSwipe: (direction: SwipeDirection) => void;
  isProcessing: boolean;
  exitDirection: SwipeDirection | null;
}) {
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

  return (
    <motion.div
      key={profile.id}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ x, rotate, zIndex: 10 }}
      drag={isProcessing ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={appConfig.swipe.elasticity}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1, opacity: 1 }}
      exit={{
        x:
          exitDirection === "LIKE"
            ? appConfig.swipe.exitDistance
            : -appConfig.swipe.exitDistance,
        rotate:
          exitDirection === "LIKE"
            ? appConfig.swipe.exitRotation
            : -appConfig.swipe.exitRotation,
        opacity: 0,
        transition: {
          duration: appConfig.swipe.animationDuration,
        },
      }}
    >
      <motion.div
        className="absolute left-6 top-8 z-20 -rotate-12 rounded-lg border-4 border-green-500 bg-black/20 backdrop-blur-sm px-4 py-2 pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-3xl font-extrabold tracking-wider text-green-400">LIKE</span>
      </motion.div>

      <motion.div
        className="absolute right-6 top-8 z-20 rotate-12 rounded-lg border-4 border-rose-500 bg-black/20 backdrop-blur-sm px-4 py-2 pointer-events-none"
        style={{ opacity: passOpacity }}
      >
        <span className="text-3xl font-extrabold tracking-wider text-rose-400">PASS</span>
      </motion.div>

      <ProfileCard profile={profile} />
    </motion.div>
  );
}

export default function SwipeStack({ currentProfile, nextProfile, onSwipe, isProcessing }: SwipeStackProps) {
  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);

  useEffect(() => {
    setExitDirection(null);
  }, [currentProfile?.id]);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      setExitDirection(direction);
      onSwipe(direction);
    },
    [onSwipe]
  );

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] select-none">
      {/* Next card behind */}
      {nextProfile && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0.95, y: 10, opacity: 0.7 }}
          animate={{
            scale: currentProfile ? appConfig.card.nextCardScale : 1,
            y: currentProfile ? appConfig.card.nextCardYOffset : 0,
            opacity: currentProfile ? appConfig.card.nextCardOpacity : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <ProfileCard profile={nextProfile} />
        </motion.div>
      )}

      {/* Top card */}
      <AnimatePresence mode="popLayout">
        {currentProfile && (
          <TopCard
            key={currentProfile.id}
            profile={currentProfile}
            onSwipe={handleSwipe}
            isProcessing={isProcessing}
            exitDirection={exitDirection}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
