/**
 * ChartTypeSelector - Tab navigation for switching between chart types
 */

import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import type { ChartType } from "@/lib/types";

interface ChartTypeOption {
  type: ChartType;
  label: string;
  labelJa: string;
  path: string;
}

const chartTypes: ChartTypeOption[] = [
  { type: "songs", label: "TOP 100", labelJa: "楽曲", path: "/charts/songs" },
  { type: "albums", label: "ALBUMS", labelJa: "アルバム", path: "/charts/albums" },
  { type: "artists", label: "ARTISTS", labelJa: "アーティスト", path: "/charts/artists" },
  { type: "streaming", label: "STREAMING", labelJa: "ストリーミング", path: "/charts/streaming" },
];

interface ChartTypeSelectorProps {
  className?: string;
}

export default function ChartTypeSelector({ className }: ChartTypeSelectorProps) {
  const [location] = useLocation();

  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto pb-1", className)}>
      {chartTypes.map((chart) => {
        const isActive = location === chart.path ||
          (location === "/" && chart.type === "songs");

        return (
          <Link
            key={chart.type}
            href={chart.path}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-[#00d4ff] via-[#a855f7] to-[#ec4899] text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {chart.label}
          </Link>
        );
      })}
    </div>
  );
}
