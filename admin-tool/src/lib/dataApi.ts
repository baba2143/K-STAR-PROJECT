/**
 * Data API Client - Supabase Version
 *
 * Connects admin tool to Supabase for persistent storage.
 */

import { supabase } from './supabase';

// Artists
export async function saveArtists(artists: unknown[]): Promise<boolean> {
  try {
    // Convert to DB format
    const records = artists.map((artist) => {
      const a = artist as Record<string, unknown>;
      return {
        id: a.id as string,
        name: a.name as string,
        name_ko: a.nameKo as string | undefined,
        type: a.type as string | undefined,
        gender: a.gender as string | undefined,
        agency: a.agency as string | undefined,
        image: a.image as string | undefined,
        debut_date: a.debutDate as string | undefined,
        active: a.active as boolean | undefined,
      };
    });

    // Upsert all records
    const { error } = await supabase
      .from('artists')
      .upsert(records, { onConflict: 'id' });

    if (error) {
      console.error('Error saving artists:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving artists:', error);
    return false;
  }
}

export async function loadArtists<T>(): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading artists:', error);
      return [];
    }

    // Convert to app format
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
    })) as T[];
  } catch (error) {
    console.error('Error loading artists:', error);
    return [];
  }
}

export async function deleteArtist(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting artist:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting artist:', error);
    return false;
  }
}

// Songs
export async function saveSongs(songs: unknown[]): Promise<boolean> {
  try {
    const records = songs.map((song) => {
      const s = song as Record<string, unknown>;
      return {
        id: s.id as string,
        title: s.title as string,
        title_ko: s.titleKo as string | undefined,
        artist_id: s.artistId as string | undefined,
        artist_name: s.artistName as string | undefined,
        album_id: s.albumId as string | undefined,
        album_name: s.albumName as string | undefined,
        cover_image: s.coverImage as string | undefined,
        release_date: s.releaseDate as string | undefined,
        duration: s.duration as number | undefined,
        spotify_id: s.spotifyId as string | undefined,
        apple_music_id: s.appleMusicId as string | undefined,
        youtube_id: s.youtubeId as string | undefined,
      };
    });

    const { error } = await supabase
      .from('songs')
      .upsert(records, { onConflict: 'id' });

    if (error) {
      console.error('Error saving songs:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving songs:', error);
    return false;
  }
}

export async function loadSongs<T>(): Promise<T[]> {
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
    })) as T[];
  } catch (error) {
    console.error('Error loading songs:', error);
    return [];
  }
}

export async function deleteSong(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting song:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting song:', error);
    return false;
  }
}

// Albums
export async function saveAlbums(albums: unknown[]): Promise<boolean> {
  try {
    const records = albums.map((album) => {
      const a = album as Record<string, unknown>;
      return {
        id: a.id as string,
        title: a.title as string,
        title_ko: a.titleKo as string | undefined,
        artist_id: a.artistId as string | undefined,
        artist_name: a.artistName as string | undefined,
        cover_image: a.coverImage as string | undefined,
        release_date: a.releaseDate as string | undefined,
        album_type: a.albumType as string | undefined,
        track_count: a.trackCount as number | undefined,
        spotify_id: a.spotifyId as string | undefined,
        apple_music_id: a.appleMusicId as string | undefined,
        description: a.description as string | undefined,
      };
    });

    const { error } = await supabase
      .from('albums')
      .upsert(records, { onConflict: 'id' });

    if (error) {
      console.error('Error saving albums:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving albums:', error);
    return false;
  }
}

export async function loadAlbums<T>(): Promise<T[]> {
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
    })) as T[];
  } catch (error) {
    console.error('Error loading albums:', error);
    return [];
  }
}

export async function deleteAlbum(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting album:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting album:', error);
    return false;
  }
}

// Charts
export async function saveChart(chartType: string, week: string, entries: unknown): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('charts')
      .upsert({
        chart_type: chartType,
        week: week,
        entries: entries,
      }, { onConflict: 'chart_type,week' });

    if (error) {
      console.error('Error saving chart:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving chart:', error);
    return false;
  }
}

export async function loadChart<T>(chartType: string, week: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('chart_type', chartType)
      .eq('week', week)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error loading chart:', error);
      return null;
    }

    return data?.entries as T;
  } catch (error) {
    console.error('Error loading chart:', error);
    return null;
  }
}

export async function loadLatestChart<T>(chartType: string): Promise<{ week: string; entries: T } | null> {
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
      week: data.week,
      entries: data.entries as T,
    };
  } catch (error) {
    console.error('Error loading latest chart:', error);
    return null;
  }
}

// Banners
export async function saveBanner(banner: unknown): Promise<boolean> {
  try {
    const b = banner as Record<string, unknown>;
    const record = {
      id: b.id as string,
      chart_type: b.chartType as string,
      image_url: b.imageUrl as string,
      link_url: b.linkUrl as string | undefined,
      alt_text: b.altText as string | undefined,
      is_active: b.isActive as boolean,
      start_date: b.startDate as string | undefined,
      end_date: b.endDate as string | undefined,
    };

    const { error } = await supabase
      .from('chart_banners')
      .upsert(record, { onConflict: 'id' });

    if (error) {
      console.error('Error saving banner:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving banner:', error);
    return false;
  }
}

export async function loadBanners<T>(): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from('chart_banners')
      .select('*')
      .order('chart_type');

    if (error) {
      console.error('Error loading banners:', error);
      return [];
    }

    return (data || []).map((record) => ({
      id: record.id,
      chartType: record.chart_type,
      imageUrl: record.image_url,
      linkUrl: record.link_url,
      altText: record.alt_text,
      isActive: record.is_active,
      startDate: record.start_date,
      endDate: record.end_date,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    })) as T[];
  } catch (error) {
    console.error('Error loading banners:', error);
    return [];
  }
}

export async function loadBannerByChartType<T>(chartType: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from('chart_banners')
      .select('*')
      .eq('chart_type', chartType)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading banner:', error);
      return null;
    }

    return {
      id: data.id,
      chartType: data.chart_type,
      imageUrl: data.image_url,
      linkUrl: data.link_url,
      altText: data.alt_text,
      isActive: data.is_active,
      startDate: data.start_date,
      endDate: data.end_date,
    } as T;
  } catch (error) {
    console.error('Error loading banner:', error);
    return null;
  }
}

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chart_banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting banner:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting banner:', error);
    return false;
  }
}

// Banner Image Upload
export async function uploadBannerImage(file: File, bannerId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bannerId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('banners')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload banner image:', error);
    return null;
  }
}

export async function deleteBannerImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    if (!fileName) {
      console.error('Could not extract file name from URL');
      return false;
    }

    const { error } = await supabase.storage
      .from('banners')
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to delete banner image:', error);
    return false;
  }
}

// Health check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const { error } = await supabase.from('artists').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
