// K-STAR PROJECT Chart History
// Generate historical chart data for multiple weeks

import type { ChartEntry } from "./chartData";
import { hot100Data } from "./chartData";

export interface ChartWeek {
  date: Date;
  dateString: string;
  weekLabel: string;
  entries: ChartEntry[];
}

/**
 * Generate chart data for a specific week
 * Simulates historical data by shuffling and modifying ranks
 */
function generateChartForWeek(baseDate: Date): ChartEntry[] {
  const seed = baseDate.getTime();
  
  // Simple seeded random for consistency
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  return hot100Data.map((entry, index) => {
    const randomShift = Math.floor(seededRandom(index) * 6) - 3; // -3 to +3
    const newRank = Math.max(1, Math.min(100, entry.rank + randomShift));
    
    const trend: "up" | "down" | "same" | "new" | "re-entry" = 
      randomShift > 0 ? "up" : randomShift < 0 ? "down" : "same";
    
    return {
      ...entry,
      rank: newRank,
      lastWeek: entry.rank,
      trend,
    };
  }).sort((a, b) => a.rank - b.rank);
}

/**
 * Get chart data for a specific date
 * Charts are dated for the Saturday of each week
 */
export function getChartForDate(date: Date): ChartWeek {
  // Ensure date is a Saturday (chart date)
  const chartDate = new Date(date);
  const dayOfWeek = chartDate.getDay();
  const daysToSaturday = 6 - dayOfWeek;
  chartDate.setDate(chartDate.getDate() + daysToSaturday);

  const dateString = chartDate.toISOString().split("T")[0];
  const weekLabel = `Week of ${chartDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;

  return {
    date: chartDate,
    dateString,
    weekLabel,
    entries: generateChartForWeek(chartDate),
  };
}

/**
 * Get the previous week's chart
 */
export function getPreviousWeek(date: Date): ChartWeek {
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 7);
  return getChartForDate(prevDate);
}

/**
 * Get the next week's chart
 */
export function getNextWeek(date: Date): ChartWeek {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 7);
  return getChartForDate(nextDate);
}

/**
 * Get a range of weeks for date picker
 */
export function getWeekRange(centerDate: Date, weeksAround: number = 26): ChartWeek[] {
  const weeks: ChartWeek[] = [];
  const startDate = new Date(centerDate);
  startDate.setDate(startDate.getDate() - weeksAround * 7);

  for (let i = 0; i <= weeksAround * 2; i++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(weekDate.getDate() + i * 7);
    weeks.push(getChartForDate(weekDate));
  }

  return weeks;
}

/**
 * Format date for display in header
 */
export function formatChartDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get current Saturday (this week's chart)
 */
export function getCurrentChartDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToSaturday = 6 - dayOfWeek;
  const chartDate = new Date(today);
  chartDate.setDate(chartDate.getDate() + daysToSaturday);
  return chartDate;
}
