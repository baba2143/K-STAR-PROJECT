/**
 * AlbumDetail - Album detail page (Enhanced)
 * Shows album info, chart stats, track list, and related content
 */

import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Disc3, Music, List, TrendingUp, TrendingDown, Minus, Award, BarChart3, Star } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { NotFoundState } from "@/components/ui/ErrorState";
import { useAlbum, useArtistsIndex, useSongsIndex, useAlbumChartStats, useRelatedAlbums } from "@/hooks/useChartData";
import { cn } from "@/lib/utils";

// Custom SVG Icons
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function AppleMusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.997 6.124a9.23 9.23 0 0 0-.24-2.19A5.88 5.88 0 0 0 22.3 1.776a5.87 5.87 0 0 0-2.16-1.457 9.22 9.22 0 0 0-2.19-.24A60 60 0 0 0 12 0a60 60 0 0 0-5.95.08 9.23 9.23 0 0 0-2.19.24 5.88 5.88 0 0 0-2.16 1.457 5.88 5.88 0 0 0-1.457 2.16 9.23 9.23 0 0 0-.24 2.19A60 60 0 0 0 0 12a60 60 0 0 0 .08 5.95 9.23 9.23 0 0 0 .24 2.19 5.88 5.88 0 0 0 1.457 2.16 5.88 5.88 0 0 0 2.16 1.457 9.23 9.23 0 0 0 2.19.24A60 60 0 0 0 12 24a60 60 0 0 0 5.95-.08 9.23 9.23 0 0 0 2.19-.24 5.88 5.88 0 0 0 2.16-1.457 5.88 5.88 0 0 0 1.457-2.16 9.23 9.23 0 0 0 .24-2.19A60 60 0 0 0 24 12a60 60 0 0 0-.003-5.876zM16.95 16.24a.75.75 0 0 1-.75.75h-8.4a.75.75 0 0 1-.75-.75V7.76a.75.75 0 0 1 .75-.75h8.4a.75.75 0 0 1 .75.75v8.48z"/>
      <path d="M15.75 8.75h-7.5v6.5h7.5v-6.5zm-1.5 4.5h-4.5v-2.5h4.5v2.5z"/>
    </svg>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
  gradient: string;
  subValue?: React.ReactNode;
}

function StatCard({ label, value, icon, gradient, subValue }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#252525]">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("w-8 h-8 rounded flex items-center justify-center bg-gradient-to-r", gradient)}>
          {icon}
        </div>
        <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </span>
      </div>
      <div
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}
      >
        {value ?? "-"}
      </div>
      {subValue && (
        <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {subValue}
        </div>
      )}
    </div>
  );
}

// Change Indicator Component
function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) {
    return (
      <span className="flex items-center gap-1 text-gray-500 text-xs">
        <Minus size={12} />
        NEW
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="flex items-center gap-1 text-green-500 text-xs">
        <TrendingUp size={12} />
        +{change}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="flex items-center gap-1 text-red-500 text-xs">
        <TrendingDown size={12} />
        {change}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-gray-500 text-xs">
      <Minus size={12} />
      -
    </span>
  );
}

export default function AlbumDetail() {
  const params = useParams<{ id: string }>();
  const albumId = params.id;

  const { data: album, loading: albumLoading, error: albumError } = useAlbum(albumId);
  const { data: artistsIndex } = useArtistsIndex();
  const { data: songsIndex } = useSongsIndex();
  const { data: chartStats } = useAlbumChartStats(albumId);
  const { data: relatedAlbums } = useRelatedAlbums(albumId, album?.artistId);

  // Find artist data
  const artist = artistsIndex?.artists.find((a) => a.id === album?.artistId);
  // Find songs from this album
  const albumSongs = songsIndex?.songs.filter((s) => s.albumId === album?.id) || [];

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
                    <SpotifyIcon className="w-4 h-4" />
                    Spotify
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
                    <AppleMusicIcon className="w-4 h-4" />
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
        {/* Chart Stats */}
        {chartStats && chartStats.currentRank && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Chart Performance
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Current Rank"
                value={`#${chartStats.currentRank}`}
                icon={<BarChart3 size={16} className="text-white" />}
                gradient="from-[#a855f7] to-[#ec4899]"
                subValue={<ChangeIndicator change={chartStats.change} />}
              />
              <StatCard
                label="Peak Rank"
                value={chartStats.peakRank ? `#${chartStats.peakRank}` : "-"}
                icon={<Award size={16} className="text-white" />}
                gradient="from-[#ec4899] to-[#f97316]"
              />
              <StatCard
                label="Weeks on Chart"
                value={chartStats.weeksOnChart}
                icon={<Calendar size={16} className="text-white" />}
                gradient="from-[#f97316] to-[#eab308]"
              />
              <StatCard
                label="Previous Rank"
                value={chartStats.previousRank ? `#${chartStats.previousRank}` : "NEW"}
                icon={<TrendingUp size={16} className="text-white" />}
                gradient="from-[#00d4ff] to-[#a855f7]"
              />
            </div>
          </div>
        )}

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
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group border border-transparent hover:border-[#252525]"
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
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate group-hover:text-[#a855f7] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {song.title}
                      </p>
                      {song.isTitle && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#00d4ff]/20 text-[#00d4ff] text-[9px] font-bold uppercase rounded">
                          <Star size={8} />
                          Title
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {song.artistName}
                    </p>
                  </div>
                  {song.duration && (
                    <div className="text-gray-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {formatDuration(song.duration)}
                    </div>
                  )}
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
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Artist
            </h2>
            <Link
              href={`/artists/${artist.id}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors border border-[#252525]"
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

        {/* Related Albums */}
        {relatedAlbums && relatedAlbums.length > 0 && (
          <div className="px-4 sm:px-6 py-6">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              More from {album.artistName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedAlbums.map((relatedAlbum) => {
                const relatedColors = albumTypeColors[relatedAlbum.albumType as keyof typeof albumTypeColors] || albumTypeColors.full;
                return (
                  <Link
                    key={relatedAlbum.id}
                    href={`/albums/${relatedAlbum.id}`}
                    className="block p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors border border-[#252525] group"
                  >
                    <div className="w-full aspect-square rounded overflow-hidden bg-[#252525] mb-2">
                      {relatedAlbum.coverImage ? (
                        <img src={relatedAlbum.coverImage} alt={relatedAlbum.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Disc3 size={24} />
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium truncate group-hover:text-[#a855f7] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {relatedAlbum.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {formatDate(relatedAlbum.releaseDate)}
                      </span>
                      <span className={cn("text-[9px] uppercase", relatedColors.text)} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {getAlbumTypeLabel(relatedAlbum.albumType)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
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

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
