"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { Match } from "@/types/match";
import { formatRelativeTime } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  index: number;
}

export default function MatchCard({ match, index }: MatchCardProps) {
  const { profile, matchedAt } = match;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
    >
      <Avatar src={profile.photo} alt={profile.name} size="lg" className="ring-2 ring-pink-100" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate text-base">
          {profile.name}, {profile.age}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 mt-0.5">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-pink-400" />
          <span className="text-xs truncate">{profile.city}</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Matched {formatRelativeTime(matchedAt)}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
        {profile.interests.slice(0, 2).map((interest) => (
          <span
            key={interest}
            className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-600"
          >
            {interest}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
