/**
 * MonthlyChart - Monthly chart page (K-STAR MONTHLY TOP 100)
 */

import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Grid3X3, List, Share2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import ChartLayout from "@/components/charts/ChartLayout";
import HeroSection from "@/components/HeroSection";
import ChartEntry from "@/components/ChartEntry";
import { ChartListSkeleton } from "@/components/ui/skeleton";
import { useMonthlyChart, useAvailableMonths } from "@/hooks/useChartData";
import type { ChartEntry as LegacyChartEntry } from "@/lib/chartData";
import type { SongChartEntry } from "@/lib/types";

// Convert new SongChartEntry to legacy ChartEntry format for compatibility
function convertToLegacyEntry(entry: SongChartEntry): LegacyChartEntry & { songId?: string; artistId?: string } {
  return {
    rank: entry.rank,
    lastWeek: entry.previousRank,
    peakPosition: entry.peakPosition,
    weeksOnChart: entry.weeksOnChart,
    title: entry.title,
    artist: entry.artist,
    trend: entry.trend,
    image: entry.coverImage,
    isNew: entry.isNew,
    songId: entry.songId,
    artistId: entry.artistId,
  };
}

function formatMonthLabel(month: string): string {
  try {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return month;
  }
}

export default function MonthlyChart() {
  const params = useParams<{ month?: string }>();
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);

  // Load available months
  const { data: months, loading: monthsLoading } = useAvailableMonths();

  // Determine current month from URL or default to latest
  const currentMonth = params.month || months?.[0] || "";

  // Find current month index for navigation
  const currentIndex = months?.indexOf(currentMonth) ?? -1;
  const hasPrevious = currentIndex < (months?.length ?? 0) - 1;
  const hasNext = currentIndex > 0;

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    if (hasPrevious && months) {
      const prevMonth = months[currentIndex + 1];
      setLocation(`/charts/monthly/${prevMonth}`);
    }
  }, [hasPrevious, months, currentIndex, setLocation]);

  const goToNext = useCallback(() => {
    if (hasNext && months) {
      const nextMonth = months[currentIndex - 1];
      setLocation(`/charts/monthly/${nextMonth}`);
    }
  }, [hasNext, months, currentIndex, setLocation]);

  const goToMonth = useCallback(
    (month: string) => {
      setLocation(`/charts/monthly/${month}`);
    },
    [setLocation]
  );

  // Load chart data for current month
  const { data: chartData, loading: chartLoading } = useMonthlyChart(currentMonth || undefined);

  const entries = chartData?.entries || [];
  const displayedEntries = showAll ? entries : entries.slice(0, 25);

  const monthLabel = currentMonth ? formatMonthLabel(currentMonth) : "";

  return (
    <ChartLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Chart Content */}
      <div className="bg-[#0f0f0f]">
        {/* Chart Header */}
        <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Month Navigation */}
            <nav
              className="flex items-center gap-2"
              aria-label="チャート月ナビゲーション"
            >
              {/* Previous Month */}
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  hasPrevious
                    ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                    : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                }`}
                aria-label="前月のチャート"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Month Selector */}
              {months && months.length > 0 && (
                <select
                  value={currentMonth}
                  onChange={(e) => goToMonth(e.target.value)}
                  className="bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded border border-[#2a2a2a] focus:outline-none focus:border-[#a855f7]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {formatMonthLabel(month)}
                    </option>
                  ))}
                </select>
              )}

              {/* Next Month */}
              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  hasNext
                    ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                    : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                }`}
                aria-label="次月のチャート"
              >
                <ChevronRight size={16} />
              </button>

              {/* Month Label */}
              <span
                className="text-xs text-gray-500 ml-2 hidden sm:inline"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {monthLabel}
              </span>
            </nav>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast("Grid view — Coming soon")}
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
                onClick={() => toast("Share — Coming soon")}
                className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white transition-colors"
                title="Share"
              >
                <Share2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="hidden sm:flex items-center px-3 sm:px-5 py-2 bg-[#0a0a0a] border-b border-[#1a1a1a]">
          <div className="w-12 flex-shrink-0 mr-2" />
          <div className="w-5 flex-shrink-0 mr-2" />
          <div className="w-11 flex-shrink-0 mr-3" />
          <div
            className="flex-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Title / Artist
          </div>
          <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
            {["LM", "PEAK", "MONTHS"].map((col) => (
              <div
                key={col}
                className="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  width: col === "MONTHS" ? "3rem" : "2.5rem",
                }}
              >
                {col}
              </div>
            ))}
          </div>
          <div className="w-16 flex-shrink-0" />
        </div>

        {/* Chart Entries */}
        <div>
          {chartLoading || monthsLoading ? (
            <ChartListSkeleton count={showAll ? 25 : 10} />
          ) : displayedEntries.length > 0 ? (
            <div className="stagger-animate">
              {displayedEntries.map((entry) => (
                <ChartEntry
                  key={entry.rank}
                  entry={convertToLegacyEntry(entry)}
                  isTop10={entry.rank <= 10}
                />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                No chart data available for this month.
              </p>
            </div>
          )}
        </div>

        {/* Load More */}
        {!showAll && entries.length > 25 && (
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

        {showAll && entries.length > 0 && (
          <div className="flex justify-center py-10 border-t border-[#1e1e1e]">
            <p
              className="text-gray-500 text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Showing all {entries.length} chart entries
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <ChartFooter />
    </ChartLayout>
  );
}

function ChartFooter() {
  return (
    <footer className="bg-[#060606] border-t border-[#1a1a1a] px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="K-STAR" className="h-8 w-auto" />
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
              onClick={() => toast(`${link} — Coming soon`)}
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
  );
}
