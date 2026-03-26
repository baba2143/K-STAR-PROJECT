import type { ChartType, SongChartEntry, Artist, Song, Album, ChartWeekData } from "@/types";

/**
 * Generate chart week JSON data
 */
export function generateChartJSON(
  chartType: ChartType,
  week: string,
  entries: Partial<SongChartEntry>[]
): ChartWeekData<SongChartEntry> {
  const weekStart = getWeekStart(week);
  const weekEnd = week;

  return {
    id: `${chartType}-${week}`,
    chartType,
    weekStart,
    weekEnd,
    publishedAt: new Date().toISOString(),
    totalEntries: entries.length,
    entries: entries.map((entry, idx) => ({
      rank: entry.rank ?? idx + 1,
      previousRank: entry.previousRank ?? null,
      peakPosition: entry.peakPosition ?? entry.rank ?? idx + 1,
      weeksOnChart: entry.weeksOnChart ?? 1,
      songId: generateSongId(entry.title || "", entry.artist || ""),
      title: entry.title || "",
      titleKo: entry.titleKo,
      artist: entry.artist || "",
      artistId: generateArtistId(entry.artist || ""),
      coverImage: entry.coverImage || "",
      albumName: entry.albumName,
      trend: entry.trend || "new",
      isNew: entry.isNew ?? entry.trend === "new",
      streams: entry.streams,
      downloads: entry.downloads,
    })),
  };
}

/**
 * Generate artists index JSON
 */
export function generateArtistsIndexJSON(artists: Partial<Artist>[]) {
  return {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    artists: artists.map((artist) => ({
      id: artist.id || generateArtistId(artist.name || ""),
      name: artist.name || "",
      nameKo: artist.nameKo,
      type: artist.type || "group",
      gender: artist.gender || "female",
      agency: artist.agency || "",
      image: artist.image || "",
      active: artist.active ?? true,
    })),
  };
}

/**
 * Generate songs index JSON
 */
export function generateSongsIndexJSON(songs: Partial<Song>[]) {
  return {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    songs: songs.map((song) => ({
      id: song.id || generateSongId(song.title || "", song.artistName || ""),
      title: song.title || "",
      titleKo: song.titleKo,
      artistId: song.artistId || generateArtistId(song.artistName || ""),
      artistName: song.artistName || "",
      coverImage: song.coverImage || "",
      releaseDate: song.releaseDate || "",
    })),
  };
}

/**
 * Generate albums index JSON
 */
export function generateAlbumsIndexJSON(albums: Partial<Album>[]) {
  return {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    albums: albums.map((album) => ({
      id: album.id || generateAlbumId(album.title || "", album.artistName || ""),
      title: album.title || "",
      titleKo: album.titleKo,
      artistId: album.artistId || generateArtistId(album.artistName || ""),
      artistName: album.artistName || "",
      coverImage: album.coverImage || "",
      releaseDate: album.releaseDate || "",
      albumType: album.albumType || "full",
    })),
  };
}

/**
 * Download JSON as file
 */
export function downloadJSON(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper functions
function getWeekStart(weekEnd: string): string {
  const date = new Date(weekEnd);
  date.setDate(date.getDate() - 6);
  return date.toISOString().split("T")[0];
}

function generateArtistId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSongId(title: string, artist: string): string {
  const artistSlug = generateArtistId(artist);
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${artistSlug}-${titleSlug}`;
}

function generateAlbumId(title: string, artist: string): string {
  return generateSongId(title, artist);
}
