/**
 * KStarArtistChart - K-STAR ARTIST CHART pages
 * Categories: BEST ROOKIE, BEST SOLO&FEATURING, BEST GROUP, BEST ICON, BEST GLOBAL
 */

import { useState, useCallback } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Grid3X3, List, Share2, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ChartLayout from "@/components/charts/ChartLayout";
import HeroSection from "@/components/HeroSection";
import ArtistChartEntry from "@/components/charts/ArtistChartEntry";
import { ChartListSkeleton, ChartGridSkeleton } from "@/components/ui/skeleton";
import { useKStarArtistChart, useAvailableArtistPeriods } from "@/hooks/useChartData";
import type { KStarArtistCategory } from "@/lib/api";

type ViewMode = "list" | "grid";

// Chart category configurations
const categoryConfig: Record<string, {
  title: string;
  subtitle: string;
}> = {
  rookie: {
    title: "BEST ROOKIE",
    subtitle: "期待の新人アーティストランキング"
  },
  solo: {
    title: "BEST SOLO & FEATURING",
    subtitle: "ソロ＆フィーチャリングアーティストランキング"
  },
  group: {
    title: "BEST GROUP",
    subtitle: "グループアーティストランキング"
  },
  icon: {
    title: "BEST ICON",
    subtitle: "K-POPアイコンランキング"
  },
  global: {
    title: "BEST GLOBAL",
    subtitle: "グローバルアーティストランキング"
  }
};

// Accent color matching K-STAR CHART
const ACCENT_COLOR = "#a855f7";

export default function KStarArtistChart() {
  const params = useParams<{ category?: string; period?: string }>();
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const category = (params.category || "rookie") as KStarArtistCategory;
  const config = categoryConfig[category] || categoryConfig.rookie;

  // Load available periods
  const { data: periods, loading: periodsLoading } = useAvailableArtistPeriods(category);

  // Determine current period from URL or default to latest
  const currentPeriod = params.period || periods?.[0] || "";

  // Find current period index for navigation
  const currentIndex = periods?.indexOf(currentPeriod) ?? -1;
  const hasPrevious = currentIndex < (periods?.length ?? 0) - 1;
  const hasNext = currentIndex > 0;

  // Load chart data for current period
  const { data: chartData, loading: chartLoading } = useKStarArtistChart(category, currentPeriod || undefined);

  const goToPrevious = useCallback(() => {
    if (hasPrevious && periods) {
      setLocation(`/charts/artist/${category}/${periods[currentIndex + 1]}`);
    }
  }, [hasPrevious, category, currentIndex, periods, setLocation]);

  const goToNext = useCallback(() => {
    if (hasNext && periods) {
      setLocation(`/charts/artist/${category}/${periods[currentIndex - 1]}`);
    }
  }, [hasNext, category, currentIndex, periods, setLocation]);

  const entries = chartData?.entries || [];
  const displayedEntries = showAll ? entries : entries.slice(0, 10);

  return (
    <ChartLayout>
      {/* Hero Section */}
      <HeroSection chartType={category} chartName={config.title} />

      {/* Chart Content - dark theme matching K-STAR CHART */}
      <div className="bg-[#0f0f0f]">
        {/* Chart Header */}
        <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Period Navigation */}
            <nav className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  hasPrevious
                    ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                    : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {periods && periods.length > 0 && (
                <select
                  value={currentPeriod}
                  onChange={(e) => setLocation(`/charts/artist/${category}/${e.target.value}`)}
                  className="bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded border border-[#2a2a2a] focus:outline-none focus:border-[#a855f7]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      {formatPeriodLabel(period)}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  hasNext
                    ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                    : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </nav>

            {/* View Controls */}
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

        {/* Chart Entries */}
        <div>
          {chartLoading || periodsLoading ? (
            viewMode === "grid" ? (
              <ChartGridSkeleton count={12} />
            ) : (
              <ChartListSkeleton count={10} />
            )
          ) : displayedEntries.length > 0 ? (
            viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
                {displayedEntries.map((entry) => (
                  <KStarArtistGridCard
                    key={entry.rank}
                    entry={entry}
                    isTop3={entry.rank <= 3}
                    accentColor={ACCENT_COLOR}
                  />
                ))}
              </div>
            ) : (
              /* List View */
              displayedEntries.map((entry, index) => (
                <ArtistChartEntry
                  key={entry.rank}
                  entry={entry}
                  isTop1={index === 0}
                  accentColor={ACCENT_COLOR}
                />
              ))
            )
          ) : (
            <div className="px-6 py-12 text-center">
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                No chart data available for this period.
              </p>
            </div>
          )}
        </div>

        {/* Load More */}
        {!showAll && entries.length > 10 && (
          <div className="flex justify-center py-10 border-t border-[#1e1e1e]">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 border border-[#a855f7] text-[#a855f7] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#a855f7] hover:text-black transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>See Full Chart</span>
              <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
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
    </ChartLayout>
  );
}

function formatPeriodLabel(period: string): string {
  try {
    const [year, month] = period.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return period;
  }
}

// K-STAR Artist Grid Card Component
interface KStarArtistGridCardProps {
  entry: {
    rank: number;
    name: string;
    nameKo?: string;
    artistId: string;
    image?: string;
    trend: "up" | "down" | "same" | "new" | "re-entry";
  };
  isTop3?: boolean;
  accentColor?: string;
}

function KStarArtistGridCard({ entry, isTop3 = false, accentColor = "#a855f7" }: KStarArtistGridCardProps) {
  const TrendIcon = () => {
    if (entry.trend === "new" || entry.trend === "re-entry") {
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
          isTop3 ? "ring-1 ring-[#a855f7]/30" : ""
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
            {entry.trend === "re-entry" && (
              <span className="text-[10px] font-bold" style={{ color: accentColor }}>RE</span>
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
            {entry.nameKo || ""}
          </p>
        </div>
      </div>
    </Link>
  );
}
