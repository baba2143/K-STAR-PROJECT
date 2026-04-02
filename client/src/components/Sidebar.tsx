/*
 * K-STAR PROJECT - Sidebar Component
 * Design: Neo-Brutalist × K-POP Culture
 * Dark sidebar with collapsible chart categories
 * Neon green active state indicators, DM Sans typography
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { sidebarCategories, kstarCharts, kstarArtistCharts, globalChampCharts } from "@/lib/chartData";

export default function Sidebar() {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["K-STAR CHART"]);

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const isChartActive = (path: string) => {
    return location.startsWith(path);
  };

  return (
    <aside className="w-full bg-[#0a0a0a] border-r border-[#1a1a1a] h-full overflow-y-auto">
      {/* Categories */}
      <nav className="py-1">
        {sidebarCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.label);
          const isKstarChart = category.label === "K-STAR CHART";
          const isKstarArtistChart = category.label === "K-STAR ARTIST CHART";
          const isGlobalChampChart = category.label === "GLOBAL CHAMP CHART";
          const hasChartItems = isKstarChart || isKstarArtistChart || isGlobalChampChart;
          const chartItems = isKstarChart
            ? kstarCharts
            : isKstarArtistChart
            ? kstarArtistCharts
            : isGlobalChampChart
            ? globalChampCharts
            : [];

          return (
            <div key={category.label}>
              <button
                onClick={() => toggleCategory(category.label)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#141414] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                <span>{category.label}</span>
                {isExpanded ? (
                  <ChevronDown size={13} className="text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronRight size={13} className="text-gray-600 flex-shrink-0" />
                )}
              </button>

              {/* Sub-items for K-STAR CHART, K-STAR ARTIST CHART, GLOBAL CHAMP CHART */}
              {isExpanded && hasChartItems && (
                <div className="bg-[#080808]">
                  {chartItems.map((chart) => {
                    const isActive = isChartActive(chart.path);

                    if (chart.comingSoon) {
                      return (
                        <button
                          key={chart.label}
                          onClick={() => toast(`${chart.label} — Coming soon`)}
                          className="w-full text-left px-5 py-2 text-xs transition-colors text-gray-500 hover:text-gray-200 hover:bg-[#141414] border-l-2 border-transparent"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {chart.label}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={chart.label}
                        href={chart.path}
                        className={`block w-full text-left px-5 py-2 text-xs transition-colors ${
                          isActive
                            ? "text-[#a855f7] font-semibold border-l-2 border-[#a855f7] bg-[#0d0d0d]"
                            : "text-gray-500 hover:text-gray-200 hover:bg-[#141414] border-l-2 border-transparent"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {chart.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Generic sub-items for other categories */}
              {isExpanded && !hasChartItems && (
                <div className="bg-[#080808] px-5 py-2.5 border-l-2 border-[#1a1a1a]">
                  <p className="text-xs text-gray-600 italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Charts coming soon
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
