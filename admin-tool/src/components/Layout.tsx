import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Music,
  Disc3,
  Download,
  Upload,
  Settings,
  FolderTree,
} from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "charts", label: "チャート編集", icon: BarChart3 },
  { id: "categories", label: "カテゴリ管理", icon: FolderTree },
  { id: "artists", label: "アーティスト", icon: Users },
  { id: "songs", label: "楽曲", icon: Music },
  { id: "albums", label: "アルバム", icon: Disc3 },
  { id: "import", label: "インポート", icon: Upload },
  { id: "export", label: "エクスポート", icon: Download },
  { id: "settings", label: "設定", icon: Settings },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">
            <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              K-STAR
            </span>
            <span className="text-gray-400 ml-2 font-normal text-sm">
              Admin
            </span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-gray-400 hover:bg-bg-input hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-gray-500">
            K-STAR PROJECT Admin Tool v1.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
