"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { href: ROUTES.HOME, label: "Home", icon: Home },
  { href: ROUTES.DISCOVER, label: "Discover", icon: Compass },
  { href: ROUTES.MATCHES, label: "Matches", icon: Heart },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-lg md:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-pink-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive && item.href === ROUTES.MATCHES ? "fill-pink-500" : ""}`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
