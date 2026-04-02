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
  coverImage?: string;
  spotifyId?: string;
  isNew?: boolean;
}

/**
 * K-STAR TOP 100 Chart Data
 * Based on K-POP song chart for 2025-03-22
 */
export const hot100Data: ChartEntry[] = [
  { rank: 1, lastWeek: 2, peakPosition: 1, weeksOnChart: 8, title: "Supernatural", artist: "NewJeans", trend: "up", spotifyId: "1CPZ5BxNNd0n0nF4Orb9JS", coverImage: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024dcb6c5df15cf74596ab25a4" },
  { rank: 2, lastWeek: 1, peakPosition: 1, weeksOnChart: 22, title: "APT.", artist: "ROSÉ & Bruno Mars", trend: "down", spotifyId: "4g5eopb54XIaV2ciooY3St", coverImage: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ba4fa604f046ff824331f4f4" },
  { rank: 3, lastWeek: null, peakPosition: 3, weeksOnChart: 1, title: "Magnetic", artist: "ILLIT", trend: "new", isNew: true, spotifyId: "5H1sKFMzDeMtXwND3V6hRY", coverImage: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026224d1236b0e0a0e1586efbb" },
  { rank: 4, lastWeek: 3, peakPosition: 1, weeksOnChart: 18, title: "Supernova", artist: "aespa", trend: "down", spotifyId: "1xOqGUkyxGQRdCvGpvWKmL", coverImage: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02f8d4d00ffe09373efb13ce29" },
  { rank: 5, lastWeek: 4, peakPosition: 2, weeksOnChart: 12, title: "SUPER", artist: "SEVENTEEN", trend: "down", spotifyId: "3sLiDI1uLpOttqjFyYUA68", coverImage: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a67adbf871db9d8ce78bbcb2" },
  { rank: 6, lastWeek: 5, peakPosition: 1, weeksOnChart: 25, title: "CRAZY", artist: "LE SSERAFIM", trend: "down", spotifyId: "7lk1O9vfMuBZYTGmLPaOqJ" },
  { rank: 7, lastWeek: 8, peakPosition: 3, weeksOnChart: 10, title: "Whiplash", artist: "aespa", trend: "up", spotifyId: "2DwSvxnZQcmhzXzeVv2Y6b" },
  { rank: 8, lastWeek: 6, peakPosition: 1, weeksOnChart: 15, title: "HEYA", artist: "IVE", trend: "down", spotifyId: "21LGk4eyzfm2ziMGbeVINP" },
  { rank: 9, lastWeek: 7, peakPosition: 2, weeksOnChart: 20, title: "Who", artist: "Jimin", trend: "down", spotifyId: "1pKYYY0dkg23sQQXi0Q5zN" },
  { rank: 10, lastWeek: 9, peakPosition: 4, weeksOnChart: 14, title: "Chk Chk Boom", artist: "Stray Kids", trend: "down", spotifyId: "6lXKNdOuPVFGMhyCqULEpJ" },
  { rank: 11, lastWeek: 10, peakPosition: 5, weeksOnChart: 18, title: "Super Lady", artist: "(G)I-DLE", trend: "down", spotifyId: "0XFAVZ3S4aHCBbV3FQqkm0" },
  { rank: 12, lastWeek: 14, peakPosition: 6, weeksOnChart: 8, title: "Fate", artist: "(G)I-DLE", trend: "up", spotifyId: "0UPjGHzJyEvxL3UBJiCqbK" },
  { rank: 13, lastWeek: 11, peakPosition: 1, weeksOnChart: 45, title: "How Sweet", artist: "NewJeans", trend: "down", spotifyId: "38tXZcL1gZRfbqfOG0VMTH" },
  { rank: 14, lastWeek: 12, peakPosition: 3, weeksOnChart: 52, title: "Standing Next to You", artist: "Jung Kook", trend: "down", spotifyId: "6xGruZOHLs39ZbVccQTuPV" },
  { rank: 15, lastWeek: 13, peakPosition: 8, weeksOnChart: 10, title: "Strategy", artist: "TWICE", trend: "down", spotifyId: "3E9DLDwjIgMJ4YAHk1GmQH" },
  { rank: 16, lastWeek: 18, peakPosition: 7, weeksOnChart: 12, title: "Boom Boom Bass", artist: "RIIZE", trend: "up", spotifyId: "0C8eNLPqT26n8LqyqJPhz6" },
  { rank: 17, lastWeek: 15, peakPosition: 5, weeksOnChart: 16, title: "XO (Only If You Say Yes)", artist: "ENHYPEN", trend: "down", spotifyId: "0fbyQQJVjKNf33wwHVc9uj" },
  { rank: 18, lastWeek: 16, peakPosition: 9, weeksOnChart: 14, title: "Smoothie", artist: "NCT DREAM", trend: "down", spotifyId: "54EWjxSZ8N9s2l8mSQb9oJ" },
  { rank: 19, lastWeek: 17, peakPosition: 10, weeksOnChart: 30, title: "Baddie", artist: "IVE", trend: "down", spotifyId: "4lnvVaJY0uB0p2EgG0h3lj" },
  { rank: 20, lastWeek: 19, peakPosition: 12, weeksOnChart: 42, title: "Perfect Night", artist: "LE SSERAFIM", trend: "down", spotifyId: "2awFPHpP5VkfE7FvVwQVRW" },
  { rank: 21, lastWeek: 20, peakPosition: 15, weeksOnChart: 38, title: "ETA", artist: "NewJeans", trend: "down", spotifyId: "3ZzS6Gyz8CLG3eiQrg0sga" },
  { rank: 22, lastWeek: 22, peakPosition: 11, weeksOnChart: 28, title: "I AM", artist: "IVE", trend: "same", spotifyId: "70t7Q6AYG6cAZ9WP9bh9s7" },
  { rank: 23, lastWeek: 25, peakPosition: 13, weeksOnChart: 22, title: "Drama", artist: "aespa", trend: "up", spotifyId: "3R0BSgwpxPmKO1bXNjVwXe" },
  { rank: 24, lastWeek: 23, peakPosition: 6, weeksOnChart: 35, title: "GODS", artist: "NewJeans", trend: "down", spotifyId: "7n2FZQsaLb7ZRfRPVRPxX1" },
  { rank: 25, lastWeek: 24, peakPosition: 14, weeksOnChart: 25, title: "Seven", artist: "Jung Kook ft. Latto", trend: "down", spotifyId: "7x9aauaA9cu6tyfpHnqDLo" },
  { rank: 26, lastWeek: 28, peakPosition: 16, weeksOnChart: 18, title: "Queencard", artist: "(G)I-DLE", trend: "up", spotifyId: "4uOBL4DDWWVx4RhYKlPbPC" },
  { rank: 27, lastWeek: 27, peakPosition: 17, weeksOnChart: 32, title: "ANTIFRAGILE", artist: "LE SSERAFIM", trend: "same", spotifyId: "4fsQ0K37TOXa3hEQfjEic4" },
  { rank: 28, lastWeek: 26, peakPosition: 9, weeksOnChart: 42, title: "Ditto", artist: "NewJeans", trend: "down", spotifyId: "3r8RuvgbX9s7ammBn07D3W" },
  { rank: 29, lastWeek: 30, peakPosition: 18, weeksOnChart: 15, title: "Night Dancer", artist: "imase", trend: "up", spotifyId: "3nsfB1vus2qaloUdcBZvjq" },
  { rank: 30, lastWeek: 29, peakPosition: 19, weeksOnChart: 28, title: "S-Class", artist: "Stray Kids", trend: "down", spotifyId: "4eBCymlOAMOL7VSdmWCXJh" },
  { rank: 31, lastWeek: 33, peakPosition: 20, weeksOnChart: 20, title: "UNFORGIVEN", artist: "LE SSERAFIM", trend: "up", spotifyId: "5UXfWdUhnGYMlSfSLJk3Yk" },
  { rank: 32, lastWeek: 31, peakPosition: 7, weeksOnChart: 50, title: "OMG", artist: "NewJeans", trend: "down", spotifyId: "65FftemJ1DbbZ45DUfHJXE" },
  { rank: 33, lastWeek: 32, peakPosition: 21, weeksOnChart: 35, title: "Super Shy", artist: "NewJeans", trend: "down", spotifyId: "5sdQOyqq2IDhvmx2lHOpwd" },
  { rank: 34, lastWeek: 36, peakPosition: 22, weeksOnChart: 25, title: "Like Crazy", artist: "Jimin", trend: "up", spotifyId: "3Ua0m0YmEjrMi9XErKcNiR" },
  { rank: 35, lastWeek: 34, peakPosition: 23, weeksOnChart: 30, title: "Cupid", artist: "FIFTY FIFTY", trend: "down", spotifyId: "7FbrGaHYVDmfr7KoLIZnQ7" },
  { rank: 36, lastWeek: 35, peakPosition: 15, weeksOnChart: 40, title: "Dynamite", artist: "BTS", trend: "down", spotifyId: "5QDLhrAOJJdNAmCTJ8xMyW" },
  { rank: 37, lastWeek: 38, peakPosition: 24, weeksOnChart: 18, title: "Kitsch", artist: "IVE", trend: "up", spotifyId: "6YzXS3SsnDIw3oCOv3pPKU" },
  { rank: 38, lastWeek: 37, peakPosition: 12, weeksOnChart: 55, title: "Butter", artist: "BTS", trend: "down", spotifyId: "3SktMqZmo3M9zbB7oKMIF7" },
  { rank: 39, lastWeek: 40, peakPosition: 25, weeksOnChart: 22, title: "Talk Saxy", artist: "RIIZE", trend: "up", spotifyId: "2kxKFDPSPBzGlECdxiJOtD" },
  { rank: 40, lastWeek: 39, peakPosition: 8, weeksOnChart: 48, title: "Hype Boy", artist: "NewJeans", trend: "down", spotifyId: "0a4MMyCrzT0En247IhqZbD" },
  { rank: 41, lastWeek: 42, peakPosition: 26, weeksOnChart: 20, title: "Tomboy", artist: "(G)I-DLE", trend: "up", spotifyId: "4k6Uh1HXdhtuXvFS11n6Ip" },
  { rank: 42, lastWeek: 41, peakPosition: 18, weeksOnChart: 42, title: "Pink Venom", artist: "BLACKPINK", trend: "down", spotifyId: "5zwwW9Oq8VjfBE4FsYxoZr" },
  { rank: 43, lastWeek: 45, peakPosition: 27, weeksOnChart: 16, title: "Back Door", artist: "Stray Kids", trend: "up", spotifyId: "6BXWKP9rVVfi8DYL1GFYCb" },
  { rank: 44, lastWeek: 43, peakPosition: 10, weeksOnChart: 50, title: "Kill This Love", artist: "BLACKPINK", trend: "down", spotifyId: "4bNHLzLiw5lAaVCT0PTdPQ" },
  { rank: 45, lastWeek: 44, peakPosition: 28, weeksOnChart: 25, title: "LALALALA", artist: "Stray Kids", trend: "down", spotifyId: "0QeRPmGlrA7ceWHLRK6QOH" },
  { rank: 46, lastWeek: 47, peakPosition: 29, weeksOnChart: 18, title: "Candy", artist: "NCT DREAM", trend: "up", spotifyId: "7A7FrHwZnSoNxeVRrqJJA8" },
  { rank: 47, lastWeek: 46, peakPosition: 16, weeksOnChart: 45, title: "Attention", artist: "NewJeans", trend: "down", spotifyId: "2pIUpMhHL6L9Z5lnKL7Gtd" },
  { rank: 48, lastWeek: 50, peakPosition: 30, weeksOnChart: 14, title: "Impossible", artist: "RIIZE", trend: "up", spotifyId: "3KPLUKSwcpZZ2asMbq9B9T" },
  { rank: 49, lastWeek: 48, peakPosition: 20, weeksOnChart: 38, title: "How You Like That", artist: "BLACKPINK", trend: "down", spotifyId: "4jWtWTKXMfnqxZnVe1fVUw" },
  { rank: 50, lastWeek: 49, peakPosition: 22, weeksOnChart: 32, title: "Savage", artist: "aespa", trend: "down", spotifyId: "0dH3xz2yIWgx8jSZKlQJNM" },
];

export const sidebarCategories = [
  { label: "K-STAR CHART", hasChildren: true, active: false },
  { label: "K-STAR ARTIST CHART", hasChildren: true, active: false },
  { label: "GLOBAL CHAMP CHART", hasChildren: true, active: false },
];

export const kstarCharts = [
  { label: "WEEKLY CHART", path: "/charts/weekly", active: true },
  { label: "MONTHLY CHART", path: "/charts/monthly", active: false },
  { label: "SEASON CHART", path: "/charts/season", active: false },
  { label: "YEAR-END CHART", path: "/charts/year-end", active: false },
];

export const kstarArtistCharts = [
  { label: "BEST ROOKIE", path: "/charts/artist/rookie", active: false, comingSoon: true },
  { label: "BEST SOLO&FEATURING", path: "/charts/artist/solo", active: false, comingSoon: true },
  { label: "BEST GROUP", path: "/charts/artist/group", active: false, comingSoon: true },
  { label: "BEST ICON", path: "/charts/artist/icon", active: false, comingSoon: true },
  { label: "BEST GLOBAL", path: "/charts/artist/global", active: false, comingSoon: true },
];

export const globalChampCharts = [
  { label: "GLOBAL MUSIC VIDEO CHART", path: "/charts/global/mv", active: false, comingSoon: true },
  { label: "HOT NOW MUSIC VIDEO CHART", path: "/charts/global/hot-mv", active: false, comingSoon: true },
];
