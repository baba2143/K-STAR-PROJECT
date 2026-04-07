/**
 * K-STAR PROJECT - Chart Data Hooks
 * React hooks for loading and managing chart data
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  ChartType,
  ChartWeekData,
  SongChartEntry,
  AlbumChartEntry,
  ArtistChartEntry,
  ArtistsIndex,
  SongsIndex,
  AlbumsIndex,
  ChartsIndex,
} from '../lib/types';
import {
  loadSongsChart,
  loadAlbumsChart,
  loadArtistsChart,
  loadMonthlyChart,
  loadSeasonChart,
  loadYearEndChart,
  loadArtistsIndex,
  loadSongsIndex,
  loadAlbumsIndex,
  loadChartsIndex,
  getAvailableWeeks,
  getAvailableMonths,
  getAvailableSeasons,
  getAvailableYears,
  loadArtist,
  loadSong,
  loadAlbum,
  loadKStarArtistChart,
  getAvailableArtistPeriods,
  type KStarArtistCategory,
  type KStarArtistChartData,
} from '../lib/api';
import type { Artist, Song, Album } from '../lib/types';

// ============================================
// Generic Data Fetching Hook
// ============================================

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Chart Data Hooks
// ============================================

/**
 * Hook to load songs chart data
 */
export function useSongsChart(week?: string) {
  return useAsyncData<ChartWeekData<SongChartEntry>>(
    () => loadSongsChart(week),
    [week]
  );
}

/**
 * Hook to load monthly chart data
 */
export function useMonthlyChart(month?: string) {
  return useAsyncData<ChartWeekData<SongChartEntry>>(
    () => loadMonthlyChart(month),
    [month]
  );
}

/**
 * Hook to load season chart data
 */
export function useSeasonChart(season?: string) {
  return useAsyncData<ChartWeekData<SongChartEntry>>(
    () => loadSeasonChart(season),
    [season]
  );
}

/**
 * Hook to load year-end chart data
 */
export function useYearEndChart(year?: string) {
  return useAsyncData<ChartWeekData<SongChartEntry>>(
    () => loadYearEndChart(year),
    [year]
  );
}

/**
 * Hook to load albums chart data
 */
export function useAlbumsChart(week?: string) {
  return useAsyncData<ChartWeekData<AlbumChartEntry>>(
    () => loadAlbumsChart(week),
    [week]
  );
}

/**
 * Hook to load artists chart data
 */
export function useArtistsChart(week?: string) {
  return useAsyncData<ChartWeekData<ArtistChartEntry>>(
    () => loadArtistsChart(week),
    [week]
  );
}

/**
 * Generic chart hook that can load any chart type
 */
export function useChart(chartType: ChartType, week?: string) {
  const loadChart = useCallback(async () => {
    switch (chartType) {
      case 'songs':
      case 'streaming':
      case 'digital':
        return loadSongsChart(week);
      case 'albums':
      case 'physical':
        return loadAlbumsChart(week);
      case 'artists':
        return loadArtistsChart(week);
      default:
        throw new Error(`Unknown chart type: ${chartType}`);
    }
  }, [chartType, week]);

  return useAsyncData(loadChart, [chartType, week]);
}

// ============================================
// Index Hooks
// ============================================

/**
 * Hook to load artists index
 */
export function useArtistsIndex() {
  return useAsyncData<ArtistsIndex>(loadArtistsIndex, []);
}

/**
 * Hook to load songs index
 */
export function useSongsIndex() {
  return useAsyncData<SongsIndex>(loadSongsIndex, []);
}

/**
 * Hook to load albums index
 */
export function useAlbumsIndex() {
  return useAsyncData<AlbumsIndex>(loadAlbumsIndex, []);
}

/**
 * Hook to load charts index
 */
export function useChartsIndex() {
  return useAsyncData<ChartsIndex>(loadChartsIndex, []);
}

// ============================================
// Utility Hooks
// ============================================

/**
 * Hook to get available weeks for a chart type
 */
export function useAvailableWeeks(chartType: ChartType) {
  return useAsyncData<string[]>(
    () => getAvailableWeeks(chartType),
    [chartType]
  );
}

