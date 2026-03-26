/**
 * ChartWeekNav - Navigation between chart weeks
 */

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartWeekNavProps {
  currentWeek: string;
  weekLabel: string;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelectWeek?: () => void;
  className?: string;
}

export default function ChartWeekNav({
  currentWeek,
  weekLabel,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onSelectWeek,
  className,
}: ChartWeekNavProps) {
  return (
    <nav
      className={cn("flex items-center gap-2", className)}
      aria-label="チャート週ナビゲーション"
    >
      {/* Previous Week Button */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          hasPrevious
            ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
            : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
        )}
        aria-label="前週のチャートを表示"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {/* Week Display */}
      <button
        onClick={onSelectWeek}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        aria-label={`現在の週: ${formatWeekDate(currentWeek)}。週を選択`}
      >
        <Calendar size={14} className="text-[#a855f7]" aria-hidden="true" />
        <span
          className="text-sm text-white font-medium"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatWeekDate(currentWeek)}
        </span>
      </button>

      {/* Next Week Button */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          hasNext
            ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
            : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
        )}
        aria-label="次週のチャートを表示"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      {/* Week Label */}
      <span
        className="text-xs text-gray-500 ml-2 hidden sm:inline"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        aria-live="polite"
      >
        {weekLabel}
      </span>
    </nav>
  );
}

function formatWeekDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
