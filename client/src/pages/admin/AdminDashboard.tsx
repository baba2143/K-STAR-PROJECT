/**
 * AdminDashboard - Chart Management Dashboard
 */

import { Link } from "wouter";
import { Calendar, TrendingUp, Award, BarChart3, Settings, Plus } from "lucide-react";

const chartTypes = [
  {
    id: "weekly",
    title: "WEEKLY CHART",
    description: "週間チャートの管理",
    icon: Calendar,
    path: "/admin/charts/weekly",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "monthly",
    title: "MONTHLY CHART",
    description: "月間チャートの管理",
    icon: TrendingUp,
    path: "/admin/charts/monthly",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "season",
    title: "SEASON CHART",
    description: "四半期チャートの管理",
    icon: Award,
    path: "/admin/charts/season",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "year-end",
    title: "YEAR-END CHART",
    description: "年間チャートの管理",
    icon: BarChart3,
    path: "/admin/charts/year-end",
    color: "from-orange-500 to-red-500",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="K-STAR" className="h-8 w-auto" />
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                letterSpacing: "0.08em",
                background: "linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              K-STAR ADMIN
            </span>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            サイトに戻る
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            チャート管理
          </h1>
          <p
            className="text-gray-400 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            K-STARチャートのデータを管理します
          </p>
        </div>

        {/* Chart Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chartTypes.map((chart) => {
            const Icon = chart.icon;
            return (
              <Link
                key={chart.id}
                href={chart.path}
                className="group bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 hover:border-[#2a2a2a] transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${chart.color} flex items-center justify-center mb-4`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <h3
                  className="text-white font-bold mb-1 group-hover:text-[#a855f7] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {chart.title}
                </h3>
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {chart.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2
            className="text-lg font-bold text-white mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            クイックアクション
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/charts/weekly/new"
              className="flex items-center gap-2 bg-[#a855f7] text-black px-4 py-2 rounded text-sm font-bold hover:bg-[#9333ea] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Plus size={16} />
              新しい週間チャートを作成
            </Link>
            <Link
              href="/admin/charts/monthly/new"
              className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#252525] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Plus size={16} />
              新しい月間チャートを作成
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#252525] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Settings size={16} />
              設定
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2
            className="text-lg font-bold text-white mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            最近の更新
          </h2>
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th
                    className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    チャート
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    期間
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    更新日
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1a1a1a] hover:bg-[#151515]">
                  <td className="px-4 py-3 text-white text-sm">WEEKLY CHART</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-03-22</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-03-22</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      公開中
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#1a1a1a] hover:bg-[#151515]">
                  <td className="px-4 py-3 text-white text-sm">MONTHLY CHART</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-03</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-04-01</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      公開中
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#1a1a1a] hover:bg-[#151515]">
                  <td className="px-4 py-3 text-white text-sm">SEASON CHART</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-Q1</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-04-01</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      公開中
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#151515]">
                  <td className="px-4 py-3 text-white text-sm">YEAR-END CHART</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2024</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">2025-01-01</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      公開中
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
