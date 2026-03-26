import { useState, useCallback } from "react";
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { ChartType, TrendDirection, SongChartEntry } from "@/types";

const chartTypeOptions = [
  { value: "songs", label: "楽曲チャート" },
  { value: "albums", label: "アルバムチャート" },
  { value: "artists", label: "アーティストチャート" },
  { value: "streaming", label: "ストリーミング" },
  { value: "digital", label: "デジタルセールス" },
  { value: "physical", label: "フィジカルセールス" },
];

const trendOptions = [
  { value: "up", label: "↑ 上昇" },
  { value: "down", label: "↓ 下降" },
  { value: "same", label: "— 変動なし" },
  { value: "new", label: "★ 新登場" },
  { value: "re-entry", label: "↩ 再登場" },
];

interface ChartEditorEntry extends Omit<SongChartEntry, 'songId' | 'artistId'> {
  id: string; // local editing ID
}

interface ChartEditorProps {
  onExport?: (data: { chartType: ChartType; week: string; entries: ChartEditorEntry[] }) => void;
}

export function ChartEditor({ onExport }: ChartEditorProps) {
  const [chartType, setChartType] = useState<ChartType>("songs");
  const [week, setWeek] = useState(getDefaultWeek());
  const [entries, setEntries] = useState<ChartEditorEntry[]>([
    createEmptyEntry(1),
  ]);

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, createEmptyEntry(prev.length + 1)]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      // Re-rank
      return filtered.map((e, idx) => ({ ...e, rank: idx + 1 }));
    });
  }, []);

  const updateEntry = useCallback(
    (id: string, field: keyof ChartEditorEntry, value: unknown) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  const moveEntry = useCallback((id: string, direction: "up" | "down") => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx === -1) return prev;

      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;

      const newEntries = [...prev];
      [newEntries[idx], newEntries[newIdx]] = [newEntries[newIdx], newEntries[idx]];

      // Re-rank
      return newEntries.map((e, i) => ({ ...e, rank: i + 1 }));
    });
  }, []);

  const handleExport = useCallback(() => {
    onExport?.({ chartType, week, entries });
  }, [chartType, week, entries, onExport]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle>チャート編集</CardTitle>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            JSONエクスポート
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-48">
              <Select
                label="チャートタイプ"
                options={chartTypeOptions}
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
              />
            </div>
            <div className="w-48">
              <Input
                label="週"
                type="date"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            エントリー一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({entries.length}件)
            </span>
          </CardTitle>
          <Button onClick={addEntry} variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[40px_60px_1fr_1fr_80px_100px_100px_80px] gap-2 px-3 py-2 text-xs font-medium text-gray-400 border-b border-border">
            <div></div>
            <div>#</div>
            <div>タイトル</div>
            <div>アーティスト</div>
            <div>前週</div>
            <div>トレンド</div>
            <div>週数</div>
            <div>操作</div>
          </div>

          {/* Entries */}
          <div className="divide-y divide-border">
            {entries.map((entry, idx) => (
              <ChartEntryRow
                key={entry.id}
                entry={entry}
                index={idx}
                totalEntries={entries.length}
                onUpdate={(field, value) => updateEntry(entry.id, field, value)}
                onMove={(direction) => moveEntry(entry.id, direction)}
                onRemove={() => removeEntry(entry.id)}
              />
            ))}
          </div>

          {entries.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              エントリーがありません。「追加」をクリックして開始してください。
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ChartEntryRowProps {
  entry: ChartEditorEntry;
  index: number;
  totalEntries: number;
  onUpdate: (field: keyof ChartEditorEntry, value: unknown) => void;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
}

function ChartEntryRow({
  entry,
  index,
  totalEntries,
  onUpdate,
  onMove,
  onRemove,
}: ChartEntryRowProps) {
  return (
    <div className="grid grid-cols-[40px_60px_1fr_1fr_80px_100px_100px_80px] gap-2 px-3 py-3 items-center hover:bg-bg-input/50 transition-colors">
      {/* Drag Handle */}
      <div className="flex justify-center">
        <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
      </div>

      {/* Rank */}
      <div className="font-mono text-lg font-bold text-primary">
        {entry.rank}
      </div>

      {/* Title */}
      <Input
        value={entry.title}
        onChange={(e) => onUpdate("title", e.target.value)}
        placeholder="曲名"
        className="py-1.5"
      />

      {/* Artist */}
      <Input
        value={entry.artist}
        onChange={(e) => onUpdate("artist", e.target.value)}
        placeholder="アーティスト名"
        className="py-1.5"
      />

      {/* Previous Rank */}
      <Input
        type="number"
        value={entry.previousRank ?? ""}
        onChange={(e) =>
          onUpdate(
            "previousRank",
            e.target.value ? parseInt(e.target.value) : null
          )
        }
        placeholder="-"
        className="py-1.5 text-center"
        min={1}
      />

      {/* Trend */}
      <Select
        options={trendOptions}
        value={entry.trend}
        onChange={(e) => onUpdate("trend", e.target.value as TrendDirection)}
        className="py-1.5"
      />

      {/* Weeks on Chart */}
      <Input
        type="number"
        value={entry.weeksOnChart}
        onChange={(e) => onUpdate("weeksOnChart", parseInt(e.target.value) || 1)}
        className="py-1.5 text-center"
        min={1}
      />

      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={() => onMove("up")}
          disabled={index === 0}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => onMove("down")}
          disabled={index === totalEntries - 1}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultWeek(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Next Sunday
  const nextSunday = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
  return nextSunday.toISOString().split("T")[0];
}

function createEmptyEntry(rank: number): ChartEditorEntry {
  return {
    id: crypto.randomUUID(),
    rank,
    previousRank: null,
    peakPosition: rank,
    weeksOnChart: 1,
    title: "",
    artist: "",
    coverImage: "",
    trend: "new",
    isNew: true,
  };
}

// Import the Download icon
import { Download } from "lucide-react";
