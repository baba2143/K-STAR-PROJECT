/**
 * Spotify oEmbed Service
 * Fetches album art and metadata from Spotify without API authentication
 */

interface SpotifyOEmbed {
  thumbnail_url: string;
  title: string;
  provider_name: string;
  html: string;
  width: number;
  height: number;
}

// In-memory cache for album art URLs
const albumArtCache = new Map<string, string | null>();

/**
 * Extract Spotify Track ID from URL or return the ID if already an ID
 * @param urlOrId - Spotify URL or Track ID
 * @returns Spotify Track ID
 */
export function extractSpotifyId(urlOrId: string): string {
  if (!urlOrId) return '';
  const match = urlOrId.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : urlOrId;
}

/**
 * Get album art from Spotify oEmbed API
 * @param trackId - Spotify Track ID
 * @returns Album art URL or null if not found
 */
export async function getSpotifyAlbumArt(trackId: string): Promise<string | null> {
  if (!trackId) return null;

  // Check cache first
  if (albumArtCache.has(trackId)) {
    return albumArtCache.get(trackId) ?? null;
  }

  try {
    const url = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`;
    const response = await fetch(url);

    if (!response.ok) {
      albumArtCache.set(trackId, null);
      return null;
    }

    const data: SpotifyOEmbed = await response.json();
    const thumbnailUrl = data.thumbnail_url;

    // Cache the result
    albumArtCache.set(trackId, thumbnailUrl);

    return thumbnailUrl;
  } catch (error) {
    console.error(`Failed to fetch Spotify album art for ${trackId}:`, error);
    albumArtCache.set(trackId, null);
    return null;
  }
}

/**
 * Get Spotify embed URL for iframe
 * @param trackId - Spotify Track ID
 * @returns Embed URL
 */
export function getSpotifyEmbedUrl(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

/**
 * Get Spotify track URL
 * @param trackId - Spotify Track ID
 * @returns Track URL
 */
export function getSpotifyTrackUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`;
}
