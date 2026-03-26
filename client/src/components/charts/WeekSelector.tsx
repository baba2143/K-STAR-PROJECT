/**
 * WeekSelector - Dropdown for selecting chart weeks
 */

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  weeks: string[];
  currentWeek: string;
  onSelectWeek: (week: string) => void;
  className?: string;
}

export default function WeekSelector({
  weeks,
  currentWeek,
  onSelectWeek,
  className,
}: WeekSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`週を選択: ${formatWeekDate(currentWeek)}`}
      >
        <Calendar size={16} className="text-[#a855f7]" aria-hidden="true" />
        <span
          className="text-sm text-white font-medium"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {formatWeekDate(currentWeek)}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 max-h-80 overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50"
          role="listbox"
          aria-label="利用可能な週"
        >
          <div className="p-2">
            <div
              className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Select Week
            </div>
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => {
                  onSelectWeek(week);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-left",
                  week === currentWeek
                    ? "bg-[#a855f7]/20 text-[#a855f7]"
                    : "text-gray-300 hover:bg-[#252525] hover:text-white"
                )}
                role="option"
                aria-selected={week === currentWeek}
              >
                <div>
                  <span
                    className="text-sm font-medium block"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {formatWeekDate(week)}
                  </span>
                  <span
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {formatWeekRange(week)}
                  </span>
                </div>
                {week === currentWeek && (
                  <Check size={16} className="text-[#a855f7]" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
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

function formatWeekRange(endDateStr: string): string {
  try {
    const endDate = new Date(endDateStr);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const startStr = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return `${startStr} - ${endStr}`;
  } catch {
    return endDateStr;
  }
}
