import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 max-w-sm w-full flex flex-col items-center gap-4">
        <div className="rounded-full bg-pink-50 p-4">
          <Compass className="h-8 w-8 text-pink-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Welcome to Coy Discover</h1>
        <p className="text-sm text-gray-500">
          Home tab placeholder. Head over to Discover to start browsing profiles and finding matches!
        </p>
        <Link href={ROUTES.DISCOVER} className="w-full mt-2">
          <Button variant="primary" className="w-full">
            Start Discovering
          </Button>
        </Link>
      </div>
    </div>
  );
}
