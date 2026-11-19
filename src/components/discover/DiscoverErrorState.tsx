"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";

interface DiscoverErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function DiscoverErrorState({ message, onRetry }: DiscoverErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 max-w-sm w-full flex flex-col items-center gap-4">
        <div className="rounded-full bg-red-50 p-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Unable to load profiles</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {message || "Unable to load profiles right now. Please check your connection and try again."}
        </p>
        <Button
          variant="primary"
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 mt-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}
