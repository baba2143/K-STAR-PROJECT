// K-STAR PROJECT Chart Data
// Chart dated: March 22, 2025
// Data source: Static JSON files in /data directory

// Re-export types from central types file
export type { TrendDirection, ChartType, SongChartEntry } from './types';

/**
 * Legacy ChartEntry interface for backward compatibility
 * Maps to the UI component props
 */
export interface ChartEntry {
  rank: number;
  lastWeek: number | null;
  peakPosition: number;
  weeksOnChart: number;
  title: string;
  artist: string;
  trend: "up" | "down" | "same" | "new" | "re-entry";
  image?: string;
  isNew?: boolean;
}

/**
 * K-STAR TOP 100 Chart Data
 * Based on K-POP song chart for 2025-03-22
 */
export const hot100Data: ChartEntry[] = [
  { rank: 1, lastWeek: 2, peakPosition: 1, weeksOnChart: 8, title: "Supernatural", artist: "NewJeans", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273a10b8c7a5e8c7d6e5f4a3b2c" },
  { rank: 2, lastWeek: 1, peakPosition: 1, weeksOnChart: 22, title: "APT.", artist: "ROSÉ & Bruno Mars", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273c10d8e7a5e8c7d6e5f4a3b2c" },
  { rank: 3, lastWeek: null, peakPosition: 3, weeksOnChart: 1, title: "Magnetic", artist: "ILLIT", trend: "new", isNew: true, image: "https://i.scdn.co/image/ab67616d0000b273d10e8f7a5e8c7d6e5f4a3b2c" },
  { rank: 4, lastWeek: 3, peakPosition: 1, weeksOnChart: 18, title: "Supernova", artist: "aespa", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273e10f8a7b5e8c7d6e5f4a3b2c" },
  { rank: 5, lastWeek: 4, peakPosition: 2, weeksOnChart: 12, title: "SUPER", artist: "SEVENTEEN", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273c13d8e7f5e8c7d6e5f4a3b2c" },
  { rank: 6, lastWeek: 5, peakPosition: 1, weeksOnChart: 25, title: "CRAZY", artist: "LE SSERAFIM", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273e15f8a7b5e8c7d6e5f4a3b2c" },
  { rank: 7, lastWeek: 8, peakPosition: 3, weeksOnChart: 10, title: "Whiplash", artist: "aespa", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273f10a8b7c5e8c7d6e5f4a3b2c" },
  { rank: 8, lastWeek: 6, peakPosition: 1, weeksOnChart: 15, title: "HEYA", artist: "IVE", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b12c8d7e5e8c7d6e5f4a3b2c" },
  { rank: 9, lastWeek: 7, peakPosition: 2, weeksOnChart: 20, title: "Who", artist: "Jimin", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a17b8c7d5e8c7d6e5f4a3b2c" },
  { rank: 10, lastWeek: 9, peakPosition: 4, weeksOnChart: 14, title: "Chk Chk Boom", artist: "Stray Kids", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273f16a8b7c5e8c7d6e5f4a3b2c" },
  { rank: 11, lastWeek: 10, peakPosition: 5, weeksOnChart: 18, title: "Super Lady", artist: "(G)I-DLE", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273d1ae8f7a5e8c7d6e5f4a3b2c" },
  { rank: 12, lastWeek: 14, peakPosition: 6, weeksOnChart: 8, title: "Fate", artist: "(G)I-DLE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273e1bf8a7b5e8c7d6e5f4a3b2c" },
  { rank: 13, lastWeek: 11, peakPosition: 1, weeksOnChart: 45, title: "How Sweet", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b10c8d7a5e8c7d6e5f4a3b2c" },
  { rank: 14, lastWeek: 12, peakPosition: 3, weeksOnChart: 52, title: "Standing Next to You", artist: "Jung Kook", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b18c8d7e5e8c7d6e5f4a3b2c" },
  { rank: 15, lastWeek: 13, peakPosition: 8, weeksOnChart: 10, title: "Strategy", artist: "TWICE", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273c19d8e7f5e8c7d6e5f4a3b2c" },
  { rank: 16, lastWeek: 18, peakPosition: 7, weeksOnChart: 12, title: "Boom Boom Bass", artist: "RIIZE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273a1db8c7d5e8c7d6e5f4a3b2c" },
  { rank: 17, lastWeek: 15, peakPosition: 5, weeksOnChart: 16, title: "XO (Only If You Say Yes)", artist: "ENHYPEN", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b1ec8d7e5e8c7d6e5f4a3b2c" },
  { rank: 18, lastWeek: 16, peakPosition: 9, weeksOnChart: 14, title: "Smoothie", artist: "NCT DREAM", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273f1ca8b7c5e8c7d6e5f4a3b2c" },
  { rank: 19, lastWeek: 17, peakPosition: 10, weeksOnChart: 30, title: "Baddie", artist: "IVE", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a11b8c7d5e8c7d6e5f4a3b2c" },
  { rank: 20, lastWeek: 19, peakPosition: 12, weeksOnChart: 42, title: "Perfect Night", artist: "LE SSERAFIM", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273d14e8f7a5e8c7d6e5f4a3b2c" },
  { rank: 21, lastWeek: 20, peakPosition: 15, weeksOnChart: 38, title: "ETA", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a10b8c7a5e8c7d6e5f4a3b2c" },
  { rank: 22, lastWeek: 22, peakPosition: 11, weeksOnChart: 28, title: "I AM", artist: "IVE", trend: "same", image: "https://i.scdn.co/image/ab67616d0000b273b12c8d7e5e8c7d6e5f4a3b2c" },
  { rank: 23, lastWeek: 25, peakPosition: 13, weeksOnChart: 22, title: "Drama", artist: "aespa", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273e10f8a7b5e8c7d6e5f4a3b2c" },
  { rank: 24, lastWeek: 23, peakPosition: 6, weeksOnChart: 35, title: "GODS", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b10c8d7a5e8c7d6e5f4a3b2c" },
  { rank: 25, lastWeek: 24, peakPosition: 14, weeksOnChart: 25, title: "Seven", artist: "Jung Kook ft. Latto", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b18c8d7e5e8c7d6e5f4a3b2c" },
  { rank: 26, lastWeek: 28, peakPosition: 16, weeksOnChart: 18, title: "Queencard", artist: "(G)I-DLE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273d1ae8f7a5e8c7d6e5f4a3b2c" },
  { rank: 27, lastWeek: 27, peakPosition: 17, weeksOnChart: 32, title: "ANTIFRAGILE", artist: "LE SSERAFIM", trend: "same", image: "https://i.scdn.co/image/ab67616d0000b273e15f8a7b5e8c7d6e5f4a3b2c" },
  { rank: 28, lastWeek: 26, peakPosition: 9, weeksOnChart: 42, title: "Ditto", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a10b8c7a5e8c7d6e5f4a3b2c" },
  { rank: 29, lastWeek: 30, peakPosition: 18, weeksOnChart: 15, title: "Night Dancer", artist: "imase", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273f10a8b7c5e8c7d6e5f4a3b2c" },
  { rank: 30, lastWeek: 29, peakPosition: 19, weeksOnChart: 28, title: "S-Class", artist: "Stray Kids", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273f16a8b7c5e8c7d6e5f4a3b2c" },
  { rank: 31, lastWeek: 33, peakPosition: 20, weeksOnChart: 20, title: "UNFORGIVEN", artist: "LE SSERAFIM", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273e15f8a7b5e8c7d6e5f4a3b2c" },
  { rank: 32, lastWeek: 31, peakPosition: 7, weeksOnChart: 50, title: "OMG", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273b10c8d7a5e8c7d6e5f4a3b2c" },
  { rank: 33, lastWeek: 32, peakPosition: 21, weeksOnChart: 35, title: "Super Shy", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a10b8c7a5e8c7d6e5f4a3b2c" },
  { rank: 34, lastWeek: 36, peakPosition: 22, weeksOnChart: 25, title: "Like Crazy", artist: "Jimin", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273a17b8c7d5e8c7d6e5f4a3b2c" },
  { rank: 35, lastWeek: 34, peakPosition: 23, weeksOnChart: 30, title: "Cupid", artist: "FIFTY FIFTY", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273c10d8e7a5e8c7d6e5f4a3b2c" },
  { rank: 36, lastWeek: 35, peakPosition: 15, weeksOnChart: 40, title: "Dynamite", artist: "BTS", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273d642648235ebf3460d2d1f6a" },
  { rank: 37, lastWeek: 38, peakPosition: 24, weeksOnChart: 18, title: "Kitsch", artist: "IVE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273b12c8d7e5e8c7d6e5f4a3b2c" },
  { rank: 38, lastWeek: 37, peakPosition: 12, weeksOnChart: 55, title: "Butter", artist: "BTS", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273d642648235ebf3460d2d1f6a" },
  { rank: 39, lastWeek: 40, peakPosition: 25, weeksOnChart: 22, title: "Talk Saxy", artist: "RIIZE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273a1db8c7d5e8c7d6e5f4a3b2c" },
  { rank: 40, lastWeek: 39, peakPosition: 8, weeksOnChart: 48, title: "Hype Boy", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a10b8c7a5e8c7d6e5f4a3b2c" },
  { rank: 41, lastWeek: 42, peakPosition: 26, weeksOnChart: 20, title: "Tomboy", artist: "(G)I-DLE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273d1ae8f7a5e8c7d6e5f4a3b2c" },
  { rank: 42, lastWeek: 41, peakPosition: 18, weeksOnChart: 42, title: "Pink Venom", artist: "BLACKPINK", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b2734d5e6f7a8b9c0d1e2f3a4b5c" },
  { rank: 43, lastWeek: 45, peakPosition: 27, weeksOnChart: 16, title: "Back Door", artist: "Stray Kids", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273f16a8b7c5e8c7d6e5f4a3b2c" },
  { rank: 44, lastWeek: 43, peakPosition: 10, weeksOnChart: 50, title: "Kill This Love", artist: "BLACKPINK", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b2734d5e6f7a8b9c0d1e2f3a4b5c" },
  { rank: 45, lastWeek: 44, peakPosition: 28, weeksOnChart: 25, title: "LALALALA", artist: "Stray Kids", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273f16a8b7c5e8c7d6e5f4a3b2c" },
  { rank: 46, lastWeek: 47, peakPosition: 29, weeksOnChart: 18, title: "Candy", artist: "NCT DREAM", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273f1ca8b7c5e8c7d6e5f4a3b2c" },
  { rank: 47, lastWeek: 46, peakPosition: 16, weeksOnChart: 45, title: "Attention", artist: "NewJeans", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273a10b8c7a5e8c7d6e5f4a3b2c" },
  { rank: 48, lastWeek: 50, peakPosition: 30, weeksOnChart: 14, title: "Impossible", artist: "RIIZE", trend: "up", image: "https://i.scdn.co/image/ab67616d0000b273a1db8c7d5e8c7d6e5f4a3b2c" },
  { rank: 49, lastWeek: 48, peakPosition: 20, weeksOnChart: 38, title: "How You Like That", artist: "BLACKPINK", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b2734d5e6f7a8b9c0d1e2f3a4b5c" },
  { rank: 50, lastWeek: 49, peakPosition: 22, weeksOnChart: 32, title: "Savage", artist: "aespa", trend: "down", image: "https://i.scdn.co/image/ab67616d0000b273e10f8a7b5e8c7d6e5f4a3b2c" },
];

export const sidebarCategories = [
  { label: "Top Charts", hasChildren: true, active: false },
  { label: "ボーイズグループ", hasChildren: true, active: false },
  { label: "ガールズグループ", hasChildren: true, active: false },
  { label: "ソロアーティスト", hasChildren: true, active: false },
  { label: "新人", hasChildren: true, active: false },
  { label: "事務所別", hasChildren: true, active: false },
  { label: "年間チャート", hasChildren: true, active: false },
  { label: "殿堂入り", hasChildren: true, active: false },
];

export const topCharts = [
  { label: "K-STAR TOP 100", path: "/charts/songs", active: true },
  { label: "アルバムチャート", path: "/charts/albums", active: false },
  { label: "アーティストチャート", path: "/charts/artists", active: false },
  { label: "チャートアーカイブ", path: "/charts/archive", active: false },
  { label: "ストリーミング", path: "/charts/streaming", active: false, comingSoon: true },
  { label: "デジタルセールス", path: "/charts/digital", active: false, comingSoon: true },
  { label: "フィジカルセールス", path: "/charts/physical", active: false, comingSoon: true },
];
