"use client";

import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function DiscoverEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-pink-100 max-w-sm w-full flex flex-col items-center gap-5">
        <div className="rounded-full bg-gradient-to-br from-pink-50 to-rose-50 p-6 shadow-inner">
          <Sparkles className="h-12 w-12 text-pink-400" />
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            You&apos;re all caught up!
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            You&apos;ve viewed all available profiles for now. Check out your mutual matches or reset the demo to explore again.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full">
          <Link href={ROUTES.MATCHES} className="w-full">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 fill-white" />
              <span>View Your Matches</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
