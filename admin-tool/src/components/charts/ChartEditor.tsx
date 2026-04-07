import { useState, useCallback, useEffect } from "react";
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, Download, Search, Music, Check, List, FileEdit, Loader2 } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { ChartType, TrendDirection, SongChartEntry } from "@/types";
import { saveChart, loadChartTypes, loadAllCharts, loadChart, deleteChart, type ChartSummary } from "@/lib/dataApi";

// 楽曲データの型
interface SongData {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  spotifyId?: string;
  coverImage?: string;
  youtubeId?: string;
}

interface ArtistData {
  id: string;
  name: string;
}

// Default chart type options (fallback if DB is empty)
const defaultChartTypeOptions = [
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
  // MV chart specific fields
  weeklyViews?: number;
  totalViews?: number;
  youtubeId?: string;
}

interface ArtistChartEditorEntry {
  id: string;
  rank: number;
  name: string;
  nameKo?: string;
  previousRank: number | null;
  peakPosition: number;
  weeksOnChart: number;
  trend: TrendDirection;
  image?: string;
  artistId?: string;
}

// Helper to check if it's an artist chart
const isArtistChartType = (type: string) => type.startsWith("artist-");

// Helper to check if it's an MV chart
const isMVChartType = (type: string) => type.startsWith("global-");

interface ChartEditorProps {
  onExport?: (data: { chartType: ChartType; week: string; entries: ChartEditorEntry[] }) => void;
  songs?: SongData[];
  artists?: ArtistData[];
}

