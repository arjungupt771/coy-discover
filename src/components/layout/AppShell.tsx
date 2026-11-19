"use client";

import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Header />
      <main className="flex flex-1 flex-col items-center pb-20 md:pb-4">
        <div className="w-full max-w-lg px-4 py-4">{children}</div>
      </main>
      <BottomNavigation />
    </div>
  );
}
