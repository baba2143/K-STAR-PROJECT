/*
 * K-STAR PROJECT - Sidebar Component
 * Design: Neo-Brutalist × K-POP Culture
 * Dark sidebar with collapsible chart categories
 * Neon green active state indicators, DM Sans typography
 *
 * Data source: Supabase (sidebar_categories, sidebar_chart_items tables)
 * Falls back to static data if DB is unavailable
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loadSidebarCategories, type SidebarCategoryWithItems } from "@/lib/api";
import { sidebarCategories as fallbackCategories, kstarCharts, kstarArtistCharts, globalChampCharts } from "@/lib/chartData";

// Fallback data structure for when DB is unavailable
const getFallbackData = (): SidebarCategoryWithItems[] => [
  {
    id: "kstar-chart",
    label: "K-STAR CHART",
    sortOrder: 0,
    isActive: true,
    items: kstarCharts.map((chart, idx) => ({
      id: `kstar-${idx}`,
      categoryId: "kstar-chart",
      label: chart.label,
      path: chart.path,
      chartType: chart.path.split('/').pop() || 'weekly',
      sortOrder: idx,
      isActive: true,
      comingSoon: !chart.active,
    })),
  },
  {
    id: "kstar-artist-chart",
    label: "K-STAR ARTIST CHART",
    sortOrder: 1,
    isActive: true,
    items: kstarArtistCharts.map((chart, idx) => ({
      id: `artist-${idx}`,
      categoryId: "kstar-artist-chart",
      label: chart.label,
      path: chart.path,
      chartType: chart.path.split('/').pop() || 'rookie',
      sortOrder: idx,
      isActive: true,
      comingSoon: !chart.active,
    })),
  },
  {
    id: "global-champ-chart",
    label: "GLOBAL CHAMP CHART",
    sortOrder: 2,
    isActive: true,
    items: globalChampCharts.map((chart, idx) => ({
      id: `global-${idx}`,
      categoryId: "global-champ-chart",
      label: chart.label,
      path: chart.path,
      chartType: chart.path.split('/').pop() || 'global-mv',
      sortOrder: idx,
      isActive: true,
      comingSoon: !chart.active,
    })),
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["K-STAR CHART"]);
  const [categories, setCategories] = useState<SidebarCategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await loadSidebarCategories();
        if (data.length > 0) {
          setCategories(data);
        } else {
          // Fall back to static data if DB is empty
          setCategories(getFallbackData());
        }
      } catch (error) {
        console.error('Failed to load sidebar categories:', error);
        // Fall back to static data on error
        setCategories(getFallbackData());
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const isChartActive = (path: string) => {
    return location.startsWith(path);
  };

  if (loading) {
    return (
      <aside className="w-full bg-[#0a0a0a] border-r border-[#1a1a1a] h-full flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      </aside>
    );
  }

  return (
    <aside className="w-full bg-[#0a0a0a] border-r border-[#1a1a1a] h-full overflow-y-auto">
      {/* Categories */}
      <nav className="py-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.label);
          const hasChartItems = category.items.length > 0;

          return (
            <div key={category.id}>
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

              {/* Chart items */}
              {isExpanded && hasChartItems && (
                <div className="bg-[#080808]">
                  {category.items.map((chart) => {
                    const isActive = isChartActive(chart.path);

                    if (chart.comingSoon) {
                      return (
                        <button
                          key={chart.id}
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
                        key={chart.id}
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

              {/* Empty category message */}
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
