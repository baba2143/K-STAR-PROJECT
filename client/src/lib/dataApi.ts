/**
 * Data API Client for Client App
 *
 * Fetches data from Supabase for display on the client side.
 */

import { supabase } from './supabase';

// Artist
export interface Artist {
  id: string;
  name: string;
  nameKo?: string;
  type?: string;
  gender?: string;
  agency?: string;
  image?: string;
  debutDate?: string;
  active?: boolean;
}

// Song
export interface Song {
  id: string;
  title: string;
  titleKo?: string;
  artistId?: string;
  artistName?: string;
  albumId?: string;
  albumName?: string;
  coverImage?: string;
  releaseDate?: string;
  duration?: number;
  spotifyId?: string;
  appleMusicId?: string;
  youtubeId?: string;
}

// Album
export interface Album {
  id: string;
  title: string;
  titleKo?: string;
  artistId?: string;
  artistName?: string;
  coverImage?: string;
  releaseDate?: string;
  albumType?: string;
  trackCount?: number;
  spotifyId?: string;
  appleMusicId?: string;
  description?: string;
}

// Chart Entry
export interface ChartEntry {
  rank: number;
  songId?: string;
  title: string;
  artist: string;
  previousRank?: number | null;
  trend?: 'up' | 'down' | 'same' | 'new';
  weeksOnChart?: number;
  coverImage?: string;
  spotifyId?: string;
}

// Chart
export interface Chart {
  chartType: string;
  week: string;
  entries: ChartEntry[];
}

// Load all artists
export async function loadArtists(): Promise<Artist[]> {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading artists:', error);
      return [];
    }

    return (data || []).map((record) => ({
      id: record.id,
      name: record.name,
      nameKo: record.name_ko,
      type: record.type,
      gender: record.gender,
      agency: record.agency,
      image: record.image,
      debutDate: record.debut_date,
      active: record.active,
    }));
  } catch (error) {
    console.error('Error loading artists:', error);
    return [];
  }
}

// Load all songs
export async function loadSongs(): Promise<Song[]> {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error loading songs:', error);
      return [];
    }

    return (data || []).map((record) => ({
      id: record.id,
      title: record.title,
      titleKo: record.title_ko,
      artistId: record.artist_id,
      artistName: record.artist_name,
      albumId: record.album_id,
      albumName: record.album_name,
      coverImage: record.cover_image,
      releaseDate: record.release_date,
      duration: record.duration,
      spotifyId: record.spotify_id,
      appleMusicId: record.apple_music_id,
      youtubeId: record.youtube_id,
    }));
  } catch (error) {
    console.error('Error loading songs:', error);
    return [];
  }
}

// Load all albums
export async function loadAlbums(): Promise<Album[]> {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error loading albums:', error);
      return [];
    }

    return (data || []).map((record) => ({
      id: record.id,
      title: record.title,
      titleKo: record.title_ko,
      artistId: record.artist_id,
      artistName: record.artist_name,
      coverImage: record.cover_image,
      releaseDate: record.release_date,
      albumType: record.album_type,
      trackCount: record.track_count,
      spotifyId: record.spotify_id,
      appleMusicId: record.apple_music_id,
      description: record.description,
    }));
  } catch (error) {
    console.error('Error loading albums:', error);
    return [];
  }
}

// Load latest chart by type
export async function loadLatestChart(chartType: string): Promise<Chart | null> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('chart_type', chartType)
      .order('week', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading latest chart:', error);
      return null;
    }

    return {
      chartType: data.chart_type,
      week: data.week,
      entries: data.entries as ChartEntry[],
    };
  } catch (error) {
    console.error('Error loading latest chart:', error);
    return null;
  }
}

// Load chart by type and week
export async function loadChart(chartType: string, week: string): Promise<Chart | null> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('chart_type', chartType)
      .eq('week', week)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading chart:', error);
      return null;
    }

    return {
      chartType: data.chart_type,
      week: data.week,
      entries: data.entries as ChartEntry[],
    };
  } catch (error) {
    console.error('Error loading chart:', error);
    return null;
  }
}

// Load artist by ID
export async function loadArtistById(id: string): Promise<Artist | null> {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading artist:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      nameKo: data.name_ko,
      type: data.type,
      gender: data.gender,
      agency: data.agency,
      image: data.image,
      debutDate: data.debut_date,
      active: data.active,
    };
  } catch (error) {
    console.error('Error loading artist:', error);
    return null;
  }
}

// Load song by ID
export async function loadSongById(id: string): Promise<Song | null> {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading song:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      titleKo: data.title_ko,
      artistId: data.artist_id,
      artistName: data.artist_name,
      albumId: data.album_id,
      albumName: data.album_name,
      coverImage: data.cover_image,
      releaseDate: data.release_date,
      duration: data.duration,
      spotifyId: data.spotify_id,
      appleMusicId: data.apple_music_id,
      youtubeId: data.youtube_id,
    };
  } catch (error) {
    console.error('Error loading song:', error);
    return null;
  }
}
