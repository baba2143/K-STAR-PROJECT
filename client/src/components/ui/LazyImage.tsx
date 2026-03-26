/**
 * LazyImage - Optimized image component with lazy loading
 * Includes loading state and error handling
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: "square" | "video" | "auto";
}

export default function LazyImage({
  src,
  alt,
  className,
  fallbackIcon,
  aspectRatio = "auto",
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  if (!src || error) {
    return (
      <div
        ref={imgRef}
        className={cn(
          "bg-[#1a1a1a] flex items-center justify-center text-gray-600",
          aspectClasses[aspectRatio],
          className
        )}
        role="img"
        aria-label={alt}
      >
        {fallbackIcon || (
          <span className="text-2xl" aria-hidden="true">♪</span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        "overflow-hidden bg-[#1a1a1a]",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {isInView && (
        <>
          {!loaded && (
            <div
              className="absolute inset-0 animate-pulse bg-[#1a1a1a]"
              aria-hidden="true"
            />
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      )}
    </div>
  );
}
