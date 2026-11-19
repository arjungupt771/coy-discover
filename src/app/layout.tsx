import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Coy Discover — Swipe & Match",
  description: "A mobile-first swipe-based social discovery application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f9] text-[#1f1f1f]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
