/**
 * AlbumChart - Album chart page
 */

import { useState, useCallback } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Grid3X3, List, Share2, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ChartLayout from "@/components/charts/ChartLayout";
import HeroSection from "@/components/HeroSection";
import WeekSelector from "@/components/charts/WeekSelector";
import { ChartListSkeleton, ChartGridSkeleton } from "@/components/ui/skeleton";
import { useAlbumsChart, useAvailableWeeks } from "@/hooks/useChartData";
import type { AlbumChartEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

export default function AlbumChart() {
  const params = useParams<{ date?: string }>();
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Load available weeks
  const { data: weeks, loading: weeksLoading } = useAvailableWeeks("albums");

  // Determine current week from URL or default to latest
  const currentWeek = params.date || weeks?.[0] || "";

  // Find current week index for navigation
  const currentIndex = weeks?.indexOf(currentWeek) ?? -1;
  const hasPrevious = currentIndex < (weeks?.length ?? 0) - 1;
  const hasNext = currentIndex > 0;

  // Navigation handlers that update URL
  const goToPrevious = useCallback(() => {
    if (hasPrevious && weeks) {
      setLocation(`/charts/albums/${weeks[currentIndex + 1]}`);
    }
  }, [hasPrevious, weeks, currentIndex, setLocation]);

  const goToNext = useCallback(() => {
    if (hasNext && weeks) {
      setLocation(`/charts/albums/${weeks[currentIndex - 1]}`);
    }
  }, [hasNext, weeks, currentIndex, setLocation]);

  const goToWeek = useCallback(
    (week: string) => {
      setLocation(`/charts/albums/${week}`);
    },
    [setLocation]
  );

  // Load chart data for current week
  const { data: chartData, loading: chartLoading } = useAlbumsChart(currentWeek || undefined);

  const entries = chartData?.entries || [];
  const displayedEntries = showAll ? entries : entries.slice(0, 25);

  const weekLabel = chartData
    ? `Week of ${formatWeekLabel(chartData.weekStart, chartData.weekEnd)}`
    : "";

  return (
    <ChartLayout>
      {/* Hero Section */}
      <HeroSection chartType="album" chartName="ALBUM CHART" />

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
            <div className="w-16 flex-shrink-0 mr-3" />
            <div
              className="flex-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Album / Artist
            </div>
            <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
              {["LW", "PEAK", "WEEKS", "TYPE"].map((col) => (
                <div
                  key={col}
                  className="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    width: col === "TYPE" ? "4rem" : "2.5rem",
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
                  <AlbumGridCard key={entry.rank} entry={entry} isTop3={entry.rank <= 3} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="stagger-animate">
                {displayedEntries.map((entry) => (
                  <AlbumChartRow key={entry.rank} entry={entry} isTop10={entry.rank <= 10} />
                ))}
              </div>
            )
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                アルバムチャートデータは現在準備中です
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

interface AlbumChartRowProps {
  entry: AlbumChartEntry;
  isTop10: boolean;
}

function AlbumChartRow({ entry, isTop10 }: AlbumChartRowProps) {
  const trendIcon = getTrendIcon(entry.trend);
  const albumTypeLabel = getAlbumTypeLabel(entry.albumType);

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
            ? "text-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent"
            : "text-lg text-gray-400"
        )}
        style={{ fontFamily: "'Bebas Neue', cursive" }}
      >
        {entry.rank}
      </div>

      {/* Trend */}
      <div className="w-5 flex-shrink-0 mr-2 text-sm">{trendIcon}</div>

      {/* Cover Image */}
      <div className="w-16 h-16 flex-shrink-0 mr-3 bg-[#1a1a1a] rounded overflow-hidden">
        {entry.coverImage ? (
          <img
            src={entry.coverImage}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/albums/${entry.albumId}`}
          className="text-white font-medium truncate block hover:text-[#a855f7] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {entry.title}
        </Link>
        <Link
          href={`/artists/${entry.artistId}`}
          className="text-gray-400 text-sm truncate block hover:text-[#00d4ff] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {entry.artist}
        </Link>
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
          className={cn(
            "text-xs px-2 py-1 rounded text-center w-16",
            entry.albumType === "full" ? "bg-[#a855f7]/20 text-[#a855f7]" :
            entry.albumType === "mini" ? "bg-[#00d4ff]/20 text-[#00d4ff]" :
            "bg-[#ec4899]/20 text-[#ec4899]"
          )}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {albumTypeLabel}
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

// Album Grid Card Component
interface AlbumGridCardProps {
  entry: AlbumChartEntry;
  isTop3?: boolean;
}

function AlbumGridCard({ entry, isTop3 = false }: AlbumGridCardProps) {
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
    <Link href={`/albums/${entry.albumId}`} className="block">
      <div
        className={`group relative bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#222] transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
          isTop3 ? "ring-1 ring-[#a855f7]/30" : ""
        }`}
      >
        {/* Cover Image */}
        <div className="relative aspect-square">
          {entry.coverImage ? (
            <img
              src={entry.coverImage}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center">
              <span className="text-4xl text-gray-600">
                {entry.title?.[0] || "?"}
              </span>
            </div>
          )}

          {/* Rank Badge */}
          <div
            className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded font-bold text-sm ${
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

          {/* Album Type Badge */}
          <div
            className={`absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded ${
              entry.albumType === "full" ? "bg-[#a855f7]/80 text-white" :
              entry.albumType === "mini" ? "bg-[#00d4ff]/80 text-white" :
              "bg-[#ec4899]/80 text-white"
            }`}
          >
            {getAlbumTypeLabel(entry.albumType)}
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
            {entry.title}
          </h3>
          <p
            className="text-gray-400 text-xs truncate mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {entry.artist}
          </p>
        </div>
      </div>
    </Link>
  );
}

function getAlbumTypeLabel(type: string): string {
  switch (type) {
    case "full": return "正規";
    case "mini": return "ミニ";
    case "single": return "シングル";
    case "repackage": return "リパ";
    default: return type;
  }
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
