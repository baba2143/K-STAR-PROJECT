/**
 * K-STAR PROJECT - Data Loading API
 * Static JSON data fetching utilities
 */

import { supabase } from './supabase';
import type {
  ChartType,
  ArtistsIndex,
  SongsIndex,
  AlbumsIndex,
  ChartsIndex,
  ChartWeekData,
  SongChartEntry,
  AlbumChartEntry,
  ArtistChartEntry,
  Artist,
  Song,
  Album,
} from './types';

// Base path for data files (relative to public folder)
const DATA_BASE_PATH = '/data';

/**
 * Fetch JSON data with error handling
 */
async function fetchJSON<T>(path: string): Promise<T> {
  const response = await fetch(`${DATA_BASE_PATH}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

// ============================================
// Index Loaders
// ============================================

/**
 * Load artists index
 */
export async function loadArtistsIndex(): Promise<ArtistsIndex> {
  return fetchJSON<ArtistsIndex>('/artists/index.json');
}

/**
 * Load songs index
 */
export async function loadSongsIndex(): Promise<SongsIndex> {
  return fetchJSON<SongsIndex>('/songs/index.json');
}

/**
 * Load albums index
 */
export async function loadAlbumsIndex(): Promise<AlbumsIndex> {
  return fetchJSON<AlbumsIndex>('/albums/index.json');
}

/**
 * Load charts index (available weeks for each chart type)
 */
export async function loadChartsIndex(): Promise<ChartsIndex> {
  return fetchJSON<ChartsIndex>('/charts/index.json');
}

// ============================================
// Chart Data Loaders
// ============================================

/**
 * Load chart data for a specific week
 */
export async function loadChartWeek<T extends SongChartEntry | AlbumChartEntry | ArtistChartEntry>(
  chartType: ChartType,
  week: string
): Promise<ChartWeekData<T>> {
  return fetchJSON<ChartWeekData<T>>(`/charts/${chartType}/${week}.json`);
}

/**
 * Load latest chart data for a given chart type
 */
export async function loadLatestChart<T extends SongChartEntry | AlbumChartEntry | ArtistChartEntry>(
  chartType: ChartType
): Promise<ChartWeekData<T>> {
  const index = await loadChartsIndex();
  const chartInfo = index.charts[chartType];

  if (!chartInfo) {
    throw new Error(`Chart type ${chartType} not found`);
  }

  return loadChartWeek<T>(chartType, chartInfo.latestWeek);
}

/**
 * Load songs chart (convenience function)
 */
export async function loadSongsChart(week?: string): Promise<ChartWeekData<SongChartEntry>> {
  if (week) {
    return loadChartWeek<SongChartEntry>('songs', week);
  }
  return loadLatestChart<SongChartEntry>('songs');
}

/**
 * Load albums chart (convenience function)
 */
export async function loadAlbumsChart(week?: string): Promise<ChartWeekData<AlbumChartEntry>> {
  if (week) {
    return loadChartWeek<AlbumChartEntry>('albums', week);
  }
  return loadLatestChart<AlbumChartEntry>('albums');
}

/**
 * Load artists chart (convenience function)
 */
export async function loadArtistsChart(week?: string): Promise<ChartWeekData<ArtistChartEntry>> {
  if (week) {
    return loadChartWeek<ArtistChartEntry>('artists', week);
  }
  return loadLatestChart<ArtistChartEntry>('artists');
}

/**
 * Load monthly chart
 */
export async function loadMonthlyChart(month?: string): Promise<ChartWeekData<SongChartEntry>> {
  if (month) {
    return fetchJSON<ChartWeekData<SongChartEntry>>(`/charts/monthly/${month}.json`);
  }
  // Load index and get latest month
  const index = await fetchJSON<{ latestMonth: string; availableMonths: string[] }>('/charts/monthly/index.json');
  return fetchJSON<ChartWeekData<SongChartEntry>>(`/charts/monthly/${index.latestMonth}.json`);
}

/**
 * Load season chart
 */
export async function loadSeasonChart(season?: string): Promise<ChartWeekData<SongChartEntry>> {
  if (season) {
    return fetchJSON<ChartWeekData<SongChartEntry>>(`/charts/season/${season}.json`);
  }
  // Load index and get latest season
  const index = await fetchJSON<{ latestSeason: string; availableSeasons: string[] }>('/charts/season/index.json');
  return fetchJSON<ChartWeekData<SongChartEntry>>(`/charts/season/${index.latestSeason}.json`);
}

/**
 * Load year-end chart
 */
export async function loadYearEndChart(year?: string): Promise<ChartWeekData<SongChartEntry>> {
  if (year) {
    return fetchJSON<ChartWeekData<SongChartEntry>>(`/charts/year-end/${year}.json`);
  }
  // Load index and get latest year
  const index = await fetchJSON<{ latestYear: string; availableYears: string[] }>('/charts/year-end/index.json');
  return fetchJSON<ChartWeekData<SongChartEntry>>(`/charts/year-end/${index.latestYear}.json`);
}

// ============================================
// Detail Loaders
// ============================================

/**
 * Load artist details
 * Falls back to index data if individual file doesn't exist
 */
export async function loadArtist(artistId: string): Promise<Artist> {
  try {
    return await fetchJSON<Artist>(`/artists/${artistId}.json`);
  } catch {
    // Fall back to index data
    const index = await loadArtistsIndex();
    const artistFromIndex = index.artists.find((a) => a.id === artistId);
    if (!artistFromIndex) {
      throw new Error(`Artist not found: ${artistId}`);
    }
    // Convert index entry to full Artist type
    return {
      ...artistFromIndex,
      debutDate: undefined,
      coverImage: undefined,
      members: undefined,
      socialLinks: undefined,
      description: undefined,
      descriptionJa: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    } as Artist;
  }
}

/**
 * Load song details
 * Falls back to index data if individual file doesn't exist
 */
export async function loadSong(songId: string): Promise<Song> {
  try {
    return await fetchJSON<Song>(`/songs/${songId}.json`);
  } catch {
    // Fall back to index data
    const index = await loadSongsIndex();
    const songFromIndex = index.songs.find((s) => s.id === songId);
    if (!songFromIndex) {
      throw new Error(`Song not found: ${songId}`);
    }
    // Convert index entry to full Song type
    // Preserve existing fields from index (like spotifyId, coverImage)
    return {
      featuredArtists: undefined,
      albumId: undefined,
      albumName: undefined,
      duration: undefined,
      genre: undefined,
      youtubeId: undefined,
      appleMusicId: undefined,
      isTitle: undefined,
      lyrics: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ...songFromIndex,
    } as Song;
  }
}

/**
 * Load album details
 * Falls back to index data if individual file doesn't exist
 */
export async function loadAlbum(albumId: string): Promise<Album> {
  try {
    return await fetchJSON<Album>(`/albums/${albumId}.json`);
  } catch {
    // Fall back to index data
    const index = await loadAlbumsIndex();
    const albumFromIndex = index.albums.find((a) => a.id === albumId);
    if (!albumFromIndex) {
      throw new Error(`Album not found: ${albumId}`);
    }
    // Convert index entry to full Album type
    return {
      ...albumFromIndex,
      tracks: undefined,
      description: undefined,
      spotifyId: undefined,
      appleMusicId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    } as Album;
  }
}

// ============================================
// Search (Client-side filtering)
// ============================================

/**
 * Search across all indices
 */
export async function searchAll(query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return { artists: [], songs: [], albums: [], query: '', totalResults: 0 };
  }

  const [artistsIndex, songsIndex, albumsIndex] = await Promise.all([
    loadArtistsIndex(),
    loadSongsIndex(),
    loadAlbumsIndex(),
  ]);

  const artists = artistsIndex.artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(normalizedQuery) ||
      artist.nameKo?.toLowerCase().includes(normalizedQuery)
  );

  const songs = songsIndex.songs.filter(
    (song) =>
      song.title.toLowerCase().includes(normalizedQuery) ||
      song.titleKo?.toLowerCase().includes(normalizedQuery) ||
      song.artistName.toLowerCase().includes(normalizedQuery)
  );

  const albums = albumsIndex.albums.filter(
    (album) =>
      album.title.toLowerCase().includes(normalizedQuery) ||
      album.titleKo?.toLowerCase().includes(normalizedQuery) ||
      album.artistName.toLowerCase().includes(normalizedQuery)
  );

  return {
    artists,
    songs,
    albums,
    query,
    totalResults: artists.length + songs.length + albums.length,
  };
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get available weeks for a chart type
 */
export async function getAvailableWeeks(chartType: ChartType): Promise<string[]> {
  const index = await loadChartsIndex();
  return index.charts[chartType]?.availableWeeks || [];
}

/**
 * Get available months for monthly chart
 */
export async function getAvailableMonths(): Promise<string[]> {
  try {
    const index = await fetchJSON<{ availableMonths: string[] }>('/charts/monthly/index.json');
    return index.availableMonths || [];
  } catch {
    return [];
  }
}

/**
 * Get available seasons for season chart
 */
export async function getAvailableSeasons(): Promise<string[]> {
  try {
    const index = await fetchJSON<{ availableSeasons: string[] }>('/charts/season/index.json');
    return index.availableSeasons || [];
  } catch {
    return [];
  }
}

/**
 * Get available years for year-end chart
 */
export async function getAvailableYears(): Promise<string[]> {
  try {
    const index = await fetchJSON<{ availableYears: string[] }>('/charts/year-end/index.json');
    return index.availableYears || [];
  } catch {
    return [];
  }
}

/**
 * Check if data is stale and needs refresh
 */
export function isDataStale(updatedAt: string, maxAgeHours = 24): boolean {
  const updateDate = new Date(updatedAt);
  const now = new Date();
  const diffHours = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60);
  return diffHours > maxAgeHours;
}

// ============================================
// K-STAR Artist Chart API
// ============================================

export type KStarArtistCategory = 'rookie' | 'solo' | 'group' | 'icon' | 'global';

export interface KStarArtistChartEntry {
  rank: number;
  previousRank: number | null;
  peakPosition: number;
  weeksOnChart: number;
  artistId: string;
  name: string;
  nameKo?: string;
  image: string;
  trend: 'up' | 'down' | 'same' | 'new' | 're-entry';
  isFavorite?: boolean;
}

export interface KStarArtistChartData {
  id: string;
  category: KStarArtistCategory;
  period: string;
  periodStart: string;
  periodEnd: string;
  publishedAt: string;
  totalEntries: number;
  entries: KStarArtistChartEntry[];
}

/**
 * Load K-STAR Artist Chart data
 */
export async function loadKStarArtistChart(
  category: KStarArtistCategory,
  period?: string
): Promise<KStarArtistChartData> {
  if (period) {
    return fetchJSON<KStarArtistChartData>(`/charts/artist/${category}/${period}.json`);
  }
  // Load index and get latest period
  const index = await fetchJSON<{ latestPeriod: string; availablePeriods: string[] }>(
    `/charts/artist/${category}/index.json`
  );
  return fetchJSON<KStarArtistChartData>(`/charts/artist/${category}/${index.latestPeriod}.json`);
}

/**
 * Get available periods for K-STAR Artist Chart
 */
export async function getAvailableArtistPeriods(category: KStarArtistCategory): Promise<string[]> {
  try {
    const index = await fetchJSON<{ availablePeriods: string[] }>(
      `/charts/artist/${category}/index.json`
    );
    return index.availablePeriods || [];
  } catch {
    return [];
  }
}

// ============================================
// Chart Banner API
// ============================================

export interface ChartBanner {
  id: string;
  chartType: string;
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Get current date in JST (YYYY-MM-DD format)
 */
function getCurrentDateJST(): string {
  const now = new Date();
  const jstOffset = 9 * 60; // JST is UTC+9
  const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60 * 1000);
  return jstTime.toISOString().split('T')[0];
}

/**
 * Load active banner for a specific chart type
 * Filters by date range (startDate/endDate) in JST
 */
export async function loadChartBanner(chartType: string): Promise<ChartBanner | null> {
  try {
    const today = getCurrentDateJST();

    let query = supabase
      .from('chart_banners')
      .select('*')
      .eq('chart_type', chartType)
      .eq('is_active', true);

    // Filter: startDate is null OR startDate <= today
    query = query.or(`start_date.is.null,start_date.lte.${today}`);

    const { data: banners, error } = await query;

    if (error) {
      console.error('Error loading banner:', error);
      return null;
    }

    if (!banners || banners.length === 0) {
      return null;
    }

    // Filter endDate on client side (endDate is null OR endDate >= today)
    const validBanner = banners.find(
      (b) => !b.end_date || b.end_date >= today
    );

    if (!validBanner) {
      return null;
    }

    return {
      id: validBanner.id,
      chartType: validBanner.chart_type,
      imageUrl: validBanner.image_url,
      linkUrl: validBanner.link_url,
      altText: validBanner.alt_text,
      isActive: validBanner.is_active,
      startDate: validBanner.start_date,
      endDate: validBanner.end_date,
    };
  } catch (error) {
    console.error('Error loading banner:', error);
    return null;
  }
}
