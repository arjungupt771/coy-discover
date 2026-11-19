"use client";

import { useCallback } from "react";
import { SwipeDirection } from "@/types/swipe";
import { useFeed } from "@/hooks/useFeed";
import { useSwipeActions } from "@/hooks/useSwipeActions";
import SwipeStack from "./SwipeStack";
import SwipeActions from "./SwipeActions";
import DiscoverEmptyState from "./DiscoverEmptyState";
import DiscoverErrorState from "./DiscoverErrorState";
import MatchModal from "@/components/matches/MatchModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DiscoverView() {
  const { profiles, loading, error, refetch, removeProfile, currentProfile, nextProfile, isEmpty } =
    useFeed();
  const { submitSwipe, isProcessing, matchData, showMatch, dismissMatch } = useSwipeActions();

  const handleSwipe = useCallback(
    async (direction: SwipeDirection) => {
      if (!currentProfile || isProcessing) return;

      try {
        const result = await submitSwipe(currentProfile.id, direction);
        if (result) {
          removeProfile(currentProfile.id);
        }
      } catch (err) {
        console.error("Failed to process swipe", err);
        // Error handling preserves profile in view so user can retry
      }
    },
    [currentProfile, isProcessing, submitSwipe, removeProfile]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500">Finding people near you...</p>
      </div>
    );
  }

  if (error) {
    return <DiscoverErrorState message={error} onRetry={refetch} />;
  }

  if (isEmpty) {
    return <DiscoverEmptyState />;
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex items-center justify-between px-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Discover
        </span>
        <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
          {profiles.length} remaining
        </span>
      </div>

      <SwipeStack
        currentProfile={currentProfile}
        nextProfile={nextProfile}
        onSwipe={handleSwipe}
        isProcessing={isProcessing}
      />

      <SwipeActions
        onLike={() => handleSwipe("LIKE")}
        onPass={() => handleSwipe("PASS")}
        disabled={isProcessing || !currentProfile}
      />

      <MatchModal
        isOpen={showMatch}
        matchData={matchData ?? null}
        onClose={dismissMatch}
      />
    </div>
  );
}
