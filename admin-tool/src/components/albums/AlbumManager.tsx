import { useState, useCallback, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Save, X, Disc3 } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { Album, AlbumType } from "@/types";
import { saveAlbums, deleteAlbum } from "@/lib/dataApi";

const albumTypeOptions = [
  { value: "full", label: "正規アルバム" },
  { value: "mini", label: "ミニアルバム / EP" },
  { value: "single", label: "シングル" },
  { value: "repackage", label: "リパッケージ" },
  { value: "ost", label: "OST" },
  { value: "compilation", label: "コンピレーション" },
];

interface AlbumManagerProps {
  initialAlbums?: Partial<Album>[];
  artists?: { id: string; name: string }[];
  onSave?: (albums: Partial<Album>[]) => void;
  onDataChange?: () => void;
}

export function AlbumManager({ initialAlbums = [], artists = [], onSave, onDataChange }: AlbumManagerProps) {
  const [albums, setAlbums] = useState<Partial<Album>[]>(initialAlbums);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Album>>(createEmptyAlbum());

  // Update albums when initialAlbums changes
  useEffect(() => {
    setAlbums(initialAlbums);
  }, [initialAlbums]);

  const filteredAlbums = albums.filter(
    (album) =>
      album.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artistName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = useCallback(async () => {
    // Find artist name from artists list
    const selectedArtist = artists.find((a) => a.id === formData.artistId);

    let newAlbums: Partial<Album>[];
    if (editingId) {
      newAlbums = albums.map((a) =>
        a.id === editingId
          ? {
              ...formData,
              id: editingId,
              artistName: selectedArtist?.name || formData.artistName,
            }
          : a
      );
    } else {
      const newAlbum: Partial<Album> = {
        ...formData,
        id: generateId(formData.title || "album"),
        artistName: selectedArtist?.name || formData.artistName || "",
      };
      newAlbums = [...albums, newAlbum];
    }

    // Supabaseに保存
    const success = await saveAlbums(newAlbums);
    if (success) {
      setAlbums(newAlbums);
      onDataChange?.();
    } else {
      alert("保存に失敗しました");
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyAlbum());
  }, [editingId, formData, artists, albums, onDataChange]);

  const handleEdit = useCallback((album: Partial<Album>) => {
    setFormData(album);
    setEditingId(album.id || null);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("このアルバムを削除しますか？")) {
      const success = await deleteAlbum(id);
      if (success) {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
        onDataChange?.();
      } else {
        alert("削除に失敗しました");
      }
    }
  }, [onDataChange]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyAlbum());
  }, []);

  const handleExport = useCallback(() => {
    onSave?.(albums);
  }, [albums, onSave]);

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>アルバム管理</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="secondary">
              エクスポート
            </Button>
            <Button
              onClick={() => {
                setFormData(createEmptyAlbum());
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
              placeholder="アルバム名、アーティスト名で検索..."
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
              {editingId ? "アルバム編集" : "新規アルバム"}
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
                placeholder="How Sweet"
              />
              <Input
                label="タイトル (韓国語)"
                value={formData.titleKo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titleKo: e.target.value }))
                }
                placeholder="하우 스윗"
              />
              <Select
                label="アーティスト"
                options={[
                  { value: "", label: "選択してください" },
                  ...artists.map((a) => ({ value: a.id, label: a.name })),
                ]}
                value={formData.artistId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, artistId: e.target.value }))
                }
              />
              <Select
                label="アルバムタイプ"
                options={albumTypeOptions}
                value={formData.albumType || "mini"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    albumType: e.target.value as AlbumType,
                  }))
                }
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
                label="収録曲数"
                type="number"
                value={formData.trackCount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trackCount: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
                placeholder="6"
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
                label="Spotify ID"
                value={formData.spotifyId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, spotifyId: e.target.value }))
                }
                placeholder="4LH4d3cOWNNsVw41Gqt2kv"
              />
              <Input
                label="Apple Music ID"
                value={formData.appleMusicId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, appleMusicId: e.target.value }))
                }
                placeholder="1234567890"
              />
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  説明
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="アルバムの説明..."
                  rows={3}
                  className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
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

      {/* Albums List */}
      <Card>
        <CardHeader>
          <CardTitle>
            アルバム一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredAlbums.length}件)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_100px_100px_80px_80px] gap-4 px-4 py-2 text-xs font-medium text-gray-400 border-b border-border">
            <div>タイトル</div>
            <div>アーティスト</div>
            <div>タイプ</div>
            <div>リリース日</div>
            <div>曲数</div>
            <div>操作</div>
          </div>

          {/* Albums Rows */}
          <div className="divide-y divide-border">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                className="grid grid-cols-[1fr_1fr_100px_100px_80px_80px] gap-4 px-4 py-3 items-center hover:bg-bg-input/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-10 h-10 rounded object-cover bg-bg-input"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-bg-input flex items-center justify-center text-gray-500">
                      <Disc3 className="w-4 h-4" />
                    </div>
                  )}
                  <span className="font-medium text-white">{album.title}</span>
                </div>
                <div className="text-gray-300">{album.artistName || "-"}</div>
                <div className="text-gray-400 text-sm">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getAlbumTypeColor(album.albumType)}`}
                  >
                    {albumTypeOptions.find((o) => o.value === album.albumType)?.label || "-"}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  {album.releaseDate ? formatDate(album.releaseDate) : "-"}
                </div>
                <div className="text-gray-400 text-sm text-center">
                  {album.trackCount || "-"}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(album)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(album.id!)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAlbums.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              {searchQuery
                ? "検索結果がありません"
                : "アルバムがありません。「新規追加」をクリックして開始してください。"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function createEmptyAlbum(): Partial<Album> {
  return {
    title: "",
    titleKo: "",
    artistId: "",
    artistName: "",
    coverImage: "",
    releaseDate: "",
    albumType: "mini",
    trackCount: undefined,
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

function getAlbumTypeColor(type?: string): string {
  switch (type) {
    case "full":
      return "bg-purple-500/20 text-purple-400";
    case "mini":
      return "bg-cyan-500/20 text-cyan-400";
    case "single":
      return "bg-pink-500/20 text-pink-400";
    case "repackage":
      return "bg-orange-500/20 text-orange-400";
    case "ost":
      return "bg-green-500/20 text-green-400";
    case "compilation":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}
