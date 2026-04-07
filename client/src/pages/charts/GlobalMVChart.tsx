/**
 * GlobalMVChart - GLOBAL MUSIC VIDEO CHART / HOT NOW MUSIC VIDEO CHART
 * YouTube embedded video chart with hover-to-expand UX
 */

import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { ChevronLeft, ChevronRight, X, Play, TrendingUp, Eye, Calendar } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import HeroSection from "@/components/HeroSection";
import { ChartListSkeleton } from "@/components/ui/skeleton";
import { loadMVChart, getAvailableMVWeeks, type MVChartEntry as APIMVChartEntry } from "@/lib/api";

// Chart type configurations
const chartTypeConfig: Record<string, {
  title: string;
  subtitle: string;
  gradient: string;
}> = {
  "global-mv": {
    title: "GLOBAL MUSIC VIDEO CHART",
    subtitle: "週間ミュージックビデオ再生数ランキング",
    gradient: "linear-gradient(90deg, #00d4ff, #a855f7)"
  },
  "global-hot-mv": {
    title: "HOT NOW MUSIC VIDEO CHART",
    subtitle: "急上昇ミュージックビデオランキング",
    gradient: "linear-gradient(90deg, #f97316, #ec4899)"
  }
};

// MV Chart Entry interface (local, extends API type)
interface MVChartEntry {
  rank: number;
  previousRank: number | null;
  title: string;
  artist: string;
  artistKo?: string;
  youtubeId: string;
  thumbnail: string;
  weeklyViews: number;
  totalViews: number;
  releaseDate: string;
  trend: "up" | "down" | "same" | "new" | "re-entry";
}

// Format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

