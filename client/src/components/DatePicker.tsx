/*
 * K-STAR PROJECT - Date Picker Component
 * Design: Neo-Brutalist × K-POP Culture
 * Allows navigation between weeks to view historical chart data
 */

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { getWeekRange, formatChartDate, type ChartWeek } from "@/lib/chartHistory";

interface DatePickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ currentDate, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [weeks, setWeeks] = useState<ChartWeek[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate weeks around current date
    const generatedWeeks = getWeekRange(currentDate, 26);
    setWeeks(generatedWeeks);
  }, [currentDate]);

  useEffect(() => {
    // Close picker when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handlePreviousWeek = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 7);
    onDateChange(prevDate);
  };

  const handleNextWeek = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 7);
    onDateChange(nextDate);
  };

  const handleWeekSelect = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const currentDateString = currentDate.toISOString().split("T")[0];
  const displayDate = formatChartDate(currentDate);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Date display button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest uppercase text-white border border-[#444] hover:border-[#a855f7] transition-colors"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <Calendar size={13} />
        <span>{displayDate}</span>
        <X size={12} className={`transition-transform ${isOpen ? "rotate-45" : ""}`} />
      </button>

      {/* Dropdown picker */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#0a0a0a] border border-[#444] shadow-lg z-50 w-72">
          {/* Header with navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
            <button
              onClick={handlePreviousWeek}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              title="Previous week"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              className="text-xs font-bold tracking-widest text-center text-[#a855f7]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {displayDate}
            </div>
            <button
              onClick={handleNextWeek}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              title="Next week"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Week list */}
          <div className="max-h-64 overflow-y-auto scrollbar-hide">
            {weeks.map((week) => {
              const isSelected = week.dateString === currentDateString;
              return (
                <button
                  key={week.dateString}
                  onClick={() => handleWeekSelect(week.date)}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-l-2 ${
                    isSelected
                      ? "bg-[#1a1a1a] text-[#a855f7] border-l-[#a855f7] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-[#111] border-l-transparent"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <div className="font-bold">{week.weekLabel}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{week.dateString}</div>
                </button>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="px-4 py-2 border-t border-[#1a1a1a] bg-[#080808]">
            <p
              className="text-[10px] text-gray-600"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Showing 52 weeks of chart history
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