/**
 * Hook to get available months
 */
export function useAvailableMonths() {
  return useAsyncData<string[]>(
    () => getAvailableMonths(),
    []
  );
}

/**
 * Hook to get available seasons
 */
export function useAvailableSeasons() {
  return useAsyncData<string[]>(
    () => getAvailableSeasons(),
    []
  );
}

/**
 * Hook to get available years
 */
export function useAvailableYears() {
  return useAsyncData<string[]>(
    () => getAvailableYears(),
    []
  );
}

/**
 * Hook for chart week navigation
 */
export function useChartNavigation(chartType: ChartType) {
  const { data: weeks, loading } = useAvailableWeeks(chartType);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const currentWeek = weeks?.[currentWeekIndex] ?? null;
  const hasPrevious = currentWeekIndex < (weeks?.length ?? 0) - 1;
  const hasNext = currentWeekIndex > 0;

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentWeekIndex((prev) => prev + 1);
    }
  }, [hasPrevious]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentWeekIndex((prev) => prev - 1);
    }
  }, [hasNext]);

  const goToWeek = useCallback(
    (week: string) => {
      const index = weeks?.indexOf(week) ?? -1;
      if (index !== -1) {
        setCurrentWeekIndex(index);
      }
    },
    [weeks]
  );

  return {
    currentWeek,
    weeks,
    loading,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
    goToWeek,
  };
}

// ============================================
// Entity Detail Hooks
// ============================================

/**
 * Hook to load artist details
 */
export function useArtist(artistId: string | undefined) {
  return useAsyncData<Artist>(
    async () => {
      if (!artistId) throw new Error('Artist ID is required');
      return loadArtist(artistId);
    },
    [artistId]
  );
}

/**
 * Hook to load song details
 */
export function useSong(songId: string | undefined) {
  return useAsyncData<Song>(
    async () => {
      if (!songId) throw new Error('Song ID is required');
      return loadSong(songId);
    },
    [songId]
  );
}

/**
 * Hook to load album details
 */
export function useAlbum(albumId: string | undefined) {
  return useAsyncData<Album>(
    async () => {
      if (!albumId) throw new Error('Album ID is required');
      return loadAlbum(albumId);
    },
    [albumId]
  );
}

/**
 * Hook to get songs by artist
 */
export function useArtistSongs(artistId: string | undefined) {
  const { data: songsIndex, loading, error } = useSongsIndex();

  const songs = songsIndex?.songs.filter(
    (song) => song.artistId === artistId
  ) || [];

  return { data: songs, loading, error };
}

/**
 * Hook to get albums by artist
 */
export function useArtistAlbums(artistId: string | undefined) {
  const { data: albumsIndex, loading, error } = useAlbumsIndex();

  const albums = albumsIndex?.albums.filter(
    (album) => album.artistId === artistId
  ) || [];

  return { data: albums, loading, error };
}

/**
 * Hook to get related artists (same agency)
 */
export function useRelatedArtists(artistId: string | undefined, agency: string | undefined) {
  const { data: artistsIndex, loading, error } = useArtistsIndex();

  const relatedArtists = artistsIndex?.artists.filter(
    (artist) => artist.agency === agency && artist.id !== artistId
  ).slice(0, 6) || [];

  return { data: relatedArtists, loading, error };
}

/**
 * Hook to get artist chart stats
 */
export function useArtistChartStats(artistId: string | undefined) {
  const { data: songsChart } = useSongsChart();

  // Calculate stats from songs chart
  const artistEntries = songsChart?.entries.filter(
    (entry) => entry.artistId === artistId
  ) || [];

  const stats = {
    currentChartEntries: artistEntries.length,
    highestRank: artistEntries.length > 0
      ? Math.min(...artistEntries.map(e => e.rank))
      : null,
    totalWeeksOnChart: artistEntries.reduce((acc, e) => acc + e.weeksOnChart, 0),
    topSong: artistEntries.length > 0
      ? artistEntries.reduce((best, e) => e.rank < best.rank ? e : best)
      : null,
  };

  return { data: stats, loading: !songsChart };
}

