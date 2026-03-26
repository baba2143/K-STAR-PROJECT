/**
 * ChartArchive - Browse past chart weeks
 */

import { Link } from "wouter";
import { Calendar, Music, Disc3, Users, ChevronRight } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { useAvailableWeeks } from "@/hooks/useChartData";
import { cn } from "@/lib/utils";

type ChartType = "songs" | "albums" | "artists";

const CHART_TYPES: { id: ChartType; label: string; icon: typeof Music; color: string }[] = [
  { id: "songs", label: "楽曲チャート", icon: Music, color: "from-[#a855f7] to-[#ec4899]" },
  { id: "albums", label: "アルバムチャート", icon: Disc3, color: "from-[#00d4ff] to-[#a855f7]" },
  { id: "artists", label: "アーティストチャート", icon: Users, color: "from-[#ec4899] to-[#f97316]" },
];

export default function ChartArchive() {
  return (
    <ChartLayout>
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] px-4 sm:px-6 py-12 border-b border-[#1a1a1a]">
        <div className="max-w-4xl">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            CHART ARCHIVE
          </h1>
          <p
            className="text-gray-400 text-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            過去のチャートを閲覧できます
          </p>
        </div>
      </section>

      {/* Chart Type Sections */}
      <div className="bg-[#0f0f0f] px-4 sm:px-6 py-8 space-y-12">
        {CHART_TYPES.map((chartType) => (
          <ChartTypeSection key={chartType.id} {...chartType} />
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-[#1a1a1a] px-4 sm:px-6 py-8">
        <p
          className="text-gray-600 text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          © 2026 K-STAR PROJECT. All rights reserved.
        </p>
      </footer>
    </ChartLayout>
  );
}

interface ChartTypeSectionProps {
  id: ChartType;
  label: string;
  icon: typeof Music;
  color: string;
}

function ChartTypeSection({ id, label, icon: Icon, color }: ChartTypeSectionProps) {
  const { data: weeks, loading } = useAvailableWeeks(id);

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded bg-gradient-to-r",
            color
          )}
        >
          <Icon size={20} className="text-white" />
        </div>
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
        >
          {label}
        </h2>
        <Link
          href={`/charts/${id}`}
          className="ml-auto text-sm text-[#a855f7] hover:text-[#c084fc] flex items-center gap-1 transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          最新を見る
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Weeks Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-[#1a1a1a] rounded animate-pulse"
            />
          ))}
        </div>
      ) : weeks && weeks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {weeks.map((week, index) => (
            <WeekCard
              key={week}
              week={week}
              chartType={id}
              isLatest={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          利用可能なチャートデータがありません
        </div>
      )}
    </section>
  );
}

interface WeekCardProps {
  week: string;
  chartType: ChartType;
  isLatest: boolean;
}

function WeekCard({ week, chartType, isLatest }: WeekCardProps) {
  const { month, day, year, weekRange } = formatWeekInfo(week);

  return (
    <Link
      href={`/charts/${chartType}/${week}`}
      className={cn(
        "block p-4 rounded bg-[#1a1a1a] hover:bg-[#252525] transition-colors group",
        isLatest && "ring-1 ring-[#a855f7]"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            {month} {day}
          </div>
          <div
            className="text-xs text-gray-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {year}
          </div>
        </div>
        {isLatest && (
          <span
            className="text-[9px] font-bold text-[#a855f7] px-1.5 py-0.5 bg-[#a855f7]/20 rounded"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            LATEST
          </span>
        )}
      </div>
      <div
        className="text-xs text-gray-400 mt-2 flex items-center gap-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <Calendar size={12} />
        {weekRange}
      </div>
    </Link>
  );
}

function formatWeekInfo(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 6);

    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const startStr = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      month,
      day,
      year,
      weekRange: `${startStr} - ${endStr}`,
    };
  } catch {
    return {
      month: "",
      day: "",
      year: "",
      weekRange: dateStr,
    };
  }
}
