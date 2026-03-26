/**
 * AlbumDetail - Album detail page
 * Shows album info, track list, and related content
 */

import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Disc3, Music, List } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { NotFoundState } from "@/components/ui/ErrorState";
import { useAlbum, useArtistsIndex, useSongsIndex } from "@/hooks/useChartData";
import { cn } from "@/lib/utils";

export default function AlbumDetail() {
  const params = useParams<{ id: string }>();
  const albumId = params.id;

  const { data: album, loading: albumLoading, error: albumError } = useAlbum(albumId);
  const { data: artistsIndex } = useArtistsIndex();
  const { data: songsIndex } = useSongsIndex();

  // Find artist data
  const artist = artistsIndex?.artists.find((a) => a.id === album?.artistId);
  // Find songs from this album
  const albumSongs = songsIndex?.songs.filter((s) => s.artistId === album?.artistId) || [];

  if (albumLoading) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Albums Chart</span>
          </div>
        </div>
        <DetailPageSkeleton />
      </ChartLayout>
    );
  }

  if (albumError || !album) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <Link
            href="/charts/albums"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors focus-ring"
          >
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Albums Chart</span>
          </Link>
        </div>
        <NotFoundState
          type="album"
          backLink="/charts/albums"
          backLabel="Browse Albums"
        />
      </ChartLayout>
    );
  }

  const albumTypeColors = {
    full: { bg: "bg-[#a855f7]/20", text: "text-[#a855f7]", gradient: "from-[#a855f7] to-[#ec4899]" },
    mini: { bg: "bg-[#00d4ff]/20", text: "text-[#00d4ff]", gradient: "from-[#00d4ff] to-[#a855f7]" },
    single: { bg: "bg-[#ec4899]/20", text: "text-[#ec4899]", gradient: "from-[#ec4899] to-[#f97316]" },
    repackage: { bg: "bg-[#f97316]/20", text: "text-[#f97316]", gradient: "from-[#f97316] to-[#eab308]" },
  };
  const colors = albumTypeColors[album.albumType as keyof typeof albumTypeColors] || albumTypeColors.full;

  return (
    <ChartLayout>
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 pt-6">
        <Link href="/charts/albums" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Albums Chart</span>
        </Link>
      </div>

      {/* Album Hero */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, #a855f7 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, #ec4899 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Cover Image */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0 shadow-2xl">
              {album.coverImage ? (
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Disc3 size={64} />
                </div>
              )}
            </div>

            {/* Album Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded",
                    colors.bg,
                    colors.text
                  )}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {getAlbumTypeLabel(album.albumType)}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-black uppercase"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  letterSpacing: "0.02em",
                  background: `linear-gradient(90deg, ${colors.gradient.includes('a855f7') ? '#a855f7' : '#ec4899'}, ${colors.gradient.includes('ec4899') ? '#ec4899' : '#f97316'})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {album.title}
              </h1>

              {album.titleKo && (
                <p className="text-gray-400 text-lg mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {album.titleKo}
                </p>
              )}

              {/* Artist Link */}
              <Link
                href={`/artists/${album.artistId}`}
                className="inline-block text-[#a855f7] text-lg font-medium mt-2 hover:text-[#c084fc] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {album.artistName}
              </Link>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className={colors.text} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {formatDate(album.releaseDate)}
                  </span>
                </div>
                {album.trackCount && (
                  <div className="flex items-center gap-1.5">
                    <List size={14} className={colors.text} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {album.trackCount} Tracks
                    </span>
                  </div>
                )}
              </div>

              {/* External Links */}
              <div className="flex items-center gap-3 mt-5">
                {album.spotifyId && (
                  <a
                    href={`https://open.spotify.com/album/${album.spotifyId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white text-sm font-bold rounded-lg hover:bg-[#1aa34a] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Listen on Spotify
                  </a>
                )}
                {album.appleMusicId && (
                  <a
                    href={`https://music.apple.com/album/${album.appleMusicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#fc3c44] text-white text-sm font-bold rounded-lg hover:bg-[#e02d35] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Apple Music
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f0f0f] border-t border-[#1e1e1e]">
        {/* Description */}
        {album.description && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-3"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              About
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {album.description}
            </p>
          </div>
        )}

        {/* Track List */}
        <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
          <h2
            className="text-lg font-bold uppercase mb-4"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            Track List {album.trackCount && `(${album.trackCount})`}
          </h2>
          {albumSongs.length > 0 ? (
            <div className="space-y-1">
              {albumSongs.map((song, index) => (
                <Link
                  key={song.id}
                  href={`/songs/${song.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center text-gray-500 group-hover:text-white"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                    {song.coverImage ? (
                      <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Music size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-[#a855f7] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {song.title}
                    </p>
                    <p className="text-gray-500 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {song.artistName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Track list not available
              </p>
            </div>
          )}
        </div>

        {/* Artist Section */}
        {artist && (
          <div className="px-4 sm:px-6 py-6">
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
    case "full": return "Full Album";
    case "mini": return "Mini Album";
    case "single": return "Single";
    case "repackage": return "Repackage";
    case "ost": return "OST";
    case "compilation": return "Compilation";
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
