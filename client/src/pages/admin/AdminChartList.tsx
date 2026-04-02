/**
 * AdminChartList - List of charts for a specific type
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Plus, Edit, Eye, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ChartPeriod {
  id: string;
  label: string;
  publishedAt: string;
  totalEntries: number;
  status: "published" | "draft";
}

const chartTypeLabels: Record<string, string> = {
  weekly: "WEEKLY CHART",
  monthly: "MONTHLY CHART",
  season: "SEASON CHART",
  "year-end": "YEAR-END CHART",
};

const chartTypeDescriptions: Record<string, string> = {
  weekly: "週間チャートの管理",
  monthly: "月間チャートの管理",
  season: "四半期チャートの管理",
  "year-end": "年間チャートの管理",
};

// Mock data - In production, this would come from API
const mockCharts: Record<string, ChartPeriod[]> = {
  weekly: [
    { id: "2025-03-22", label: "2025年3月16日 - 3月22日", publishedAt: "2025-03-22", totalEntries: 100, status: "published" },
    { id: "2025-03-15", label: "2025年3月9日 - 3月15日", publishedAt: "2025-03-15", totalEntries: 100, status: "published" },
    { id: "2025-03-08", label: "2025年3月2日 - 3月8日", publishedAt: "2025-03-08", totalEntries: 100, status: "published" },
  ],
  monthly: [
    { id: "2025-03", label: "2025年3月", publishedAt: "2025-04-01", totalEntries: 50, status: "published" },
    { id: "2025-02", label: "2025年2月", publishedAt: "2025-03-01", totalEntries: 50, status: "published" },
    { id: "2025-01", label: "2025年1月", publishedAt: "2025-02-01", totalEntries: 50, status: "published" },
  ],
  season: [
    { id: "2025-Q1", label: "2025年 Q1 (1-3月)", publishedAt: "2025-04-01", totalEntries: 50, status: "published" },
    { id: "2024-Q4", label: "2024年 Q4 (10-12月)", publishedAt: "2025-01-01", totalEntries: 50, status: "published" },
    { id: "2024-Q3", label: "2024年 Q3 (7-9月)", publishedAt: "2024-10-01", totalEntries: 50, status: "published" },
  ],
  "year-end": [
    { id: "2024", label: "2024年", publishedAt: "2025-01-01", totalEntries: 100, status: "published" },
    { id: "2023", label: "2023年", publishedAt: "2024-01-01", totalEntries: 100, status: "published" },
    { id: "2022", label: "2022年", publishedAt: "2023-01-01", totalEntries: 100, status: "published" },
  ],
};

export default function AdminChartList() {
  const params = useParams<{ type: string }>();
  const chartType = params.type || "weekly";
  const [charts, setCharts] = useState<ChartPeriod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load charts for this type
    setLoading(true);
    setTimeout(() => {
      setCharts(mockCharts[chartType] || []);
      setLoading(false);
    }, 300);
  }, [chartType]);

  const handleDelete = (id: string) => {
    if (confirm("このチャートを削除しますか？")) {
      setCharts((prev) => prev.filter((c) => c.id !== id));
      toast.success("チャートを削除しました");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {chartTypeLabels[chartType]}
              </h1>
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {chartTypeDescriptions[chartType]}
              </p>
            </div>
          </div>
          <Link
            href={`/admin/charts/${chartType}/new`}
            className="flex items-center gap-2 bg-[#a855f7] text-black px-4 py-2 rounded text-sm font-bold hover:bg-[#9333ea] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Plus size={16} />
            新規作成
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">読み込み中...</div>
        ) : charts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">チャートがありません</p>
            <Link
              href={`/admin/charts/${chartType}/new`}
              className="inline-flex items-center gap-2 bg-[#a855f7] text-black px-4 py-2 rounded text-sm font-bold hover:bg-[#9333ea] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Plus size={16} />
              最初のチャートを作成
            </Link>
          </div>
        ) : (
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
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
                    公開日
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    エントリー数
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ステータス
                  </th>
                  <th
                    className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody>
                {charts.map((chart) => (
                  <tr
                    key={chart.id}
                    className="border-b border-[#1a1a1a] hover:bg-[#151515]"
                  >
                    <td className="px-4 py-4">
                      <span className="text-white font-medium">{chart.label}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {chart.publishedAt}
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {chart.totalEntries} 曲
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          chart.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {chart.status === "published" ? "公開中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/charts/${chartType === "weekly" ? "weekly" : chartType}/${chart.id}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="プレビュー"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/charts/${chartType}/${chart.id}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="編集"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(chart.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="削除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