/**
 * Hook to get song chart stats
 */
export function useSongChartStats(songId: string | undefined) {
  const { data: songsChart } = useSongsChart();

  const songEntry = songsChart?.entries.find(
    (entry) => entry.songId === songId
  );

  const stats = {
    currentRank: songEntry?.rank ?? null,
    previousRank: songEntry?.previousRank ?? null,
    peakRank: songEntry?.peakRank ?? songEntry?.rank ?? null,
    weeksOnChart: songEntry?.weeksOnChart ?? 0,
    change: songEntry ? (songEntry.previousRank ? songEntry.previousRank - songEntry.rank : null) : null,
  };

  return { data: stats, loading: !songsChart };
}

/**
 * Hook to get album chart stats
 */
export function useAlbumChartStats(albumId: string | undefined) {
  const { data: albumsChart } = useAlbumsChart();

  const albumEntry = albumsChart?.entries.find(
    (entry) => entry.albumId === albumId
  );

  const stats = {
    currentRank: albumEntry?.rank ?? null,
    previousRank: albumEntry?.previousRank ?? null,
    peakRank: albumEntry?.peakRank ?? albumEntry?.rank ?? null,
    weeksOnChart: albumEntry?.weeksOnChart ?? 0,
    change: albumEntry ? (albumEntry.previousRank ? albumEntry.previousRank - albumEntry.rank : null) : null,
  };

  return { data: stats, loading: !albumsChart };
}

/**
 * Hook to get other songs by same artist
 */
export function useRelatedSongs(songId: string | undefined, artistId: string | undefined) {
  const { data: songsIndex, loading, error } = useSongsIndex();

  const relatedSongs = songsIndex?.songs.filter(
    (song) => song.artistId === artistId && song.id !== songId
  ).slice(0, 6) || [];

  return { data: relatedSongs, loading, error };
}

/**
 * Hook to get other albums by same artist
 */
export function useRelatedAlbums(albumId: string | undefined, artistId: string | undefined) {
  const { data: albumsIndex, loading, error } = useAlbumsIndex();

  const relatedAlbums = albumsIndex?.albums.filter(
    (album) => album.artistId === artistId && album.id !== albumId
  ).slice(0, 6) || [];

  return { data: relatedAlbums, loading, error };
}

// ============================================
// Search Hook
// ============================================

interface SearchState {
  query: string;
  results: {
    artists: ArtistsIndex['artists'];
    songs: SongsIndex['songs'];
    albums: AlbumsIndex['albums'];
  } | null;
  loading: boolean;
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: null,
    loading: false,
  });

  const { data: artistsIndex } = useArtistsIndex();
  const { data: songsIndex } = useSongsIndex();
  const { data: albumsIndex } = useAlbumsIndex();

  const search = useCallback(
    (query: string) => {
      const normalizedQuery = query.toLowerCase().trim();

      setState((prev) => ({ ...prev, query, loading: true }));

      if (!normalizedQuery || !artistsIndex || !songsIndex || !albumsIndex) {
        setState({ query, results: null, loading: false });
        return;
      }

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

      setState({
        query,
        results: { artists, songs, albums },
        loading: false,
      });
    },
    [artistsIndex, songsIndex, albumsIndex]
  );

  const clearSearch = useCallback(() => {
    setState({ query: '', results: null, loading: false });
  }, []);

  return {
    ...state,
    search,
    clearSearch,
    totalResults: state.results
      ? state.results.artists.length +
        state.results.songs.length +
        state.results.albums.length
      : 0,
  };
}

// ============================================
// K-STAR Artist Chart Hooks
// ============================================

/**
 * Hook to load K-STAR Artist Chart data
 */
export function useKStarArtistChart(category: KStarArtistCategory, period?: string) {
  return useAsyncData<KStarArtistChartData>(
    () => loadKStarArtistChart(category, period),
    [category, period]
  );
}

/**
 * Hook to get available periods for K-STAR Artist Chart
 */
export function useAvailableArtistPeriods(category: KStarArtistCategory) {
  return useAsyncData<string[]>(
    () => getAvailableArtistPeriods(category),
    [category]
  );
}
