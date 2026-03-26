/*
 * K-STAR PROJECT - Home Page
 * Design: Neo-Brutalist × K-POP Culture
 * Layout: Sticky header + (Sidebar | Main Content) structure
 * Dark theme (#0a0a0a) with neon green (#a855f7) accents
 * Bebas Neue for display text, DM Sans for body
 * Features: Date picker for historical chart navigation
 */

import { useState, useEffect } from "react";
import { Grid3X3, List, Share2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import ChartEntry from "@/components/ChartEntry";
import DatePicker from "@/components/DatePicker";
import { getChartForDate, getCurrentChartDate, formatChartDate } from "@/lib/chartHistory";
import type { ChartEntry as ChartEntryType } from "@/lib/chartData";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(getCurrentChartDate());
  const [showAll, setShowAll] = useState(false);
  const [chartEntries, setChartEntries] = useState<ChartEntryType[]>([]);

  // Load chart data when date changes
  useEffect(() => {
    const chartWeek = getChartForDate(currentDate);
    setChartEntries(chartWeek.entries);
  }, [currentDate]);

  // Update chart when date changes
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    setShowAll(false);
    const chartWeek = getChartForDate(newDate);
    setChartEntries(chartWeek.entries);
  };

  const displayedEntries = showAll ? chartEntries : chartEntries.slice(0, 25);
  const chartWeek = getChartForDate(currentDate);
  const weekLabel = chartWeek.weekLabel;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block w-[240px] min-w-[240px] sticky top-[89px] h-[calc(100vh-89px)] overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Hero section */}
          <HeroSection />

          {/* Chart content area */}
          <div className="bg-[#0f0f0f]">
            {/* Chart header with date picker */}
            <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-[#1e1e1e]">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h1
                    className="text-white font-black uppercase leading-none"
                    style={{
                      fontFamily: "'Bebas Neue', cursive",
                      fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    K-STAR TOP 100
                  </h1>
                </div>

                {/* View controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast("Grid view — Feature coming soon")}
                    className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white transition-colors"
                    title="Grid view"
                  >
                    <Grid3X3 size={15} />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center bg-[#a855f7] text-black"
                    title="List view"
                  >
                    <List size={15} />
                  </button>
                  <button
                    onClick={() => toast("Share — Feature coming soon")}
                    className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white transition-colors"
                    title="Share"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* Date picker and week info */}
              <div className="flex items-center gap-3 flex-wrap">
                <DatePicker currentDate={currentDate} onDateChange={handleDateChange} />
                <span
                  className="text-xs text-gray-500 font-medium tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {weekLabel}
                </span>
              </div>
            </div>

            {/* Column headers */}
            <div className="hidden sm:flex items-center px-3 sm:px-5 py-2 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <div className="w-12 flex-shrink-0 mr-2" />
              <div className="w-5 flex-shrink-0 mr-2" />
              <div className="w-11 flex-shrink-0 mr-3" />
              <div className="flex-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Title / Artist
              </div>
              <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
                {["LW", "PEAK", "WEEKS"].map((col) => (
                  <div
                    key={col}
                    className="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif", width: col === "WEEKS" ? "3rem" : "2.5rem" }}
                  >
                    {col}
                  </div>
                ))}
              </div>
              <div className="w-16 flex-shrink-0" />
            </div>

            {/* Chart entries */}
            <div>
              {displayedEntries.length > 0 ? (
                displayedEntries.map((entry) => (
                  <ChartEntry
                    key={entry.rank}
                    entry={entry}
                    isTop10={entry.rank <= 10}
                  />
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Loading chart data...
                  </p>
                </div>
              )}
            </div>

            {/* Load more */}
            {!showAll && chartEntries.length > 25 && (
              <div className="flex justify-center py-10 border-t border-[#1e1e1e]">
                <button
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-2 border border-[#a855f7] text-[#a855f7] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#a855f7] hover:text-black transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>See All 100</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {showAll && (
              <div className="flex justify-center py-10 border-t border-[#1e1e1e]">
                <p className="text-gray-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Showing all chart entries for {weekLabel.toLowerCase()}
                </p>
              </div>
            )}
          </div>

          {/* About section */}
          <div className="bg-[#0a0a0a] border-t border-[#1e1e1e] px-4 sm:px-6 py-8">
            <div className="max-w-3xl">
              <h2
                className="text-white font-black uppercase mb-3"
                style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.3rem", letterSpacing: "0.08em" }}
              >
                About K-STAR CHART
              </h2>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                K-STAR CHARTは、K-POP音楽の週間ランキングを提供するチャートサイトです。ストリーミング、デジタルセールス、フィジカルセールスなど、様々な指標に基づいたチャートを毎週更新しています。
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#060606] border-t border-[#1a1a1a] px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="K-STAR"
                  className="h-8 w-auto"
                />
                <span
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Bebas Neue', cursive",
                    letterSpacing: "0.08em",
                    background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  K-STAR
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {["About", "Privacy Policy", "Terms of Use", "Contact"].map((link) => (
                  <button
                    key={link}
                    onClick={() => toast(`${link} — Feature coming soon`)}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            <p
              className="text-gray-600 text-xs mt-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              © 2026 K-STAR PROJECT. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
