/**
 * SongDetail - Song detail page (Enhanced)
 * Shows song info, chart stats, and related content
 */

import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, Music, Disc3, TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { DetailPageSkeleton } from "@/components/ui/skeleton";
import { NotFoundState } from "@/components/ui/ErrorState";
import { useSong, useArtistsIndex, useAlbumsIndex, useSongChartStats, useRelatedSongs } from "@/hooks/useChartData";
import { cn } from "@/lib/utils";
import { getSpotifyEmbedUrl } from "@/lib/spotify";

// Custom SVG Icons
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
  gradient: string;
  subValue?: string | null;
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

export default function SongDetail() {
  const params = useParams<{ id: string }>();
  const songId = params.id;

  const { data: song, loading: songLoading, error: songError } = useSong(songId);
  const { data: artistsIndex } = useArtistsIndex();
  const { data: albumsIndex } = useAlbumsIndex();
  const { data: chartStats } = useSongChartStats(songId);
  const { data: relatedSongs } = useRelatedSongs(songId, song?.artistId);

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
                    <YouTubeIcon className="w-4 h-4" />
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
                    <SpotifyIcon className="w-4 h-4" />
                    Spotify
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f0f0f] border-t border-[#1e1e1e]">
        {/* Spotify Embed Player */}
        {song.spotifyId && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Listen on Spotify
            </h2>
            <iframe
              src={getSpotifyEmbedUrl(song.spotifyId)}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
              title={`Listen to ${song.title} on Spotify`}
            />
          </div>
        )}

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
                gradient="from-[#00d4ff] to-[#a855f7]"
                subValue={<ChangeIndicator change={chartStats.change} /> as unknown as string}
              />
              <StatCard
                label="Peak Rank"
                value={chartStats.peakRank ? `#${chartStats.peakRank}` : "-"}
                icon={<Award size={16} className="text-white" />}
                gradient="from-[#a855f7] to-[#ec4899]"
              />
              <StatCard
                label="Weeks on Chart"
                value={chartStats.weeksOnChart}
                icon={<Calendar size={16} className="text-white" />}
                gradient="from-[#ec4899] to-[#f97316]"
              />
              <StatCard
                label="Previous Rank"
                value={chartStats.previousRank ? `#${chartStats.previousRank}` : "NEW"}
                icon={<TrendingUp size={16} className="text-white" />}
                gradient="from-[#f97316] to-[#eab308]"
              />
            </div>
          </div>
        )}

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
                  className="px-3 py-1 bg-[#1a1a1a] text-gray-300 text-sm rounded-full border border-[#252525]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Credits (Composer/Lyricist) */}
        {(song.composer || song.lyricist) && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-3"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Credits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {song.composer && (
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Composer
                  </span>
                  <p className="text-white mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {song.composer}
                  </p>
                </div>
              )}
              {song.lyricist && (
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Lyricist
                  </span>
                  <p className="text-white mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {song.lyricist}
                  </p>
                </div>
              )}
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

        {/* Album Section */}
        {album && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Album
            </h2>
            <Link
              href={`/albums/${album.id}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors border border-[#252525]"
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

        {/* Related Songs */}
        {relatedSongs && relatedSongs.length > 0 && (
          <div className="px-4 sm:px-6 py-6">
            <h2
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              More from {song.artistName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedSongs.map((relatedSong) => (
                <Link
                  key={relatedSong.id}
                  href={`/songs/${relatedSong.id}`}
                  className="block p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors border border-[#252525] group"
                >
                  <div className="w-full aspect-square rounded overflow-hidden bg-[#252525] mb-2">
                    {relatedSong.coverImage ? (
                      <img src={relatedSong.coverImage} alt={relatedSong.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Music size={24} />
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate group-hover:text-[#00d4ff] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {relatedSong.title}
                  </p>
                  {relatedSong.isTitle && (
                    <span className="text-[9px] text-[#00d4ff] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Title Track
                    </span>
                  )}
                </Link>
              ))}
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
