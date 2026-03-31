/*
 * K-STAR PROJECT - ChartEntry Component
 * Design: Neo-Brutalist × K-POP Culture
 * Each chart row: rank number, trend arrow, album art, song info, stats
 * Large rank, trend arrow, album art, stats display
 */

import { useState } from "react";
import { Link } from "wouter";
import { ArrowUp, ArrowDown, Minus, Star, Plus, ChevronUp, Play, ArrowRight } from "lucide-react";
import type { ChartEntry as ChartEntryType } from "@/lib/chartData";
import { toast } from "sonner";

interface ChartEntryProps {
  entry: ChartEntryType & {
    songId?: string;
    artistId?: string;
    spotifyId?: string;
    coverImage?: string;
  };
  isTop10?: boolean;
}

function TrendIcon({ trend }: { trend: ChartEntryType["trend"] }) {
  switch (trend) {
    case "up":
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <ArrowUp size={13} className="text-[#00d4ff]" strokeWidth={2.5} />
        </div>
      );
    case "down":
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <ArrowDown size={13} className="text-[#ff4444]" strokeWidth={2.5} />
        </div>
      );
    case "new":
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <span className="text-[9px] font-black text-[#ec4899] tracking-wider leading-none">NEW</span>
        </div>
      );
    case "re-entry":
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <span className="text-[9px] font-black text-yellow-400 tracking-wider leading-none">RE</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <Minus size={12} className="text-gray-600" strokeWidth={2.5} />
        </div>
      );
  }
}

export default function ChartEntry({ entry, isTop10 = false }: ChartEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const [starred, setStarred] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Use coverImage from JSON data (pre-fetched via server script)
  const albumArt = entry.coverImage || entry.image || null;

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStarred(!starred);
    toast(starred ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`relative border-b border-[#1a1a1a] transition-all duration-300 ease-out overflow-hidden ${
        isHovered ? "bg-transparent" : "hover:bg-[#111]"
      } focus-within:bg-[#111] chart-entry-hover`}
      aria-label={`ランク${entry.rank}: ${entry.title} by ${entry.artist}`}
    >
      {/* Hover Background Image */}
      {isHovered && albumArt && (
        <div className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-300">
          <img
            src={albumArt}
            alt=""
            className="w-full h-full object-cover scale-125 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
        </div>
      )}

      {/* Main row */}
      <div className={`relative z-10 flex items-center gap-0 px-3 sm:px-5 transition-all duration-300 ${
        isHovered ? "py-5" : "py-2.5"
      }`}>

        {/* Rank number - gradient box for top 10, plain number otherwise */}
        <div className="flex-shrink-0 w-12 flex items-center justify-center mr-2">
          {isTop10 ? (
            <div
              className="w-10 h-10 flex items-center justify-center text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #a855f7, #ec4899)",
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              {entry.rank}
            </div>
          ) : (
            <span
              className="text-white font-bold"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              {entry.rank}
            </span>
          )}
        </div>

        {/* Trend indicator */}
        <div className="flex-shrink-0 w-5 mr-2">
          <TrendIcon trend={entry.trend} />
        </div>

        {/* Album art */}
        <div className={`relative flex-shrink-0 mr-3 overflow-hidden bg-[#1a1a1a] transition-all duration-300 ${
          isHovered ? "w-14 h-14" : "w-11 h-11"
        }`}>
          {albumArt ? (
            <img
              src={albumArt}
              alt={`${entry.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#222] flex items-center justify-center text-gray-600 text-xs">
              ♪
            </div>
          )}
          {/* Play overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-200">
              <Play size={20} className="text-white" fill="white" />
            </div>
          )}
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0 mr-4">
          {entry.songId ? (
            <Link
              href={`/songs/${entry.songId}`}
              className="text-white font-bold leading-tight truncate block hover:text-[#a855f7] transition-colors"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 700,
              }}
            >
              {entry.title}
            </Link>
          ) : (
            <h3
              className="text-white font-bold leading-tight truncate"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 700,
              }}
            >
              {entry.title}
            </h3>
          )}
          {isHovered && entry.artistId ? (
            <Link
              href={`/artists/${entry.artistId}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 bg-[#1a1a1a]/80 text-[#00d4ff] rounded-full text-xs font-medium hover:bg-[#252525] transition-colors"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {entry.artist}
              <ArrowRight size={10} />
            </Link>
          ) : entry.artistId ? (
            <Link
              href={`/artists/${entry.artistId}`}
              className="text-gray-400 truncate mt-0.5 block hover:text-[#00d4ff] transition-colors"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {entry.artist}
            </Link>
          ) : (
            <p
              className="text-gray-400 truncate mt-0.5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {entry.artist}
            </p>
          )}
        </div>

        {/* Stats - hidden on small screens */}
        <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
          <div className="text-center w-10">
            <div
              className="text-gray-500 uppercase mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", fontWeight: 700 }}
            >
              LW
            </div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", lineHeight: 1 }}
            >
              {entry.lastWeek ?? "—"}
            </div>
          </div>
          <div className="text-center w-10">
            <div
              className="text-gray-500 uppercase mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", fontWeight: 700 }}
            >
              PEAK
            </div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", lineHeight: 1 }}
            >
              {entry.peakPosition}
            </div>
          </div>
          <div className="text-center w-12">
            <div
              className="text-gray-500 uppercase mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", fontWeight: 700 }}
            >
              WEEKS
            </div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", lineHeight: 1 }}
            >
              {entry.weeksOnChart}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleStar}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
              starred
                ? "text-[#ec4899]"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            <Star size={14} fill={starred ? "#ec4899" : "none"} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-400 transition-colors border border-[#2a2a2a] hover:border-[#444]"
          >
            {expanded ? <ChevronUp size={13} /> : <Plus size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 bg-[#0d0d0d] border-t border-[#1a1a1a]">
          <div className="flex items-start gap-4 pt-4">
            {/* Larger album art */}
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
              {albumArt ? (
                <img
                  src={albumArt}
                  alt={`${entry.title} album art`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#222]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className="text-white font-bold text-base"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {entry.title}
              </h4>
              <p
                className="text-gray-400 text-xs uppercase tracking-wider mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em" }}
              >
                {entry.artist}
              </p>

              {/* Mobile stats */}
              <div className="flex items-center gap-6 mt-3 sm:hidden">
                {[
                  { label: "Last Week", value: entry.lastWeek ?? "—" },
                  { label: "Peak", value: entry.peakPosition },
                  { label: "Weeks", value: entry.weeksOnChart },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                      {label}
                    </div>
                    <div
                      className="text-white font-bold text-lg"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {entry.peakPosition === 1 && (
                  <span
                    className="text-[10px] font-bold text-white px-2 py-0.5 tracking-wider uppercase"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                    }}
                  >
                    ★ Reached #1
                  </span>
                )}
                {entry.weeksOnChart >= 20 && (
                  <span
                    className="text-[10px] font-bold text-[#a855f7] border border-[#a855f7] px-2 py-0.5 tracking-wider uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {entry.weeksOnChart} Weeks
                  </span>
                )}
                {entry.isNew && (
                  <span
                    className="text-[10px] font-bold text-white px-2 py-0.5 tracking-wider uppercase"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: "linear-gradient(90deg, #ec4899, #a855f7)",
                    }}
                  >
                    New Entry
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
