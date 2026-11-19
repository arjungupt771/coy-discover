"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/lib/constants";

interface MatchModalProps {
  isOpen: boolean;
  matchData: {
    id: string;
    profile: {
      id: string;
      name: string;
      age: number;
      photo: string;
    };
  } | null;
  onClose: () => void;
}

export default function MatchModal({ isOpen, matchData, onClose }: MatchModalProps) {
  const router = useRouter();

  if (!matchData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl border border-pink-100"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Heart Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <div className="rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-4 shadow-lg shadow-pink-500/30">
                  <Heart className="h-10 w-10 fill-white text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                It&apos;s a Match!
              </motion.h2>

              {/* Profile Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Avatar
                  src={matchData.profile.photo}
                  alt={matchData.profile.name}
                  size="xl"
                  className="ring-4 ring-pink-300 shadow-md"
                />
              </motion.div>

              <motion.p
                className="text-gray-600 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                You and <span className="font-semibold text-gray-900">{matchData.profile.name}</span> liked each other
              </motion.p>

              {/* Actions */}
              <motion.div
                className="flex w-full flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onClose();
                    router.push(ROUTES.MATCHES);
                  }}
                >
                  View Matches
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full"
                  onClick={onClose}
                >
                  Continue Discovering
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
