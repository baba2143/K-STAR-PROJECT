/**
 * ChartLayout - Shared layout for all chart pages
 * Includes header, sidebar, mobile nav, and chart-specific content area
 */

import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import SkipLink from "@/components/SkipLink";

interface ChartLayoutProps {
  children: ReactNode;
}

export default function ChartLayout({ children }: ChartLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <SkipLink />
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <aside
          className="hidden lg:block w-[240px] min-w-[240px] sticky top-[89px] h-[calc(100vh-89px)] overflow-y-auto"
          aria-label="サイドバーナビゲーション"
        >
          <Sidebar />
        </aside>

        {/* Main content - add bottom padding on mobile for nav */}
        <main
          id="main-content"
          className="flex-1 min-w-0 pb-safe"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
