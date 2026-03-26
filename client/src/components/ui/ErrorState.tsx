/**
 * ErrorState - Error display component
 * Used for error states throughout the application
 */

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "wouter";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  showHomeLink = true,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-300"
      role="alert"
      aria-live="polite"
    >
      <div
        className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6"
        aria-hidden="true"
      >
        <AlertTriangle className="w-8 h-8 text-[#ec4899]" />
      </div>

      <h2
        className="text-xl font-bold text-white mb-2"
        style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}
      >
        {title}
      </h2>

      <p
        className="text-gray-400 text-sm max-w-md mb-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {message}
      </p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#a855f7] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#9333ea] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        )}

        {showHomeLink && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] text-white font-bold text-sm uppercase tracking-wider hover:border-[#a855f7] hover:text-[#a855f7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Home size={14} />
            <span>Go Home</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// Not found state (for 404 scenarios)
export function NotFoundState({
  type = "page",
  backLink,
  backLabel,
}: {
  type?: "page" | "artist" | "song" | "album" | "chart";
  backLink?: string;
  backLabel?: string;
}) {
  const messages: Record<string, { title: string; message: string }> = {
    page: {
      title: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
    },
    artist: {
      title: "Artist Not Found",
      message: "We couldn't find this artist. They may have been removed or the link is incorrect.",
    },
    song: {
      title: "Song Not Found",
      message: "We couldn't find this song. It may have been removed or the link is incorrect.",
    },
    album: {
      title: "Album Not Found",
      message: "We couldn't find this album. It may have been removed or the link is incorrect.",
    },
    chart: {
      title: "Chart Not Available",
      message: "This chart data is not available. Please try a different week or chart type.",
    },
  };

  const { title, message } = messages[type];

  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div
        className="text-6xl mb-6"
        aria-hidden="true"
      >
        🔍
      </div>

      <h2
        className="text-xl font-bold text-white mb-2"
        style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}
      >
        {title}
      </h2>

      <p
        className="text-gray-400 text-sm max-w-md mb-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {message}
      </p>

      <div className="flex items-center gap-3">
        {backLink && (
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#a855f7] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#9333ea] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span>{backLabel || "Go Back"}</span>
          </Link>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] text-white font-bold text-sm uppercase tracking-wider hover:border-[#a855f7] hover:text-[#a855f7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Home size={14} />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}

// Empty state (no content)
export function EmptyState({
  title = "No Content",
  message = "There's nothing here yet.",
  icon = "📭",
}: {
  title?: string;
  message?: string;
  icon?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      role="status"
    >
      <div
        className="text-4xl mb-4"
        aria-hidden="true"
      >
        {icon}
      </div>

      <h3
        className="text-lg font-bold text-white mb-1"
        style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}
      >
        {title}
      </h3>

      <p
        className="text-gray-500 text-sm"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {message}
      </p>
    </div>
  );
}
