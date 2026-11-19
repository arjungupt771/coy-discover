"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function MatchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="rounded-full bg-pink-50 p-6 shadow-inner">
        <Heart className="h-12 w-12 text-pink-400" />
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">
          No matches yet
        </h3>
        <p className="max-w-xs text-sm text-gray-500 leading-relaxed">
          When someone likes you and you like them back, they&apos;ll appear here.
        </p>
      </div>
      <Link href={ROUTES.DISCOVER}>
        <Button variant="primary">Discover People</Button>
      </Link>
    </div>
  );
}
