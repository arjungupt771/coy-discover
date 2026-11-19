"use client";

import { useMatches } from "@/hooks/useMatches";
import MatchList from "./MatchList";
import MatchEmptyState from "./MatchEmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function MatchesView() {
  const { matches, loading, error, refetch, isEmpty } = useMatches();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500">Loading matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (isEmpty) {
    return <MatchEmptyState />;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
          <p className="text-sm text-gray-500">
            {matches.length} {matches.length === 1 ? "person" : "people"} liked you back
          </p>
        </div>
      </div>
      <MatchList matches={matches} />
    </div>
  );
}