export function ChartEditor({ onExport, songs = [], artists = [] }: ChartEditorProps) {
  const [chartType, setChartType] = useState<ChartType>("songs");
  const [week, setWeek] = useState(getDefaultWeek());
  const [entries, setEntries] = useState<ChartEditorEntry[]>([
    createEmptyEntry(1),
  ]);
  const [artistEntries, setArtistEntries] = useState<ArtistChartEditorEntry[]>([
    createEmptyArtistEntry(1),
  ]);
  const [chartTypeOptions, setChartTypeOptions] = useState(defaultChartTypeOptions);

  // Saved charts list
  const [savedCharts, setSavedCharts] = useState<ChartSummary[]>([]);
  const [showSavedCharts, setShowSavedCharts] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  // Load chart types from DB
  useEffect(() => {
    async function fetchChartTypes() {
      const types = await loadChartTypes();
      if (types.length > 0) {
        setChartTypeOptions(types);
      }
      // If DB returns empty, keep using defaultChartTypeOptions
    }
    fetchChartTypes();
  }, []);

  // Load saved charts list
  const refreshSavedCharts = useCallback(async () => {
    setLoadingCharts(true);
    const charts = await loadAllCharts();
    setSavedCharts(charts);
    setLoadingCharts(false);
  }, []);

  useEffect(() => {
    refreshSavedCharts();
  }, [refreshSavedCharts]);

  // Load a saved chart for editing
  const handleLoadChart = useCallback(async (ct: string, w: string) => {
    setLoadingChart(true);
    const data = await loadChart<{ entries: ChartEditorEntry[] | ArtistChartEditorEntry[] }>(ct, w);
    if (data) {
      setChartType(ct as ChartType);
      setWeek(w);

      const isArtist = isArtistChartType(ct);
      if (isArtist) {
        const artistData = (data.entries || []) as ArtistChartEditorEntry[];
        setArtistEntries(artistData.map((e, idx) => ({ ...e, id: e.id || crypto.randomUUID(), rank: idx + 1 })));
        setEntries([createEmptyEntry(1)]);
      } else {
        const songData = (data.entries || []) as ChartEditorEntry[];
        setEntries(songData.map((e, idx) => ({ ...e, id: e.id || crypto.randomUUID(), rank: idx + 1 })));
        setArtistEntries([createEmptyArtistEntry(1)]);
      }
    }
    setLoadingChart(false);
    setShowSavedCharts(false);
  }, []);

  // Delete a saved chart
  const handleDeleteChart = useCallback(async (ct: string, w: string) => {
    if (!confirm(`チャート「${ct} - ${w}」を削除しますか？`)) return;
    const success = await deleteChart(ct, w);
    if (success) {
      refreshSavedCharts();
    }
  }, [refreshSavedCharts]);

  const isArtistChart = isArtistChartType(chartType);
  const isMVChart = isMVChartType(chartType);

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
      youtubeId: song.youtubeId,
      weeklyViews: 0,
      totalViews: 0,
    };

    setEntries((prev) => [...prev, newEntry]);
  };

  const addEntry = useCallback(() => {
    if (isArtistChart) {
      setArtistEntries((prev) => [...prev, createEmptyArtistEntry(prev.length + 1)]);
    } else {
      setEntries((prev) => [...prev, createEmptyEntry(prev.length + 1)]);
    }
  }, [isArtistChart]);

  const removeEntry = useCallback((id: string) => {
    if (isArtistChart) {
      setArtistEntries((prev) => {
        const filtered = prev.filter((e) => e.id !== id);
        return filtered.map((e, idx) => ({ ...e, rank: idx + 1 }));
      });
    } else {
      setEntries((prev) => {
        const filtered = prev.filter((e) => e.id !== id);
        return filtered.map((e, idx) => ({ ...e, rank: idx + 1 }));
      });
    }
  }, [isArtistChart]);

  const updateEntry = useCallback(
    (id: string, field: keyof ChartEditorEntry, value: unknown) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  const updateArtistEntry = useCallback(
    (id: string, field: keyof ArtistChartEditorEntry, value: unknown) => {
      setArtistEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  const moveEntry = useCallback((id: string, direction: "up" | "down") => {
    if (isArtistChart) {
      setArtistEntries((prev) => {
        const idx = prev.findIndex((e) => e.id === id);
        if (idx === -1) return prev;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= prev.length) return prev;
        const newEntries = [...prev];
        [newEntries[idx], newEntries[newIdx]] = [newEntries[newIdx], newEntries[idx]];
        return newEntries.map((e, i) => ({ ...e, rank: i + 1 }));
      });
    } else {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.id === id);
        if (idx === -1) return prev;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= prev.length) return prev;
        const newEntries = [...prev];
        [newEntries[idx], newEntries[newIdx]] = [newEntries[newIdx], newEntries[idx]];
        return newEntries.map((e, i) => ({ ...e, rank: i + 1 }));
      });
    }
  }, [isArtistChart]);

  // 登録済みアーティストからエントリーを追加
  const addFromArtist = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;

    const newEntry: ArtistChartEditorEntry = {
      id: crypto.randomUUID(),
      rank: artistEntries.length + 1,
      name: artist.name,
      nameKo: "",
      previousRank: null,
      peakPosition: artistEntries.length + 1,
      weeksOnChart: 1,
      trend: "new",
      artistId: artist.id,
    };

    setArtistEntries((prev) => [...prev, newEntry]);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleExport = useCallback(async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // チャートデータを構築
    const chartData = isArtistChart
      ? {
          chartType,
          week,
          updatedAt: new Date().toISOString(),
          entries: artistEntries.map((e) => ({
            rank: e.rank,
            artistId: e.artistId,
            name: e.name,
            nameKo: e.nameKo,
            image: e.image,
            previousRank: e.previousRank,
            peakPosition: e.peakPosition,
            weeksOnChart: e.weeksOnChart,
            trend: e.trend,
          })),
        }
      : isMVChart
        ? {
            chartType,
            week,
            updatedAt: new Date().toISOString(),
            entries: entries.map((e) => ({
              rank: e.rank,
              songId: e.songId,
              artistId: e.artistId,
              title: e.title,
              artist: e.artist,
              coverImage: e.coverImage,
              youtubeId: e.youtubeId,
              weeklyViews: e.weeklyViews || 0,
              totalViews: e.totalViews || 0,
              previousRank: e.previousRank,
              trend: e.trend,
            })),
          }
        : {
            chartType,
            week,
            updatedAt: new Date().toISOString(),
            entries: entries.map((e) => ({
              rank: e.rank,
              songId: e.songId,
              artistId: e.artistId,
              title: e.title,
              artist: e.artist,
              coverImage: e.coverImage,
              previousRank: e.previousRank,
              peakPosition: e.peakPosition,
              weeksOnChart: e.weeksOnChart,
              trend: e.trend,
              isNew: e.isNew,
            })),
          };

    // Supabaseに保存
    const success = await saveChart(chartType, week, chartData);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      // Refresh saved charts list
      refreshSavedCharts();
    }

    // 従来のエクスポート処理も実行
    onExport?.({ chartType, week, entries });

    setIsSaving(false);
  }, [chartType, week, entries, artistEntries, isArtistChart, isMVChart, onExport, refreshSavedCharts]);

  // Helper to get chart type label
  const getChartTypeLabel = (ct: string) => {
    const option = chartTypeOptions.find((o) => o.value === ct);
    return option?.label || ct;
  };

  return (
    <div className="space-y-6">
      {/* Saved Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            保存済みチャート一覧
          </CardTitle>
          <Button
            variant="secondary"
            onClick={() => setShowSavedCharts(!showSavedCharts)}
          >
            {showSavedCharts ? "閉じる" : `表示 (${savedCharts.length}件)`}
          </Button>
        </CardHeader>
        {showSavedCharts && (
          <CardContent>
            {loadingCharts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : savedCharts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                保存済みのチャートはありません
              </p>
            ) : (
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_120px_100px_180px_100px] gap-2 px-3 py-2 text-xs font-medium text-gray-400 border-b border-border">
                  <div>チャートタイプ</div>
                  <div>週</div>
                  <div>エントリー数</div>
                  <div>更新日時</div>
                  <div>操作</div>
                </div>
                {/* Chart Rows */}
                {savedCharts.map((chart) => (
                  <div
                    key={`${chart.chartType}-${chart.week}`}
                    className="grid grid-cols-[1fr_120px_100px_180px_100px] gap-2 px-3 py-3 items-center hover:bg-bg-input/50 rounded-lg transition-colors"
                  >
                    <div className="text-white font-medium text-sm">
                      {getChartTypeLabel(chart.chartType)}
                    </div>
                    <div className="text-gray-400 text-sm">{chart.week}</div>
                    <div className="text-gray-400 text-sm">{chart.entryCount}件</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(chart.updatedAt).toLocaleString("ja-JP")}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLoadChart(chart.chartType, chart.week)}
                        disabled={loadingChart}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                        title="編集"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChart(chart.chartType, chart.week)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle>チャート編集</CardTitle>
          <Button onClick={handleExport} disabled={isSaving}>
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-400" />
                保存完了
              </>
            ) : isSaving ? (
              "保存中..."
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                保存 & エクスポート
              </>
            )}
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

      {/* Song/Artist Add Panel */}
      {isArtistChart ? (
        <Card>
          <CardHeader>
            <CardTitle>アーティスト追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {artists.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  登録済みアーティストがありません。「アーティスト管理」タブでアーティストを追加してください。
                </p>
              ) : (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Select
                      label="アーティストを選択"
                      options={[
                        { value: "", label: "アーティストを選択..." },
                        ...artists.map((a) => ({
                          value: a.id,
                          label: a.name,
                        })),
                      ]}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          addFromArtist(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
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
      )}

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            エントリー一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({isArtistChart ? artistEntries.length : entries.length}件)
            </span>
          </CardTitle>
          <Button onClick={addEntry} variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          {isArtistChart ? (
            <>
              {/* Artist Table Header */}
              <div className="grid grid-cols-[40px_60px_1fr_1fr_80px_100px_100px_80px] gap-2 px-3 py-2 text-xs font-medium text-gray-400 border-b border-border">
                <div></div>
                <div>#</div>
                <div>アーティスト名</div>
                <div>韓国語名</div>
                <div>前週</div>
                <div>トレンド</div>
                <div>週数</div>
                <div>操作</div>
              </div>

              {/* Artist Entries */}
              <div className="divide-y divide-border">
                {artistEntries.map((entry, idx) => (
                  <ArtistChartEntryRow
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    totalEntries={artistEntries.length}
                    onUpdate={(field, value) => updateArtistEntry(entry.id, field, value)}
                    onMove={(direction) => moveEntry(entry.id, direction)}
                    onRemove={() => removeEntry(entry.id)}
                  />
                ))}
              </div>

              {artistEntries.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  エントリーがありません。「追加」をクリックして開始してください。
                </div>
              )}
            </>
          ) : isMVChart ? (
            <>
              {/* MV Table Header */}
              <div className="grid grid-cols-[40px_60px_1fr_1fr_120px_120px_80px_100px_80px] gap-2 px-3 py-2 text-xs font-medium text-gray-400 border-b border-border">
                <div></div>
                <div>#</div>
                <div>MV名</div>
                <div>アーティスト</div>
                <div>週間再生数</div>
                <div>総再生数</div>
                <div>前週</div>
                <div>トレンド</div>
                <div>操作</div>
              </div>

              {/* MV Entries */}
              <div className="divide-y divide-border">
                {entries.map((entry, idx) => (
                  <MVChartEntryRow
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
            </>
          ) : (
            <>
              {/* Song Table Header */}
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

              {/* Song Entries */}
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
            </>
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

function createEmptyArtistEntry(rank: number): ArtistChartEditorEntry {
  return {
    id: crypto.randomUUID(),
    rank,
    name: "",
    nameKo: "",
    previousRank: null,
    peakPosition: rank,
    weeksOnChart: 1,
    trend: "new",
  };
}

interface ArtistChartEntryRowProps {
  entry: ArtistChartEditorEntry;
  index: number;
  totalEntries: number;
  onUpdate: (field: keyof ArtistChartEditorEntry, value: unknown) => void;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
}

function ArtistChartEntryRow({
  entry,
  index,
  totalEntries,
  onUpdate,
  onMove,
  onRemove,
}: ArtistChartEntryRowProps) {
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

      {/* Artist Name */}
      <Input
        value={entry.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        placeholder="アーティスト名"
        className="py-1.5"
      />

      {/* Korean Name */}
      <Input
        value={entry.nameKo || ""}
        onChange={(e) => onUpdate("nameKo", e.target.value)}
        placeholder="韓国語名（任意）"
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

interface MVChartEntryRowProps {
  entry: ChartEditorEntry;
  index: number;
  totalEntries: number;
  onUpdate: (field: keyof ChartEditorEntry, value: unknown) => void;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
}

function MVChartEntryRow({
  entry,
  index,
  totalEntries,
  onUpdate,
  onMove,
  onRemove,
}: MVChartEntryRowProps) {
  return (
    <div className="grid grid-cols-[40px_60px_1fr_1fr_120px_120px_80px_100px_80px] gap-2 px-3 py-3 items-center hover:bg-bg-input/50 transition-colors">
      {/* Drag Handle */}
      <div className="flex justify-center">
        <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
      </div>

      {/* Rank */}
      <div className="font-mono text-lg font-bold text-primary">
        {entry.rank}
      </div>

      {/* Title (MV Name) */}
      <Input
        value={entry.title}
        onChange={(e) => onUpdate("title", e.target.value)}
        placeholder="MV名"
        className="py-1.5"
      />

      {/* Artist */}
      <Input
        value={entry.artist}
        onChange={(e) => onUpdate("artist", e.target.value)}
        placeholder="アーティスト名"
        className="py-1.5"
      />

      {/* Weekly Views */}
      <Input
        type="number"
        value={entry.weeklyViews ?? ""}
        onChange={(e) =>
          onUpdate("weeklyViews", e.target.value ? parseInt(e.target.value) : 0)
        }
        placeholder="0"
        className="py-1.5 text-right"
        min={0}
      />

      {/* Total Views */}
      <Input
        type="number"
        value={entry.totalViews ?? ""}
        onChange={(e) =>
          onUpdate("totalViews", e.target.value ? parseInt(e.target.value) : 0)
        }
        placeholder="0"
        className="py-1.5 text-right"
        min={0}
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

