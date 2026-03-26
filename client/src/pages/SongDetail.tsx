/**
 * SongDetail - Song detail page
 * Shows song info, chart history, and related content
 */

import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, Music, Disc3, Play } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { NotFoundState } from "@/components/ui/ErrorState";
import { useSong, useArtistsIndex, useAlbumsIndex } from "@/hooks/useChartData";

export default function SongDetail() {
  const params = useParams<{ id: string }>();
  const songId = params.id;

  const { data: song, loading: songLoading, error: songError } = useSong(songId);
  const { data: artistsIndex } = useArtistsIndex();
  const { data: albumsIndex } = useAlbumsIndex();

  // Find artist data
  const artist = artistsIndex?.artists.find((a) => a.id === song?.artistId);
  // Find album data
  const album = albumsIndex?.albums.find((a) => a.id === song?.albumId);

  if (songLoading) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Songs Chart</span>
          </div>
        </div>
        <DetailPageSkeleton />
      </ChartLayout>
    );
  }

  if (songError || !song) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <Link
            href="/charts/songs"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors focus-ring"
          >
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Songs Chart</span>
          </Link>
        </div>
        <NotFoundState
          type="song"
          backLink="/charts/songs"
          backLabel="Browse Songs"
        />
      </ChartLayout>
    );
  }

  return (
    <ChartLayout>
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 pt-6">
        <Link href="/charts/songs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Songs Chart</span>
        </Link>
      </div>

      {/* Song Hero */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, #00d4ff 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, #a855f7 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Cover Image */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0 shadow-2xl">
              {song.coverImage ? (
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Music size={48} />
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="flex-1">
              {song.isTitle && (
                <span
                  className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#00d4ff]/20 text-[#00d4ff] rounded mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Title Track
                </span>
              )}

              <h1
                className="text-3xl sm:text-4xl font-black uppercase"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  letterSpacing: "0.02em",
                  background: "linear-gradient(90deg, #00d4ff, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {song.title}
              </h1>

              {song.titleKo && (
                <p className="text-gray-400 text-lg mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {song.titleKo}
                </p>
              )}

              {/* Artist Link */}
              <Link
                href={`/artists/${song.artistId}`}
                className="inline-block text-[#a855f7] text-lg font-medium mt-2 hover:text-[#c084fc] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {song.artistName}
              </Link>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#00d4ff]" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {formatDate(song.releaseDate)}
                  </span>
                </div>
                {song.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#00d4ff]" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                )}
                {song.albumName && (
                  <div className="flex items-center gap-1.5">
                    <Disc3 size={14} className="text-[#00d4ff]" />
                    <Link
                      href={`/albums/${song.albumId}`}
                      className="hover:text-white transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {song.albumName}
                    </Link>
                  </div>
                )}
              </div>

              {/* External Links */}
              <div className="flex items-center gap-3 mt-5">
                {song.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white text-sm font-bold rounded-lg hover:bg-[#cc0000] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Play size={14} />
                    Watch MV
                  </a>
                )}
                {song.spotifyId && (
                  <a
                    href={`https://open.spotify.com/track/${song.spotifyId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white text-sm font-bold rounded-lg hover:bg-[#1aa34a] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Listen on Spotify
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f0f0f] border-t border-[#1e1e1e]">
        {/* Genre */}
        {song.genre && song.genre.length > 0 && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-3"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Genre
            </h2>
            <div className="flex flex-wrap gap-2">
              {song.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 bg-[#1a1a1a] text-gray-300 text-sm rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Artist Section */}
        {artist && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Artist
            </h2>
            <Link
              href={`/artists/${artist.id}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#252525] flex-shrink-0">
                {artist.image ? (
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">
                    {artist.name[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {artist.name}
                </p>
                {artist.nameKo && (
                  <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {artist.nameKo}
                  </p>
                )}
                <p className="text-gray-600 text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {artist.agency}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Album Section */}
        {album && (
          <div className="px-4 sm:px-6 py-6">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Album
            </h2>
            <Link
              href={`/albums/${album.id}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#252525] flex-shrink-0">
                {album.coverImage ? (
                  <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Disc3 size={24} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {album.title}
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {album.artistName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {formatDate(album.releaseDate)}
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#a855f7]/20 text-[#a855f7] text-[10px] uppercase rounded">
                    {getAlbumTypeLabel(album.albumType)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-[#1a1a1a] px-4 sm:px-6 py-8">
        <p className="text-gray-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 K-STAR PROJECT. All rights reserved.
        </p>
      </footer>
    </ChartLayout>
  );
}

function getAlbumTypeLabel(type: string): string {
  switch (type) {
    case "full": return "Full";
    case "mini": return "Mini";
    case "single": return "Single";
    case "repackage": return "Repack";
    default: return type;
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
