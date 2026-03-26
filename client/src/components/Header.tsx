/*
 * K-STAR PROJECT - Header Component
 * Design: Neo-Brutalist × K-POP Culture
 * Sticky header: K-STAR logo + main nav + quick chart tabs
 * Dark (#0a0a0a) background, neon green active states
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, User } from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { label: "Charts", path: "/charts/songs" },
  { label: "Artists", path: "/charts/artists" },
  { label: "News", path: null },
  { label: "Videos", path: null },
  { label: "About", path: null },
];

const quickCharts = [
  { label: "K-STAR TOP 100", path: "/charts/songs" },
  { label: "ALBUM CHART", path: "/charts/albums" },
  { label: "ARTIST CHART", path: "/charts/artists" },
  { label: "STREAMING", path: null, comingSoon: true },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePlaceholderClick = (label: string) => {
    toast(`${label} — Feature coming soon`);
  };

  const isChartActive = (path: string) => {
    return location.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
      {/* Main nav bar */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-[52px]">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors lg:hidden p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="K-STAR"
                className="h-8 w-auto"
              />
              <span
                className="text-white font-bold hidden sm:inline"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontWeight: 400,
                  fontSize: "1.3rem",
                  letterSpacing: "0.08em",
                  background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                K-STAR
              </span>
            </a>
          </div>

          {/* Center: nav items */}
          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) =>
              item.path ? (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-sm text-gray-400 hover:text-white transition-colors tracking-wide font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handlePlaceholderClick(item.label)}
                  className="text-sm text-gray-400 hover:text-white transition-colors tracking-wide font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlaceholderClick("Search")}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
            <button
              onClick={() => handlePlaceholderClick("Subscribe")}
              className="hidden sm:flex items-center text-[11px] font-bold tracking-widest uppercase text-white border border-[#333] px-3 py-1.5 hover:border-[#a855f7] hover:text-[#a855f7] transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Subscribe
            </button>
            <button
              onClick={() => handlePlaceholderClick("Login")}
              className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <User size={15} />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick charts sub-nav */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-0 whitespace-nowrap">
            {quickCharts.map((chart) => {
              const isActive = chart.path ? isChartActive(chart.path) : false;

              if (chart.comingSoon || !chart.path) {
                return (
                  <button
                    key={chart.label}
                    onClick={() => handlePlaceholderClick(chart.label)}
                    className="px-4 py-2.5 text-[11px] font-bold tracking-widest text-gray-500 hover:text-gray-300 border-b-2 border-transparent transition-all duration-150"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {chart.label}
                  </button>
                );
              }

              return (
                <Link
                  key={chart.label}
                  href={chart.path}
                  className={`px-4 py-2.5 text-[11px] font-bold tracking-widest transition-all duration-150 ${
                    isActive
                      ? "border-b-2 border-[#a855f7]"
                      : "text-gray-500 hover:text-gray-300 border-b-2 border-transparent"
                  }`}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    ...(isActive && {
                      background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }),
                  }}
                >
                  {chart.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-b border-[#1a1a1a]">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#141414] transition-colors border-b border-[#141414]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => { handlePlaceholderClick(item.label); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#141414] transition-colors border-b border-[#141414]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </button>
            )
          )}
          <div className="px-4 py-3 flex gap-3">
            <button
              onClick={() => { handlePlaceholderClick("Subscribe"); setMobileMenuOpen(false); }}
              className="flex-1 text-center text-xs font-bold tracking-widest uppercase text-white border border-[#333] px-3 py-2 hover:border-[#a855f7] hover:text-[#a855f7] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Subscribe
            </button>
            <button
              onClick={() => { handlePlaceholderClick("Login"); setMobileMenuOpen(false); }}
              className="flex-1 text-center text-xs font-bold tracking-widest uppercase text-white border border-[#333] px-3 py-2 hover:border-[#a855f7] hover:text-[#a855f7] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
