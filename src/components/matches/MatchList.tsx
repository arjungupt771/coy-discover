"use client";

import { Match } from "@/types/match";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {matches.map((match, index) => (
        <MatchCard key={match.id} match={match} index={index} />
      ))}
    </div>
  );
}
