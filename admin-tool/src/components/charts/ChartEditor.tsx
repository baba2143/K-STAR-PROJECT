import { useState, useCallback } from "react";
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, Download, Search, Music } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { ChartType, TrendDirection, SongChartEntry } from "@/types";

// 楽曲データの型
interface SongData {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  spotifyId?: string;
  coverImage?: string;
}

interface ArtistData {
  id: string;
  name: string;
}

const chartTypeOptions = [
  // K-STAR CHART
  { value: "weekly", label: "WEEKLY CHART" },
  { value: "monthly", label: "MONTHLY CHART" },
  { value: "season", label: "SEASON CHART" },
  { value: "year-end", label: "YEAR-END CHART" },
  // K-STAR ARTIST CHART
  { value: "artist-rookie", label: "BEST ROOKIE" },
  { value: "artist-solo", label: "BEST SOLO&FEATURING" },
  { value: "artist-group", label: "BEST GROUP" },
  { value: "artist-icon", label: "BEST ICON" },
  { value: "artist-global", label: "BEST GLOBAL" },
  // GLOBAL CHAMP CHART
  { value: "global-mv", label: "GLOBAL MUSIC VIDEO CHART" },
  { value: "global-hot-mv", label: "HOT NOW MUSIC VIDEO CHART" },
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
  songId?: string; // 楽曲マスターとの紐付け
  artistId?: string; // アーティストマスターとの紐付け
}

interface ChartEditorProps {
  onExport?: (data: { chartType: ChartType; week: string; entries: ChartEditorEntry[] }) => void;
  songs?: SongData[];
  artists?: ArtistData[];
}

