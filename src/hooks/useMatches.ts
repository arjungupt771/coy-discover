"use client";

import { useState, useEffect, useCallback } from "react";
import { Match } from "@/types/match";

interface MatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

export function useMatches() {
  const [state, setState] = useState<MatchesState>({
    matches: [],
    loading: true,
    error: null,
  });

  const fetchMatches = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/matches");
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      setState({ matches: data.matches, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    ...state,
    refetch: fetchMatches,
    isEmpty: !state.loading && state.matches.length === 0,
  };
}
