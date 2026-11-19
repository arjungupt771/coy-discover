"use client";

import { useState, useCallback } from "react";
import { SwipeDirection, SwipeResponse } from "@/types/swipe";

export function useSwipeActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchData, setMatchData] = useState<SwipeResponse["match"] | null>(null);
  const [showMatch, setShowMatch] = useState(false);

  const submitSwipe = useCallback(
    async (profileId: string, direction: SwipeDirection): Promise<SwipeResponse | null> => {
      if (isProcessing) return null;

      setIsProcessing(true);
      try {
        const res = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId, direction }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Swipe failed");
        }

        const data: SwipeResponse = await res.json();

        if (data.matched && data.match) {
          setMatchData(data.match);
          setShowMatch(true);
        }

        return data;
      } catch (err) {
        console.error("Swipe error:", err);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  const dismissMatch = useCallback(() => {
    setShowMatch(false);
    setMatchData(null);
  }, []);

  return {
    submitSwipe,
    isProcessing,
    matchData,
    showMatch,
    dismissMatch,
  };
}