export function ChartEditor({ onExport, songs = [], artists: _artists = [] }: ChartEditorProps) {
  // Note: artists は将来的にアーティスト単独検索で使用予定
  void _artists;
  const [chartType, setChartType] = useState<ChartType>("songs");
  const [week, setWeek] = useState(getDefaultWeek());
  const [entries, setEntries] = useState<ChartEditorEntry[]>([
    createEmptyEntry(1),
  ]);

  // 楽曲追加モード: "select" | "search"
  const [addMode, setAddMode] = useState<"select" | "search">("select");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<{
    title: string;
    artist: string;
    coverImage: string;
    spotifyId: string;
    fromLocal: boolean;
    songId?: string;
    artistId?: string;
  } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Spotify oEmbed APIで楽曲情報を取得
  const fetchSpotifyInfo = async (spotifyId: string) => {
    try {
      const response = await fetch(
        `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${spotifyId}`
      );
      if (!response.ok) throw new Error("Spotify楽曲が見つかりません");
      const data = await response.json();

      // タイトルから "曲名 by アーティスト" を分離
      const titleMatch = data.title?.match(/^(.+?) by (.+)$/);
      return {
        title: titleMatch ? titleMatch[1] : data.title || "",
        artist: titleMatch ? titleMatch[2] : "",
        coverImage: data.thumbnail_url || "",
        spotifyId,
      };
    } catch {
      throw new Error("Spotify楽曲の取得に失敗しました");
    }
  };

  // ID検索ハンドラー
  const handleSearchById = async () => {
    if (!searchId.trim()) return;

    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);

    // 1. ローカル楽曲から spotifyId で検索
    const songBySpotify = songs.find((s) => s.spotifyId === searchId.trim());
    if (songBySpotify) {
      setSearchResult({
        title: songBySpotify.title,
        artist: songBySpotify.artistName,
        coverImage: songBySpotify.coverImage || "",
        spotifyId: songBySpotify.spotifyId || "",
        fromLocal: true,
        songId: songBySpotify.id,
        artistId: songBySpotify.artistId,
      });
      setSearchLoading(false);
      return;
    }

    // 2. ローカル楽曲から id で検索
    const songById = songs.find((s) => s.id === searchId.trim());
    if (songById) {
      setSearchResult({
        title: songById.title,
        artist: songById.artistName,
        coverImage: songById.coverImage || "",
        spotifyId: songById.spotifyId || "",
        fromLocal: true,
        songId: songById.id,
        artistId: songById.artistId,
      });
      setSearchLoading(false);
      return;
    }

    // 3. Spotify oEmbed APIで情報取得
    try {
      const info = await fetchSpotifyInfo(searchId.trim());
      setSearchResult({
        ...info,
        fromLocal: false,
      });
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "検索に失敗しました");
    }
    setSearchLoading(false);
  };

  // 検索結果からエントリーを追加
  const addFromSearchResult = () => {
    if (!searchResult) return;

    const newEntry: ChartEditorEntry = {
      id: crypto.randomUUID(),
      rank: entries.length + 1,
      previousRank: null,
      peakPosition: entries.length + 1,
      weeksOnChart: 1,
      title: searchResult.title,
      artist: searchResult.artist,
      coverImage: searchResult.coverImage,
      trend: "new",
      isNew: true,
      songId: searchResult.songId,
      artistId: searchResult.artistId,
    };

    setEntries((prev) => [...prev, newEntry]);
    setSearchResult(null);
    setSearchId("");
  };

  // 登録済み楽曲からエントリーを追加
  const addFromSong = (songId: string) => {
    const song = songs.find((s) => s.id === songId);
    if (!song) return;

    const newEntry: ChartEditorEntry = {
      id: crypto.randomUUID(),
      rank: entries.length + 1,
      previousRank: null,
      peakPosition: entries.length + 1,
      weeksOnChart: 1,
      title: song.title,
      artist: song.artistName,
      coverImage: song.coverImage || "",
      trend: "new",
      isNew: true,
      songId: song.id,
      artistId: song.artistId,
    };

    setEntries((prev) => [...prev, newEntry]);
  };

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

      {/* Song Add Panel */}
      <Card>
        <CardHeader>
          <CardTitle>楽曲追加</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAddMode("select")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                addMode === "select"
                  ? "bg-primary text-white"
                  : "bg-bg-input text-gray-400 hover:text-white"
              }`}
            >
              <Music className="w-4 h-4 inline mr-2" />
              登録済みから選択
            </button>
            <button
              onClick={() => setAddMode("search")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                addMode === "search"
                  ? "bg-primary text-white"
                  : "bg-bg-input text-gray-400 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              ID検索
            </button>
          </div>

          {/* Select Mode */}
          {addMode === "select" && (
            <div className="space-y-3">
              {songs.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  登録済み楽曲がありません。「楽曲管理」タブで楽曲を追加してください。
                </p>
              ) : (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Select
                      label="楽曲を選択"
                      options={[
                        { value: "", label: "楽曲を選択..." },
                        ...songs.map((s) => ({
                          value: s.id,
                          label: `${s.title} - ${s.artistName}`,
                        })),
                      ]}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          addFromSong(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Mode */}
          {addMode === "search" && (
            <div className="space-y-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    label="Spotify ID または 曲ID"
                    placeholder="例: 1CPZ5BxNNd0n0nF4Orb9JS"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchById();
                    }}
                  />
                </div>
                <Button
                  onClick={handleSearchById}
                  disabled={searchLoading || !searchId.trim()}
                >
                  {searchLoading ? "検索中..." : "検索"}
                </Button>
              </div>

              {searchError && (
                <p className="text-red-400 text-sm">{searchError}</p>
              )}

              {searchResult && (
                <div className="p-4 bg-bg-input rounded-lg space-y-3">
                  <div className="flex items-center gap-4">
                    {searchResult.coverImage && (
                      <img
                        src={searchResult.coverImage}
                        alt={searchResult.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-white">{searchResult.title}</p>
                      {searchResult.fromLocal && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">
                          登録済み楽曲
                        </span>
                      )}
                      {!searchResult.fromLocal && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs rounded">
                          Spotifyから取得（アーティスト名を入力してください）
                        </span>
                      )}
                    </div>
                  </div>
                  {/* アーティスト名入力（Spotify検索時は手動入力が必要） */}
                  {!searchResult.fromLocal && (
                    <div>
                      <Input
                        label="アーティスト名"
                        placeholder="アーティスト名を入力"
                        value={searchResult.artist}
                        onChange={(e) =>
                          setSearchResult({ ...searchResult, artist: e.target.value })
                        }
                      />
                    </div>
                  )}
                  {searchResult.fromLocal && searchResult.artist && (
                    <p className="text-gray-400 text-sm">アーティスト: {searchResult.artist}</p>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={addFromSearchResult}>
                      <Plus className="w-4 h-4 mr-2" />
                      追加
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
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

