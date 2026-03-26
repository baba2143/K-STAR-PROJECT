/**
 * ChartHero - Hero section for chart pages
 * Displays chart type title and featured entries
 */

import { cn } from "@/lib/utils";
import type { ChartType } from "@/lib/types";

interface ChartHeroProps {
  chartType: ChartType;
  title: string;
  subtitle?: string;
  className?: string;
}

const chartColors: Record<ChartType, { from: string; to: string }> = {
  songs: { from: "#00d4ff", to: "#a855f7" },
  albums: { from: "#a855f7", to: "#ec4899" },
  artists: { from: "#ec4899", to: "#f97316" },
  streaming: { from: "#00d4ff", to: "#22c55e" },
  digital: { from: "#3b82f6", to: "#00d4ff" },
  physical: { from: "#f97316", to: "#eab308" },
};

export default function ChartHero({
  chartType,
  title,
  subtitle,
  className,
}: ChartHeroProps) {
  const colors = chartColors[chartType];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]",
        className
      )}
    >
      {/* Gradient background decoration */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, ${colors.from}40, transparent 50%), radial-gradient(ellipse at 30% 70%, ${colors.to}40, transparent 50%)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${colors.from}20 1px, transparent 1px), linear-gradient(90deg, ${colors.from}20 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-4 mb-3">
          <img
            src="/logo.png"
            alt="K-STAR"
            className="h-10 sm:h-12 w-auto"
          />
          <div>
            <h1
              className="font-black uppercase leading-none"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                letterSpacing: "0.05em",
                background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-gray-400 text-sm mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
