import { useState, useCallback, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Save, X } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { Artist, ArtistType, GenderCategory } from "@/types";
import { saveArtists, deleteArtist } from "@/lib/dataApi";

const artistTypeOptions = [
  { value: "group", label: "グループ" },
  { value: "solo", label: "ソロ" },
  { value: "unit", label: "ユニット" },
  { value: "collaboration", label: "コラボレーション" },
];

const genderOptions = [
  { value: "female", label: "女性" },
  { value: "male", label: "男性" },
  { value: "mixed", label: "混成" },
];

interface ArtistManagerProps {
  initialArtists?: Partial<Artist>[];
  onSave?: (artists: Partial<Artist>[]) => void;
  onDataChange?: () => void;
}

export function ArtistManager({ initialArtists = [], onSave, onDataChange }: ArtistManagerProps) {
  const [artists, setArtists] = useState<Partial<Artist>[]>(initialArtists);

  // Sync with initialArtists when it changes
  useEffect(() => {
    setArtists(initialArtists);
  }, [initialArtists]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Artist>>(createEmptyArtist());

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.nameKo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.agency?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = useCallback(async () => {
    let newArtists: Partial<Artist>[];
    if (editingId) {
      newArtists = artists.map((a) => (a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      const newArtist = {
        ...formData,
        id: generateId(formData.name || "artist"),
      };
      newArtists = [...artists, newArtist];
    }

    // Supabaseに保存
    const success = await saveArtists(newArtists);
    if (success) {
      setArtists(newArtists);
      onDataChange?.();
    } else {
      alert("保存に失敗しました");
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyArtist());
  }, [editingId, formData, artists, onDataChange]);

  const handleEdit = useCallback((artist: Partial<Artist>) => {
    setFormData(artist);
    setEditingId(artist.id || null);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("このアーティストを削除しますか？")) {
      const success = await deleteArtist(id);
      if (success) {
        setArtists((prev) => prev.filter((a) => a.id !== id));
        onDataChange?.();
      } else {
        alert("削除に失敗しました");
      }
    }
  }, [onDataChange]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyArtist());
  }, []);

  const handleExport = useCallback(() => {
    onSave?.(artists);
  }, [artists, onSave]);

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>アーティスト管理</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="secondary">
              エクスポート
            </Button>
            <Button
              onClick={() => {
                setFormData(createEmptyArtist());
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
              placeholder="アーティスト名、事務所で検索..."
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
              {editingId ? "アーティスト編集" : "新規アーティスト"}
            </CardTitle>
            <Button variant="ghost" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="名前 (英語/ローマ字)"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="NewJeans"
              />
              <Input
                label="名前 (韓国語)"
                value={formData.nameKo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nameKo: e.target.value }))
                }
                placeholder="뉴진스"
              />
              <Select
                label="タイプ"
                options={artistTypeOptions}
                value={formData.type || "group"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as ArtistType,
                  }))
                }
              />
              <Select
                label="性別"
                options={genderOptions}
                value={formData.gender || "female"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: e.target.value as GenderCategory,
                  }))
                }
              />
              <Input
                label="事務所"
                value={formData.agency || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, agency: e.target.value }))
                }
                placeholder="ADOR"
              />
              <Input
                label="デビュー日"
                type="date"
                value={formData.debutDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, debutDate: e.target.value }))
                }
              />
              <div className="col-span-2">
                <Input
                  label="プロフィール画像URL"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Artists List */}
      <Card>
        <CardHeader>
          <CardTitle>
            アーティスト一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredArtists.length}件)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_120px_120px_100px_100px] gap-4 px-4 py-2 text-xs font-medium text-gray-400 border-b border-border">
            <div>名前</div>
            <div>韓国語名</div>
            <div>タイプ</div>
            <div>事務所</div>
            <div>デビュー</div>
            <div>操作</div>
          </div>

          {/* Artists Rows */}
          <div className="divide-y divide-border">
            {filteredArtists.map((artist) => (
              <div
                key={artist.id}
                className="grid grid-cols-[1fr_1fr_120px_120px_100px_100px] gap-4 px-4 py-3 items-center hover:bg-bg-input/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {artist.image ? (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full object-cover bg-bg-input"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-bg-input flex items-center justify-center text-gray-500 text-sm">
                      {artist.name?.[0]}
                    </div>
                  )}
                  <span className="font-medium text-white">{artist.name}</span>
                </div>
                <div className="text-gray-300">{artist.nameKo || "-"}</div>
                <div className="text-gray-400">
                  {artistTypeOptions.find((o) => o.value === artist.type)?.label || "-"}
                </div>
                <div className="text-gray-400">{artist.agency || "-"}</div>
                <div className="text-gray-400 text-sm">
                  {artist.debutDate ? formatDate(artist.debutDate) : "-"}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(artist)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(artist.id!)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredArtists.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              {searchQuery
                ? "検索結果がありません"
                : "アーティストがありません。「新規追加」をクリックして開始してください。"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function createEmptyArtist(): Partial<Artist> {
  return {
    name: "",
    nameKo: "",
    type: "group",
    gender: "female",
    agency: "",
    image: "",
    active: true,
  };
}

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || crypto.randomUUID().slice(0, 8);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
