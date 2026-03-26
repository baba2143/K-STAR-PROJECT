/**
 * ArtistDetail - Enhanced Artist detail page
 * Shows artist profile, chart stats, songs, albums, and related artists
 */

import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  Calendar,
  Users,
  Building2,
  TrendingUp,
  Music,
  Disc3,
  Award,
  BarChart3,
} from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { NotFoundState } from "@/components/ui/ErrorState";
import {
  useArtist,
  useArtistSongs,
  useArtistAlbums,
  useRelatedArtists,
  useArtistChartStats,
} from "@/hooks/useChartData";
import { cn } from "@/lib/utils";

// Social icons components
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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export default function ArtistDetail() {
  const params = useParams<{ id: string }>();
  const artistId = params.id;

  const { data: artist, loading: artistLoading, error: artistError } = useArtist(artistId);
  const { data: songs, loading: songsLoading } = useArtistSongs(artistId);
  const { data: albums, loading: albumsLoading } = useArtistAlbums(artistId);
  const { data: chartStats } = useArtistChartStats(artistId);
  const { data: relatedArtists } = useRelatedArtists(artistId, artist?.agency);

  if (artistLoading) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back</span>
          </div>
        </div>
        <DetailPageSkeleton />
      </ChartLayout>
    );
  }

  if (artistError || !artist) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <Link
            href="/charts/artists"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors focus-ring"
          >
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Artists Chart</span>
          </Link>
        </div>
        <NotFoundState
          type="artist"
          backLink="/charts/artists"
          backLabel="Browse Artists"
        />
      </ChartLayout>
    );
  }

  const typeLabel = getArtistTypeLabel(artist.type);
  const genderLabel = getGenderLabel(artist.gender);

  return (
    <ChartLayout>
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 pt-6">
        <Link href="/charts/artists" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Artists Chart</span>
        </Link>
      </div>

      {/* Artist Hero */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, #ec4899 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, #a855f7 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Artist Image */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#1a1a1a] flex-shrink-0 ring-4 ring-[#a855f7]/30">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                  {artist.name[0]}
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#a855f7]/20 text-[#a855f7] rounded"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {typeLabel}
                </span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#ec4899]/20 text-[#ec4899] rounded"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {genderLabel}
                </span>
                {artist.active && (
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 rounded"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Active
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl font-black uppercase"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  letterSpacing: "0.02em",
                  background: "linear-gradient(90deg, #ec4899, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {artist.name}
              </h1>

              {artist.nameKo && (
                <p className="text-gray-400 text-lg mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {artist.nameKo}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#a855f7]" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{artist.agency}</span>
                </div>
                {artist.debutDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#a855f7]" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Debut: {formatDate(artist.debutDate)}
                    </span>
                  </div>
                )}
                {artist.members && artist.members.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-[#a855f7]" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {artist.members.length} Members
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {artist.socialLinks && (
                <div className="flex items-center gap-3 mt-4">
                  {artist.socialLinks.spotify && (
                    <a
                      href={artist.socialLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400 hover:text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
                      aria-label="Spotify"
                    >
                      <SpotifyIcon className="w-4 h-4" />
                    </a>
                  )}
                  {artist.socialLinks.youtube && (
                    <a
                      href={artist.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400 hover:text-[#FF0000] hover:bg-[#FF0000]/20 transition-colors"
                      aria-label="YouTube"
                    >
                      <YouTubeIcon className="w-4 h-4" />
                    </a>
                  )}
                  {artist.socialLinks.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400 hover:text-[#E4405F] hover:bg-[#E4405F]/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  )}
                  {artist.socialLinks.twitter && (
                    <a
                      href={artist.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                  )}
                  {artist.socialLinks.tiktok && (
                    <a
                      href={artist.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Stats Cards */}
      <div className="bg-[#0a0a0a] border-y border-[#1e1e1e]">
        <div className="px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={BarChart3}
              label="Current Chart Entries"
              value={chartStats?.currentChartEntries || 0}
              color="from-[#a855f7] to-[#ec4899]"
            />
            <StatCard
              icon={TrendingUp}
              label="Highest Position"
              value={chartStats?.highestRank ? `#${chartStats.highestRank}` : "-"}
              color="from-[#00d4ff] to-[#a855f7]"
            />
            <StatCard
              icon={Award}
              label="Total Weeks on Chart"
              value={chartStats?.totalWeeksOnChart || 0}
              color="from-[#ec4899] to-[#f97316]"
            />
            <StatCard
              icon={Music}
              label="Top Song"
              value={chartStats?.topSong?.title || "-"}
              subValue={chartStats?.topSong ? `#${chartStats.topSong.rank}` : undefined}
              color="from-[#f97316] to-[#facc15]"
              isText
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f0f0f]">
        {/* Description */}
        {artist.descriptionJa && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-3"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              About
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {artist.descriptionJa}
            </p>
          </div>
        )}

        {/* Members (for groups) */}
        {artist.members && artist.members.length > 0 && (
          <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
            <h2
              className="text-lg font-bold uppercase mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              <Users size={18} className="text-[#a855f7]" />
              Members ({artist.members.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {artist.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#1a1a1a] rounded-lg p-3 text-center hover:bg-[#222] transition-colors"
                >
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#252525] mb-2 ring-2 ring-[#a855f7]/20">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {member.name}
                  </p>
                  {member.position && (
                    <p className="text-[#a855f7] text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {member.position}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Songs Section */}
        <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
          <h2
            className="text-lg font-bold uppercase mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            <Music size={18} className="text-[#a855f7]" />
            Songs {songs.length > 0 && `(${songs.length})`}
          </h2>
          {songsLoading ? (
            <div className="grid gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-[#1a1a1a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : songs.length > 0 ? (
            <div className="grid gap-2">
              {songs.slice(0, 10).map((song, index) => (
                <Link
                  key={song.id}
                  href={`/songs/${song.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors group"
                >
                  <span
                    className="w-6 text-center text-gray-500 text-sm font-bold"
                    style={{ fontFamily: "'Bebas Neue', cursive" }}
                  >
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded overflow-hidden bg-[#252525] flex-shrink-0">
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
                      {formatDate(song.releaseDate)}
                    </p>
                  </div>
                </Link>
              ))}
              {songs.length > 10 && (
                <div className="text-center pt-2">
                  <span className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    +{songs.length - 10} more songs
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              No songs available
            </p>
          )}
        </div>

        {/* Albums Section */}
        <div className="px-4 sm:px-6 py-6 border-b border-[#1e1e1e]">
          <h2
            className="text-lg font-bold uppercase mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            <Disc3 size={18} className="text-[#a855f7]" />
            Albums {albums.length > 0 && `(${albums.length})`}
          </h2>
          {albumsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-square bg-[#1a1a1a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a] mb-2 ring-1 ring-[#2a2a2a] group-hover:ring-[#a855f7] transition-all">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Disc3 size={32} />
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate group-hover:text-[#a855f7] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {album.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span>{formatDate(album.releaseDate)}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] uppercase",
                      album.albumType === "full" ? "bg-[#a855f7]/20 text-[#a855f7]" :
                      album.albumType === "mini" ? "bg-[#00d4ff]/20 text-[#00d4ff]" :
                      "bg-[#ec4899]/20 text-[#ec4899]"
                    )}>
                      {getAlbumTypeLabel(album.albumType)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              No albums available
            </p>
          )}
        </div>

        {/* Related Artists */}
        {relatedArtists && relatedArtists.length > 0 && (
          <div className="px-4 sm:px-6 py-6">
            <h2
              className="text-lg font-bold uppercase mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              <Users size={18} className="text-[#a855f7]" />
              Related Artists
              <span className="text-xs font-normal text-gray-500 ml-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                from {artist.agency}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedArtists.map((relatedArtist) => (
                <Link
                  key={relatedArtist.id}
                  href={`/artists/${relatedArtist.id}`}
                  className="group text-center"
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-[#1a1a1a] mb-2 ring-2 ring-[#2a2a2a] group-hover:ring-[#a855f7] transition-all">
                    {relatedArtist.image ? (
                      <img
                        src={relatedArtist.image}
                        alt={relatedArtist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">
                        {relatedArtist.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate group-hover:text-[#a855f7] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {relatedArtist.name}
                  </p>
                  <p className="text-gray-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {getArtistTypeLabel(relatedArtist.type)}
                  </p>
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

// Stat Card Component
interface StatCardProps {
  icon: typeof BarChart3;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  isText?: boolean;
}

function StatCard({ icon: Icon, label, value, subValue, color, isText }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r", color)}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p
        className={cn(
          "font-bold",
          isText ? "text-sm truncate" : "text-2xl"
        )}
        style={{ fontFamily: isText ? "'DM Sans', sans-serif" : "'Bebas Neue', cursive" }}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-[#a855f7] text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {subValue}
        </p>
      )}
      <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </p>
    </div>
  );
}

// Helper functions
function getArtistTypeLabel(type: string): string {
  switch (type) {
    case "group": return "Group";
    case "solo": return "Solo";
    case "unit": return "Unit";
    case "collaboration": return "Collab";
    default: return type;
  }
}

function getGenderLabel(gender: string): string {
  switch (gender) {
    case "male": return "Male";
    case "female": return "Female";
    case "mixed": return "Mixed";
    default: return gender;
  }
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
