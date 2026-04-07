/**
 * ArtistChartEntry - Artist chart entry component
 * Design based on Billboard-style artist chart layout
 */

import { Link } from "wouter";
import { Star, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtistEntry {
  rank: number;
  previousRank: number | null;
  peakPosition: number;
  weeksOnChart: number;
  name: string;
  nameKo?: string;
  artistId: string;
  image?: string;
  trend: "up" | "down" | "same" | "new" | "re-entry";
  isFavorite?: boolean;
}

interface ArtistChartEntryProps {
  entry: ArtistEntry;
  isTop1?: boolean;
  accentColor?: string;
}

export default function ArtistChartEntry({
  entry,
  isTop1 = false,
  accentColor = "#22c55e" // Default green accent
}: ArtistChartEntryProps) {
  const getTrendIcon = () => {
    switch (entry.trend) {
      case "up":
        return <ArrowUp size={16} className="text-green-500" />;
      case "down":
        return <ArrowDown size={16} className="text-red-500" />;
      case "same":
        return <span className="text-gray-500 text-sm">—</span>;
      case "new":
        return (
          <span
            className="text-[10px] font-bold px-1 py-0.5 rounded"
            style={{ backgroundColor: accentColor, color: "#000" }}
          >
            NEW
          </span>
        );
      case "re-entry":
        return (
          <span
            className="text-[10px] font-bold px-1 py-0.5 rounded writing-vertical"
            style={{
              backgroundColor: accentColor,
              color: "#000",
              writingMode: "vertical-rl",
              textOrientation: "mixed"
            }}
          >
            RE-ENTRY
          </span>
        );
      default:
        return null;
    }
  };

  if (isTop1) {
    return (
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="flex items-stretch">
          {/* Rank */}
          <div
            className="w-20 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <span
              className="text-5xl font-black text-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              1
            </span>
          </div>

          {/* Image with RE-ENTRY tag */}
          <div className="relative flex-shrink-0">
            <div className="w-40 h-40 bg-[#1a1a1a]">
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                  {entry.name[0]}
                </div>
              )}
            </div>
            {entry.trend === "re-entry" && (
              <div
                className="absolute top-0 right-0 h-full w-6 flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <span
                  className="text-[10px] font-bold text-black"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed"
                  }}
                >
                  RE-ENTRY
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex items-center px-6">
            <div>
              <Link
                href={`/artists/${entry.artistId}`}
                className="text-2xl font-bold text-white hover:underline"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {entry.name}
              </Link>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {entry.nameKo || entry.name}
              </p>
            </div>
          </div>

          {/* Favorite */}
          <div className="flex items-center px-4">
            <Star
              size={20}
              className={entry.isFavorite ? "fill-[#a855f7] text-[#a855f7]" : "text-gray-600"}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 px-6">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase">LW</div>
              <div className="text-lg font-bold text-white">
                {entry.previousRank || "-"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase">PEAK</div>
              <div className="text-lg font-bold text-white">
                {entry.peakPosition}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase">WEEKS</div>
              <div className="text-lg font-bold text-white">
                {entry.weeksOnChart}
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex items-center px-4">
            <button className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:border-[#555] transition-colors">
              <Plus size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular entry (rank 2+)
  return (
    <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] hover:bg-[#151515] transition-colors">
      <div className="flex items-center py-4 px-4">
        {/* Rank */}
        <div className="w-12 flex-shrink-0 mr-4">
          <span
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {entry.rank}
          </span>
        </div>

        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0 mr-4 bg-[#1a1a1a]">
          {entry.image ? (
            <img
              src={entry.image}
              alt={entry.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
              {entry.name[0]}
            </div>
          )}
        </div>

        {/* Trend */}
        <div className="w-8 flex-shrink-0 mr-4 flex items-center justify-center">
          {getTrendIcon()}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/artists/${entry.artistId}`}
            className="text-lg font-bold text-white hover:underline block truncate"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {entry.name}
          </Link>
          <p className="text-gray-500 text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {entry.nameKo || entry.name}
          </p>
        </div>

        {/* Favorite */}
        <div className="flex items-center px-4">
          <Star
            size={18}
            className={entry.isFavorite ? "fill-[#a855f7] text-[#a855f7]" : "text-gray-600"}
          />
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right w-16">
            <div className="text-[10px] text-gray-500 uppercase">LW</div>
            <div className="text-sm font-bold text-white">
              {entry.previousRank || "-"}
            </div>
          </div>
          <div className="text-right w-16">
            <div className="text-[10px] text-gray-500 uppercase">PEAK</div>
            <div className="text-sm font-bold text-white">
              {entry.peakPosition}
            </div>
          </div>
          <div className="text-right w-16">
            <div className="text-[10px] text-gray-500 uppercase">WEEKS</div>
            <div className="text-sm font-bold text-white">
              {entry.weeksOnChart}
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex items-center pl-4">
          <button className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:border-[#555] transition-colors">
            <Plus size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