export default function GlobalMVChart() {
  const params = useParams<{ type?: string; period?: string }>();
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<MVChartEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [mvData, setMvData] = useState<MVChartEntry[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);

  const chartType = params.type || "global-mv";
  const config = chartTypeConfig[chartType] || chartTypeConfig["global-mv"];

  // Load available periods
  useEffect(() => {
    async function fetchPeriods() {
      const weeks = await getAvailableMVWeeks(chartType);
      if (weeks.length > 0) {
        setPeriods(weeks);
      }
    }
    fetchPeriods();
  }, [chartType]);

  // Load chart data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const week = params.period || (periods.length > 0 ? periods[0] : undefined);
      const data = await loadMVChart(chartType, week);

      if (data && data.entries.length > 0) {
        // Transform API data to local format
        const entries: MVChartEntry[] = data.entries.map((entry: APIMVChartEntry) => ({
          rank: entry.rank,
          previousRank: entry.previousRank,
          title: entry.title,
          artist: entry.artist,
          artistKo: entry.artistKo,
          youtubeId: entry.youtubeId || "",
          thumbnail: entry.thumbnail || `https://i.ytimg.com/vi/${entry.youtubeId}/maxresdefault.jpg`,
          weeklyViews: entry.weeklyViews || 0,
          totalViews: entry.totalViews || 0,
          releaseDate: entry.releaseDate || "",
          trend: entry.trend,
        }));
        setMvData(entries);
      } else {
        setMvData([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [chartType, params.period, periods]);

  const currentPeriod = params.period || (periods.length > 0 ? periods[0] : "");
  const currentIndex = periods.indexOf(currentPeriod);
  const hasPrevious = currentIndex >= 0 && currentIndex < periods.length - 1;
  const hasNext = currentIndex > 0;

  const goToPrevious = useCallback(() => {
    if (hasPrevious && periods.length > 0) {
      setLocation(`/charts/global/${chartType}/${periods[currentIndex + 1]}`);
    }
  }, [hasPrevious, chartType, currentIndex, periods, setLocation]);

  const goToNext = useCallback(() => {
    if (hasNext && periods.length > 0) {
      setLocation(`/charts/global/${chartType}/${periods[currentIndex - 1]}`);
    }
  }, [hasNext, chartType, currentIndex, periods, setLocation]);

  const handleEntryHover = (rank: number) => {
    setExpandedId(rank);
  };

  const handleEntryLeave = () => {
    setExpandedId(null);
  };

  const openVideoModal = (entry: MVChartEntry) => {
    setShowVideoModal(entry);
  };

  const closeVideoModal = () => {
    setShowVideoModal(null);
  };

  return (
    <ChartLayout>
      {/* Hero Section */}
      <HeroSection chartType="global-mv" chartName="GLOBAL MV CHART" />

      {/* Chart Content */}
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

              <select
                value={currentPeriod}
                onChange={(e) => setLocation(`/charts/global/${chartType}/${e.target.value}`)}
                className="bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded border border-[#2a2a2a] focus:outline-none focus:border-[#a855f7]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>

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

            {/* Chart Type Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setLocation(`/charts/global/global-mv`)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  chartType === "global-mv"
                    ? "bg-[#a855f7] text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                GLOBAL MV
              </button>
              <button
                onClick={() => setLocation(`/charts/global/global-hot-mv`)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  chartType === "global-hot-mv"
                    ? "bg-[#ec4899] text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                HOT NOW
              </button>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[60px_60px_100px_1fr_140px_160px_120px_50px] gap-2 px-6 py-3 border-b border-[#1e1e1e] text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div>#</div>
          <div></div>
          <div></div>
          <div>TITLE / ARTIST</div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            週間増加
          </div>
          <div className="flex items-center gap-1">
            <Eye size={12} />
            総再生回数
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            公開日
          </div>
          <div></div>
        </div>

        {/* Chart Entries */}
        <div>
          {loading ? (
            <ChartListSkeleton count={10} />
          ) : mvData.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                データがありません
              </p>
              <p className="text-gray-600 text-sm mt-2">
                管理ツールからチャートデータを登録してください
              </p>
            </div>
          ) : (
            mvData.map((entry) => (
              <MVChartEntryRow
                key={entry.rank}
                entry={entry}
                isExpanded={expandedId === entry.rank}
                onHover={() => handleEntryHover(entry.rank)}
                onLeave={handleEntryLeave}
                onPlayClick={() => openVideoModal(entry)}
              />
            ))
          )}
        </div>
      </div>

      {/* YouTube Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0f0f0f] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${showVideoModal.youtubeId}?autoplay=1`}
                title={showVideoModal.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {showVideoModal.title}
              </h3>
              <p className="text-gray-400 text-sm">{showVideoModal.artist}</p>
            </div>
          </div>
        </div>
      )}

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

// MV Chart Entry Row Component
interface MVChartEntryRowProps {
  entry: MVChartEntry;
  isExpanded: boolean;
  onHover: () => void;
  onLeave: () => void;
  onPlayClick: () => void;
}

function MVChartEntryRow({ entry, isExpanded, onHover, onLeave, onPlayClick }: MVChartEntryRowProps) {
  return (
    <div
      className={`relative transition-all duration-300 border-b border-[#1e1e1e] ${
        isExpanded ? "bg-[#1a1a1a]" : "hover:bg-[#151515]"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Expanded Video Preview */}
      {isExpanded && (
        <div
          className="relative w-full aspect-[21/9] bg-cover bg-center cursor-pointer group"
          style={{
            backgroundImage: `url(https://i.ytimg.com/vi/${entry.youtubeId}/maxresdefault.jpg)`
          }}
          onClick={onPlayClick}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 flex items-center justify-center bg-black/30 rounded-full group-hover:bg-black/50 transition-colors">
              <Play size={40} className="text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Entry info overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-4">
            <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', cursive" }}>
              {entry.rank}
            </span>
            <span className="text-gray-400">—</span>
            <div className="w-16 h-16 bg-black/50 rounded overflow-hidden">
              <img
                src={`https://i.ytimg.com/vi/${entry.youtubeId}/mqdefault.jpg`}
                alt={entry.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Title and artist on expanded */}
          <div className="absolute top-4 left-44">
            <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {entry.title}
            </h3>
            <button className="mt-1 px-3 py-1 bg-white/20 rounded-full text-white text-sm hover:bg-white/30 transition-colors">
              {entry.artist} →
            </button>
          </div>

          {/* Stats on expanded */}
          <div className="absolute top-4 right-4 flex items-center gap-6 text-white text-sm">
            <div className="flex items-center gap-1">
              <span className="text-red-500">▲</span>
              <span>{formatNumber(entry.weeklyViews)}</span>
            </div>
            <div>{formatNumber(entry.totalViews)}</div>
            <div>{entry.releaseDate}</div>
            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
              <span className="text-xs">📊</span>
            </div>
          </div>
        </div>
      )}

      {/* Normal Row */}
      {!isExpanded && (
        <div className="grid grid-cols-[60px_60px_100px_1fr_140px_160px_120px_50px] gap-2 px-6 py-4 items-center">
          {/* Rank */}
          <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            {entry.rank}
          </div>

          {/* Previous rank indicator */}
          <div className="text-gray-500 text-sm">
            —
          </div>

          {/* Thumbnail */}
          <div className="relative w-20 h-12 rounded overflow-hidden group cursor-pointer" onClick={onPlayClick}>
            <img
              src={`https://i.ytimg.com/vi/${entry.youtubeId}/mqdefault.jpg`}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={20} className="text-white" fill="white" />
            </div>
          </div>

          {/* Title & Artist */}
          <div>
            <h3 className="text-white font-medium text-sm line-clamp-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {entry.title}
            </h3>
            <p className="text-gray-500 text-xs line-clamp-1">
              {entry.artist}
            </p>
          </div>

          {/* Weekly Views */}
          <div className="flex items-center gap-1 text-sm">
            <span className="text-red-500">▲</span>
            <span className="text-white">{formatNumber(entry.weeklyViews)}</span>
          </div>

          {/* Total Views */}
          <div className="text-gray-400 text-sm">
            {formatNumber(entry.totalViews)}
          </div>

          {/* Release Date */}
          <div className="text-gray-500 text-sm">
            {entry.releaseDate}
          </div>

          {/* Chart Icon */}
          <div className="w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
            <span className="text-xs text-gray-500">📊</span>
          </div>
        </div>
      )}
    </div>
  );
}
