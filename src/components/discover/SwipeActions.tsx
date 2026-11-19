"use client";

import { X, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

interface SwipeActionsProps {
  onLike: () => void;
  onPass: () => void;
  disabled: boolean;
}

export default function SwipeActions({ onLike, onPass, disabled }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      <Button
        variant="secondary"
        size="icon"
        onClick={onPass}
        disabled={disabled}
        className="h-16 w-16 rounded-full border-2 border-gray-200 bg-white shadow-lg transition-all duration-150 active:scale-90 hover:border-red-300 hover:bg-red-50 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
        aria-label="Pass on this profile"
      >
        <X className="h-7 w-7 text-red-500" />
      </Button>

      <Button
        variant="primary"
        size="icon"
        onClick={onLike}
        disabled={disabled}
        className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 transition-all duration-150 active:scale-90 hover:shadow-xl hover:shadow-pink-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
        aria-label="Like this profile"
      >
        <Heart className="h-9 w-9 fill-white text-white" />
      </Button>
    </div>
  );
}
