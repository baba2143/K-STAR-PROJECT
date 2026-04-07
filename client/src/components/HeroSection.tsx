/*
 * K-STAR PROJECT - Hero Section Component
 * Design: Neo-Brutalist × K-POP Culture
 * Large hero banner with K-STAR branding
 * Dark background with neon green outlined text
 */

interface HeroSectionProps {
  bannerImage?: string;
  chartName?: string;
}

export default function HeroSection({ bannerImage, chartName = "K-STAR CHART" }: HeroSectionProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: "300px" }}
    >
      {/* Background gradient (placeholder for K-POP imagery) */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
        }}
      />

      {/* Decorative elements - matching logo gradient colors */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #00d4ff 0%, transparent 25%),
                           radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 25%),
                           radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 30%)`,
        }}
      />

      {/* Multi-layer gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[300px] px-5 sm:px-8 pb-7 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between w-full gap-4">
          {/* Left: Text content */}
          <div>
            {/* Logo + K-STAR wordmark */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/logo.png"
                alt="K-STAR"
                className="h-12 w-auto"
              />
              <div
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: "1.3rem",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {chartName}
              </div>
            </div>

            {/* TOP 100 - large outlined text with gradient */}
            <div
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 0.88,
                letterSpacing: "0.02em",
                filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.3))",
              }}
            >
              TOP 100
            </div>

            {/* Week info row */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div
                className="text-black font-black px-3 py-1 text-sm tracking-widest uppercase"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: "0.95rem",
                  letterSpacing: "0.15em",
                  background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                }}
              >
                K-POP
              </div>
              <div
                className="text-xs font-bold tracking-widest uppercase"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.12em",
                  background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                週間チャート
              </div>
            </div>

            {/* Tagline */}
            <div className="mt-3">
              <p
                className="text-gray-400 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                K-POPの最新チャートをお届け
              </p>
            </div>
          </div>

          {/* Banner image - below text on mobile, right side on desktop */}
          {bannerImage && (
            <div className="flex-shrink-0 mt-4 sm:mt-0">
              <img
                src={bannerImage}
                alt="Banner"
                className="h-24 sm:h-32 md:h-40 lg:h-48 w-auto rounded-lg shadow-lg"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
