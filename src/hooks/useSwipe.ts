"use client";

import { useState, useCallback } from "react";
import { SwipeDirection } from "@/types/swipe";

interface SwipeState {
  isDragging: boolean;
  offsetX: number;
  direction: SwipeDirection | null;
}

export function useSwipe(threshold: number = 100) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    offsetX: 0,
    direction: null,
  });

  const handleDragStart = useCallback(() => {
    setSwipeState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDrag = useCallback(
    (offsetX: number) => {
      let direction: SwipeDirection | null = null;
      if (offsetX > threshold * 0.5) direction = "LIKE";
      else if (offsetX < -threshold * 0.5) direction = "PASS";

      setSwipeState({ isDragging: true, offsetX, direction });
    },
    [threshold]
  );

  const handleDragEnd = useCallback(
    (offsetX: number): SwipeDirection | null => {
      const direction: SwipeDirection | null =
        offsetX >= threshold ? "LIKE" : offsetX <= -threshold ? "PASS" : null;

      setSwipeState({ isDragging: false, offsetX: 0, direction: null });
      return direction;
    },
    [threshold]
  );

  const reset = useCallback(() => {
    setSwipeState({ isDragging: false, offsetX: 0, direction: null });
  }, []);

  return {
    ...swipeState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    reset,
  };
}
