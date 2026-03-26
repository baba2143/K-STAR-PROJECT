/**
 * ArtistDetail - Artist detail page
 * Shows artist profile, chart history, songs, and albums
 */

import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Users, Building2, ExternalLink } from "lucide-react";
import ChartLayout from "@/components/charts/ChartLayout";
import { DetailPageSkeleton } from "@/components/ui/Skeleton";
import { NotFoundState } from "@/components/ui/ErrorState";
import { useArtist, useArtistSongs, useArtistAlbums } from "@/hooks/useChartData";
import { cn } from "@/lib/utils";

export default function ArtistDetail() {
  const params = useParams<{ id: string }>();
  const artistId = params.id;

  const { data: artist, loading: artistLoading, error: artistError } = useArtist(artistId);
  const { data: songs, loading: songsLoading } = useArtistSongs(artistId);
  const { data: albums, loading: albumsLoading } = useArtistAlbums(artistId);

  if (artistLoading) {
    return (
      <ChartLayout>
        <div className="px-4 sm:px-6 pt-6">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Back to Artists Chart</span>
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
                      className="text-gray-500 hover:text-[#1DB954] transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {artist.socialLinks.youtube && (
                    <a
                      href={artist.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#FF0000] transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f0f0f] border-t border-[#1e1e1e]">
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
              className="text-lg font-bold uppercase mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              Members ({artist.members.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {artist.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#1a1a1a] rounded-lg p-3 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#252525] mb-2">
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
                    <p className="text-gray-500 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
            className="text-lg font-bold uppercase mb-4"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            Songs {songs.length > 0 && `(${songs.length})`}
          </h2>
          {songsLoading ? (
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Loading songs...
            </p>
          ) : songs.length > 0 ? (
            <div className="grid gap-2">
              {songs.slice(0, 10).map((song) => (
                <Link
                  key={song.id}
                  href={`/songs/${song.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                >
                  <div className="w-10 h-10 rounded overflow-hidden bg-[#252525] flex-shrink-0">
                    {song.coverImage ? (
                      <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {song.title}
                    </p>
                    <p className="text-gray-500 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {formatDate(song.releaseDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              No songs available
            </p>
          )}
        </div>

        {/* Albums Section */}
        <div className="px-4 sm:px-6 py-6">
          <h2
            className="text-lg font-bold uppercase mb-4"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            Albums {albums.length > 0 && `(${albums.length})`}
          </h2>
          {albumsLoading ? (
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Loading albums...
            </p>
          ) : albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a] mb-2">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        No Image
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
