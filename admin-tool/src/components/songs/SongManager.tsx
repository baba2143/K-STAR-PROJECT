import { useState, useCallback, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Save, X, Music } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { Song } from "@/types";

interface SongManagerProps {
  initialSongs?: Partial<Song>[];
  artists?: { id: string; name: string }[];
  albums?: { id: string; title: string; artistId: string }[];
  onSave?: (songs: Partial<Song>[]) => void;
}

export function SongManager({ initialSongs = [], artists = [], albums = [], onSave }: SongManagerProps) {
  const [songs, setSongs] = useState<Partial<Song>[]>(initialSongs);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Song>>(createEmptySong());

  // Update songs when initialSongs changes
  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  const filteredSongs = songs.filter(
    (song) =>
      song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter albums by selected artist
  const filteredAlbums = formData.artistId
    ? albums.filter((a) => a.artistId === formData.artistId)
    : albums;

  const handleSave = useCallback(() => {
    // Find artist name from artists list
    const selectedArtist = artists.find((a) => a.id === formData.artistId);
    const selectedAlbum = albums.find((a) => a.id === formData.albumId);

    if (editingId) {
      setSongs((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...formData,
                id: editingId,
                artistName: selectedArtist?.name || formData.artistName,
                albumName: selectedAlbum?.title,
              }
            : s
        )
      );
    } else {
      const newSong: Partial<Song> = {
        ...formData,
        id: generateId(formData.title || "song"),
        artistName: selectedArtist?.name || formData.artistName || "",
        albumName: selectedAlbum?.title,
      };
      setSongs((prev) => [...prev, newSong]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptySong());
  }, [editingId, formData, artists, albums]);

  const handleEdit = useCallback((song: Partial<Song>) => {
    setFormData(song);
    setEditingId(song.id || null);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm("この楽曲を削除しますか？")) {
      setSongs((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptySong());
  }, []);

  const handleExport = useCallback(() => {
    onSave?.(songs);
  }, [songs, onSave]);

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>楽曲管理</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="secondary">
              エクスポート
            </Button>
            <Button
              onClick={() => {
                setFormData(createEmptySong());
                setEditingId(null);
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              新規追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="曲名、アーティスト名で検索..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "楽曲編集" : "新規楽曲"}
            </CardTitle>
            <Button variant="ghost" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="タイトル (英語/ローマ字)"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Super"
              />
              <Input
                label="タイトル (韓国語)"
                value={formData.titleKo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titleKo: e.target.value }))
                }
                placeholder="슈퍼"
              />
              <Select
                label="アーティスト"
                options={[
                  { value: "", label: "選択してください" },
                  ...artists.map((a) => ({ value: a.id, label: a.name })),
                ]}
                value={formData.artistId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    artistId: e.target.value,
                    albumId: "", // Reset album when artist changes
                  }))
                }
              />
              <Select
                label="アルバム"
                options={[
                  { value: "", label: "選択してください (任意)" },
                  ...filteredAlbums.map((a) => ({ value: a.id, label: a.title })),
                ]}
                value={formData.albumId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, albumId: e.target.value }))
                }
                disabled={!formData.artistId}
              />
              <Input
                label="リリース日"
                type="date"
                value={formData.releaseDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, releaseDate: e.target.value }))
                }
              />
              <Input
                label="再生時間 (秒)"
                type="number"
                value={formData.duration || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
                placeholder="210"
              />
              <div className="col-span-2">
                <Input
                  label="カバー画像URL"
                  value={formData.coverImage || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <Input
                label="YouTube動画ID"
                value={formData.youtubeId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, youtubeId: e.target.value }))
                }
                placeholder="dQw4w9WgXcQ"
              />
              <Input
                label="Spotify ID"
                value={formData.spotifyId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, spotifyId: e.target.value }))
                }
                placeholder="4uLU6hMCjMI75M1A2tKUQC"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTitle"
                  checked={formData.isTitle || false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isTitle: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-gray-600 bg-bg-input text-primary focus:ring-primary"
                />
                <label htmlFor="isTitle" className="text-sm text-gray-300">
                  タイトル曲
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={!formData.title || !formData.artistId}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Songs List */}
      <Card>
        <CardHeader>
          <CardTitle>
            楽曲一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredSongs.length}件)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_120px_100px_80px_80px] gap-4 px-4 py-2 text-xs font-medium text-gray-400 border-b border-border">
            <div>タイトル</div>
            <div>アーティスト</div>
            <div>アルバム</div>
            <div>リリース日</div>
            <div>時間</div>
            <div>操作</div>
          </div>

          {/* Songs Rows */}
          <div className="divide-y divide-border">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className="grid grid-cols-[1fr_1fr_120px_100px_80px_80px] gap-4 px-4 py-3 items-center hover:bg-bg-input/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {song.coverImage ? (
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover bg-bg-input"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-bg-input flex items-center justify-center text-gray-500">
                      <Music className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-white block">{song.title}</span>
                    {song.isTitle && (
                      <span className="text-[10px] text-primary">タイトル曲</span>
                    )}
                  </div>
                </div>
                <div className="text-gray-300">{song.artistName || "-"}</div>
                <div className="text-gray-400 text-sm truncate">{song.albumName || "-"}</div>
                <div className="text-gray-400 text-sm">
                  {song.releaseDate ? formatDate(song.releaseDate) : "-"}
                </div>
                <div className="text-gray-400 text-sm">
                  {song.duration ? formatDuration(song.duration) : "-"}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(song)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(song.id!)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSongs.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              {searchQuery
                ? "検索結果がありません"
                : "楽曲がありません。「新規追加」をクリックして開始してください。"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function createEmptySong(): Partial<Song> {
  return {
    title: "",
    titleKo: "",
    artistId: "",
    artistName: "",
    coverImage: "",
    releaseDate: "",
    isTitle: false,
  };
}

function generateId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || crypto.randomUUID().slice(0, 8)
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
