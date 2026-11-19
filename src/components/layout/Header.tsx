"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { ROUTES, APP_NAME } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: ROUTES.HOME, label: "Home" },
    { href: ROUTES.DISCOVER, label: "Discover" },
    { href: ROUTES.MATCHES, label: "Matches" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        <Link href={ROUTES.DISCOVER} className="flex items-center gap-2">
          <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
          <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-pink-50 text-pink-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
