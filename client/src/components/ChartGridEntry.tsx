/**
 * ChartGridEntry - Grid view card for chart entries
 */

import { Link } from "wouter";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import type { ChartEntry } from "@/lib/chartData";

interface ChartGridEntryProps {
  entry: ChartEntry & { songId?: string; artistId?: string };
  isTop3?: boolean;
}

export default function ChartGridEntry({ entry, isTop3 = false }: ChartGridEntryProps) {
  const { rank, title, artist, image, trend, isNew, songId } = entry;

  // Trend indicator
  const TrendIcon = () => {
    if (isNew) {
      return <Sparkles size={12} className="text-pink-400" />;
    }
    switch (trend) {
      case "up":
        return <TrendingUp size={12} className="text-green-400" />;
      case "down":
        return <TrendingDown size={12} className="text-red-400" />;
      default:
        return <Minus size={12} className="text-gray-500" />;
    }
  };

  const content = (
    <div
      className={`group relative bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#222] transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
        isTop3 ? "ring-1 ring-[#a855f7]/30" : ""
      }`}
    >
      {/* Cover Image */}
      <div className="relative aspect-square">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center">
            <span className="text-4xl text-gray-600">
              {title?.[0] || "?"}
            </span>
          </div>
        )}

        {/* Rank Badge */}
        <div
          className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded font-bold text-sm ${
            rank === 1
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black"
              : rank === 2
              ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black"
              : rank === 3
              ? "bg-gradient-to-br from-orange-400 to-orange-600 text-black"
              : "bg-black/70 text-white"
          }`}
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          {rank}
        </div>

        {/* Trend Badge */}
        <div className="absolute top-2 right-2 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-1">
          <TrendIcon />
          {isNew && (
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
          {title}
        </h3>
        <p
          className="text-gray-400 text-xs truncate mt-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {artist}
        </p>
      </div>
    </div>
  );

  // Wrap with Link if songId exists
  if (songId) {
    return (
      <Link href={`/songs/${songId}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
