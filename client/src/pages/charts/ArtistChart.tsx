/**
 * ArtistChart - Artist chart page
 */

import { useState, useCallback } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Grid3X3, List, Share2, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ChartLayout from "@/components/charts/ChartLayout";
import HeroSection from "@/components/HeroSection";
import WeekSelector from "@/components/charts/WeekSelector";
import { ChartListSkeleton, ChartGridSkeleton } from "@/components/ui/skeleton";
import { useArtistsChart, useAvailableWeeks } from "@/hooks/useChartData";
import type { ArtistChartEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

export default function ArtistChart() {
  const params = useParams<{ date?: string }>();
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Load available weeks
  const { data: weeks, loading: weeksLoading } = useAvailableWeeks("artists");

  // Determine current week from URL or default to latest
  const currentWeek = params.date || weeks?.[0] || "";

  // Find current week index for navigation
  const currentIndex = weeks?.indexOf(currentWeek) ?? -1;
  const hasPrevious = currentIndex < (weeks?.length ?? 0) - 1;
  const hasNext = currentIndex > 0;

  // Navigation handlers that update URL
  const goToPrevious = useCallback(() => {
    if (hasPrevious && weeks) {
      setLocation(`/charts/artists/${weeks[currentIndex + 1]}`);
    }
  }, [hasPrevious, weeks, currentIndex, setLocation]);

  const goToNext = useCallback(() => {
    if (hasNext && weeks) {
      setLocation(`/charts/artists/${weeks[currentIndex - 1]}`);
    }
  }, [hasNext, weeks, currentIndex, setLocation]);

  const goToWeek = useCallback(
    (week: string) => {
      setLocation(`/charts/artists/${week}`);
    },
    [setLocation]
  );

  // Load chart data for current week
  const { data: chartData, loading: chartLoading } = useArtistsChart(currentWeek || undefined);

  const entries = chartData?.entries || [];
  const displayedEntries = showAll ? entries : entries.slice(0, 25);

  const weekLabel = chartData
    ? `Week of ${formatWeekLabel(chartData.weekStart, chartData.weekEnd)}`
    : "";

  return (
    <ChartLayout>
      {/* Hero Section */}
      <HeroSection chartType="artist" chartName="ARTIST CHART" />

      {/* Chart Content */}
      <div className="bg-[#0f0f0f]">
        {/* Chart Header */}
        <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <nav className="flex items-center gap-2" aria-label="チャート週ナビゲーション">
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  hasPrevious
                    ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                    : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                }`}
                aria-label="前週のチャート"
              >
                <ChevronLeft size={16} />
              </button>
              {weeks && weeks.length > 0 && (
                <WeekSelector weeks={weeks} currentWeek={currentWeek} onSelectWeek={goToWeek} />
              )}
              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  hasNext
                    ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                    : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                }`}
                aria-label="次週のチャート"
              >
                <ChevronRight size={16} />
              </button>
              <span className="text-xs text-gray-500 ml-2 hidden sm:inline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {weekLabel}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#a855f7] text-black"
                    : "bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white"
                }`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${
                  viewMode === "list"
                    ? "bg-[#a855f7] text-black"
                    : "bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white"
                }`}
              >
                <List size={15} />
              </button>
              <button
                onClick={() => toast("Share — Coming soon")}
                className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white transition-colors"
              >
                <Share2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Column Headers - Only show in list view */}
        {viewMode === "list" && (
          <div className="hidden sm:flex items-center px-3 sm:px-5 py-2 bg-[#0a0a0a] border-b border-[#1a1a1a]">
            <div className="w-12 flex-shrink-0 mr-2" />
            <div className="w-5 flex-shrink-0 mr-2" />
            <div className="w-14 flex-shrink-0 mr-3" />
            <div
              className="flex-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Artist
            </div>
            <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
              {["LW", "PEAK", "WEEKS", "TOP SONG"].map((col) => (
                <div
                  key={col}
                  className="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    width: col === "TOP SONG" ? "8rem" : "2.5rem",
                  }}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Entries */}
        <div>
          {chartLoading || weeksLoading ? (
            viewMode === "grid" ? (
              <ChartGridSkeleton count={showAll ? 25 : 12} />
            ) : (
              <ChartListSkeleton count={showAll ? 25 : 10} />
            )
          ) : displayedEntries.length > 0 ? (
            viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
                {displayedEntries.map((entry) => (
                  <ArtistGridCard key={entry.rank} entry={entry} isTop3={entry.rank <= 3} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="stagger-animate">
                {displayedEntries.map((entry) => (
                  <ArtistChartRow key={entry.rank} entry={entry} isTop10={entry.rank <= 10} />
                ))}
              </div>
            )
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                アーティストチャートデータは現在準備中です
              </p>
            </div>
          )}
        </div>

        {/* Load More */}
        {!showAll && entries.length > 25 && (
          <div className="flex justify-center py-10 border-t border-[#1e1e1e]">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 border border-[#ec4899] text-[#ec4899] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#ec4899] hover:text-black transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>See All</span>
              <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-[#1a1a1a] px-4 sm:px-6 py-8">
        <p className="text-gray-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 K-STAR PROJECT. All rights reserved.
        </p>
      </footer>
    </ChartLayout>
  );
}

interface ArtistChartRowProps {
  entry: ArtistChartEntry;
  isTop10: boolean;
}

function ArtistChartRow({ entry, isTop10 }: ArtistChartRowProps) {
  const trendIcon = getTrendIcon(entry.trend);

  return (
    <div
      className={cn(
        "flex items-center px-3 sm:px-5 py-3 border-b border-[#1a1a1a] hover:bg-[#151515] transition-colors",
        isTop10 && "bg-[#0d0d0d]"
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          "w-12 flex-shrink-0 mr-2 text-center font-bold",
          isTop10
            ? "text-xl bg-gradient-to-r from-[#ec4899] to-[#f97316] bg-clip-text text-transparent"
            : "text-lg text-gray-400"
        )}
        style={{ fontFamily: "'Bebas Neue', cursive" }}
      >
        {entry.rank}
      </div>

      {/* Trend */}
      <div className="w-5 flex-shrink-0 mr-2 text-sm">{trendIcon}</div>

      {/* Artist Image */}
      <div className="w-14 h-14 flex-shrink-0 mr-3 bg-[#1a1a1a] rounded-full overflow-hidden">
        {entry.image ? (
          <img
            src={entry.image}
            alt={entry.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">
            {entry.name[0]}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/artists/${entry.artistId}`}
          className="text-white font-medium truncate block hover:text-[#a855f7] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {entry.name}
        </Link>
        <p
          className="text-gray-500 text-sm truncate"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {entry.nameKo || ""}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
        <div className="text-sm text-gray-400 text-center w-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {entry.previousRank || "-"}
        </div>
        <div className="text-sm text-gray-400 text-center w-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {entry.peakPosition}
        </div>
        <div className="text-sm text-gray-400 text-center w-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {entry.weeksOnChart}
        </div>
        <div
          className="text-sm text-[#a855f7] truncate w-32"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {entry.topSongTitle || "-"}
        </div>
      </div>
    </div>
  );
}

function getTrendIcon(trend: string): string {
  switch (trend) {
    case "up": return "▲";
    case "down": return "▼";
    case "same": return "—";
    case "new": return "★";
    case "re-entry": return "↩";
    default: return "";
  }
}

// Artist Grid Card Component
interface ArtistGridCardProps {
  entry: ArtistChartEntry;
  isTop3?: boolean;
}

function ArtistGridCard({ entry, isTop3 = false }: ArtistGridCardProps) {
  const TrendIcon = () => {
    if (entry.trend === "new") {
      return <Sparkles size={12} className="text-pink-400" />;
    }
    switch (entry.trend) {
      case "up":
        return <TrendingUp size={12} className="text-green-400" />;
      case "down":
        return <TrendingDown size={12} className="text-red-400" />;
      default:
        return <Minus size={12} className="text-gray-500" />;
    }
  };

  return (
    <Link href={`/artists/${entry.artistId}`} className="block">
      <div
        className={`group relative bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#222] transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
          isTop3 ? "ring-1 ring-[#ec4899]/30" : ""
        }`}
      >
        {/* Artist Image */}
        <div className="relative aspect-square">
          {entry.image ? (
            <img
              src={entry.image}
              alt={entry.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center">
              <span className="text-4xl text-gray-600">
                {entry.name?.[0] || "?"}
              </span>
            </div>
          )}

          {/* Rank Badge */}
          <div
            className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
              entry.rank === 1
                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black"
                : entry.rank === 2
                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black"
                : entry.rank === 3
                ? "bg-gradient-to-br from-orange-400 to-orange-600 text-black"
                : "bg-black/70 text-white"
            }`}
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            {entry.rank}
          </div>

          {/* Trend Badge */}
          <div className="absolute top-2 right-2 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-1">
            <TrendIcon />
            {entry.trend === "new" && (
              <span className="text-[10px] text-pink-400 font-bold">NEW</span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="text-white text-sm font-medium truncate"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {entry.name}
          </h3>
          <p
            className="text-gray-400 text-xs truncate mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {entry.nameKo || entry.topSongTitle || ""}
          </p>
        </div>
      </div>
    </Link>
  );
}

function formatWeekLabel(start: string, end: string): string {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startStr = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endStr = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${startStr} - ${endStr}`;
  } catch {
    return `${start} - ${end}`;
  }
}
