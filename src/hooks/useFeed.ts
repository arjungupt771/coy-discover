"use client";

import { useState, useEffect, useCallback } from "react";
import { Profile } from "@/types/profile";

interface FeedState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

export function useFeed() {
  const [state, setState] = useState<FeedState>({
    profiles: [],
    loading: true,
    error: null,
  });

  const fetchFeed = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/feed");
      if (!res.ok) throw new Error("Failed to fetch feed");
      const data = await res.json();
      setState({ profiles: data.profiles, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const removeProfile = useCallback((profileId: string) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.filter((p) => p.id !== profileId),
    }));
  }, []);

  return {
    ...state,
    refetch: fetchFeed,
    removeProfile,
    currentProfile: state.profiles[0] ?? null,
    nextProfile: state.profiles[1] ?? null,
    isEmpty: !state.loading && state.profiles.length === 0,
  };
}
