/**
 * MobileNav - Mobile bottom navigation
 * Shows quick access to main sections on mobile devices
 */

import { Link, useLocation } from "wouter";
import { Music, Disc, Users, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Songs", path: "/charts/songs", icon: Music },
  { label: "Albums", path: "/charts/albums", icon: Disc },
  { label: "Artists", path: "/charts/artists", icon: Users },
];

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0a0a0a] border-t border-[#1a1a1a] safe-area-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-inset",
                active ? "text-[#a855f7]" : "text-gray-500"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                size={20}
                className={cn(
                  "transition-transform duration-200",
                  active && "scale-110"
                )}
              />
              <span
                className={cn(
                  "text-[10px] mt-0.5 font-medium tracking-wide",
                  active && "font-bold"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#a855f7] rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
