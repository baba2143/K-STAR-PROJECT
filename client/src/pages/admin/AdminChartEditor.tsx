/**
 * AdminChartEditor - Edit chart entries
 */

import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Search } from "lucide-react";
import { toast } from "sonner";

interface ChartEntry {
  rank: number;
  title: string;
  artist: string;
  previousRank: number | null;
  peakPosition: number;
  weeksOnChart: number;
  trend: "up" | "down" | "same" | "new" | "re-entry";
  coverImage?: string;
  spotifyId?: string;
}

const chartTypeLabels: Record<string, string> = {
  weekly: "WEEKLY CHART",
  monthly: "MONTHLY CHART",
  season: "SEASON CHART",
  "year-end": "YEAR-END CHART",
};

export default function AdminChartEditor() {
  const params = useParams<{ type: string; period?: string }>();
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<ChartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const chartType = params.type || "weekly";
  const period = params.period || "new";
  const isNew = period === "new";

  useEffect(() => {
    // Load existing chart data if editing
    if (!isNew) {
      loadChartData();
    } else {
      setLoading(false);
      // Start with 10 empty entries for new chart
      setEntries(
        Array.from({ length: 10 }, (_, i) => ({
          rank: i + 1,
          title: "",
          artist: "",
          previousRank: null,
          peakPosition: i + 1,
          weeksOnChart: 1,
          trend: "new" as const,
        }))
      );
    }
  }, [isNew, chartType, period]);

  const loadChartData = async () => {
    try {
      // Simulate loading chart data
      setLoading(false);
      toast.info("チャートデータを読み込みました");
    } catch (error) {
      toast.error("データの読み込みに失敗しました");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("チャートを保存しました");
      setLocation(`/admin/charts/${chartType}`);
    } catch (error) {
      toast.error("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const updateEntry = (index: number, field: keyof ChartEntry, value: string | number | null) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        rank: prev.length + 1,
        title: "",
        artist: "",
        previousRank: null,
        peakPosition: prev.length + 1,
        weeksOnChart: 1,
        trend: "new" as const,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => {
      const newEntries = prev.filter((_, i) => i !== index);
      // Re-rank entries
      return newEntries.map((entry, i) => ({ ...entry, rank: i + 1 }));
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/charts/${chartType}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {isNew ? "新規作成" : "編集"}: {chartTypeLabels[chartType]}
              </h1>
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {isNew ? "新しいチャートを作成" : `期間: ${period}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#a855f7] text-black px-4 py-2 rounded text-sm font-bold hover:bg-[#9333ea] transition-colors disabled:opacity-50"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Save size={16} />
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Period Selection */}
        {isNew && (
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 mb-6">
            <h2
              className="text-white font-bold mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              期間設定
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chartType === "weekly" && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">開始日</label>
                    <input
                      type="date"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">終了日</label>
                    <input
                      type="date"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#a855f7]"
                    />
                  </div>
                </>
              )}
              {chartType === "monthly" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">月</label>
                  <input
                    type="month"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#a855f7]"
                  />
                </div>
              )}
              {chartType === "season" && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">年</label>
                    <select className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#a855f7]">
                      <option>2025</option>
                      <option>2024</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">四半期</label>
                    <select className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#a855f7]">
                      <option value="Q1">Q1 (1-3月)</option>
                      <option value="Q2">Q2 (4-6月)</option>
                      <option value="Q3">Q3 (7-9月)</option>
                      <option value="Q4">Q4 (10-12月)</option>
                    </select>
                  </div>
                </>
              )}
              {chartType === "year-end" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">年</label>
                  <select className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:border-[#a855f7]">
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search & Add */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="曲名やアーティストで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:border-[#a855f7]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <button
            onClick={addEntry}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#252525] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Plus size={16} />
            エントリーを追加
          </button>
        </div>

        {/* Entries Table */}
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="w-8 px-2 py-3" />
                <th
                  className="w-16 text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  順位
                </th>
                <th
                  className="text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  曲名
                </th>
                <th
                  className="text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  アーティスト
                </th>
                <th
                  className="w-24 text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  前回順位
                </th>
                <th
                  className="w-20 text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  PEAK
                </th>
                <th
                  className="w-20 text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  週数
                </th>
                <th className="w-12 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {entries
                .filter(
                  (entry) =>
                    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entry.artist.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#1a1a1a] hover:bg-[#151515]"
                  >
                    <td className="px-2 py-2 text-gray-600 cursor-move">
                      <GripVertical size={16} />
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-white font-bold">{entry.rank}</span>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateEntry(index, "title", e.target.value)}
                        placeholder="曲名を入力"
                        className="w-full bg-transparent text-white border-b border-transparent hover:border-[#2a2a2a] focus:border-[#a855f7] focus:outline-none py-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={entry.artist}
                        onChange={(e) => updateEntry(index, "artist", e.target.value)}
                        placeholder="アーティスト名"
                        className="w-full bg-transparent text-gray-400 border-b border-transparent hover:border-[#2a2a2a] focus:border-[#a855f7] focus:outline-none py-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={entry.previousRank || ""}
                        onChange={(e) =>
                          updateEntry(
                            index,
                            "previousRank",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="-"
                        className="w-16 bg-transparent text-gray-400 border-b border-transparent hover:border-[#2a2a2a] focus:border-[#a855f7] focus:outline-none py-1 text-center"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={entry.peakPosition}
                        onChange={(e) =>
                          updateEntry(index, "peakPosition", parseInt(e.target.value) || 1)
                        }
                        className="w-16 bg-transparent text-gray-400 border-b border-transparent hover:border-[#2a2a2a] focus:border-[#a855f7] focus:outline-none py-1 text-center"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={entry.weeksOnChart}
                        onChange={(e) =>
                          updateEntry(index, "weeksOnChart", parseInt(e.target.value) || 1)
                        }
                        className="w-16 bg-transparent text-gray-400 border-b border-transparent hover:border-[#2a2a2a] focus:border-[#a855f7] focus:outline-none py-1 text-center"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => removeEntry(index)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          合計 {entries.length} エントリー
        </div>
      </main>
    </div>
  );
}
