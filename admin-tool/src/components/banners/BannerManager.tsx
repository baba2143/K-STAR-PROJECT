import { useState, useCallback, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, Save, X, Image, ExternalLink, Upload, Loader2 } from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { ChartBanner, BannerChartType } from "@/types";
import { saveBanner, deleteBanner, uploadBannerImage, loadChartTypes } from "@/lib/dataApi";

// Fallback chart types (used when DB is empty or unavailable)
const fallbackChartTypeOptions: { value: BannerChartType; label: string }[] = [
  { value: "weekly", label: "WEEKLY CHART" },
  { value: "monthly", label: "MONTHLY CHART" },
  { value: "season", label: "SEASON CHART" },
  { value: "year-end", label: "YEAR-END CHART" },
  { value: "rookie", label: "BEST ROOKIE" },
  { value: "solo", label: "BEST SOLO & FEATURING" },
  { value: "group", label: "BEST GROUP" },
  { value: "icon", label: "BEST ICON" },
  { value: "global", label: "BEST GLOBAL" },
  { value: "global-mv", label: "GLOBAL MUSIC VIDEO CHART" },
  { value: "hot-now", label: "HOT NOW MUSIC VIDEO CHART" },
];

interface BannerManagerProps {
  initialBanners?: Partial<ChartBanner>[];
  onDataChange?: () => void;
}

export function BannerManager({ initialBanners = [], onDataChange }: BannerManagerProps) {
  const [banners, setBanners] = useState<Partial<ChartBanner>[]>(initialBanners);
  const [chartTypeOptions, setChartTypeOptions] = useState<{ value: string; label: string }[]>(fallbackChartTypeOptions);

  useEffect(() => {
    setBanners(initialBanners);
  }, [initialBanners]);

  // Load chart types from database
  useEffect(() => {
    const fetchChartTypes = async () => {
      const types = await loadChartTypes();
      if (types.length > 0) {
        setChartTypeOptions(types);
      }
    };
    fetchChartTypes();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ChartBanner>>(createEmptyBanner());
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBanners = banners.filter(
    (banner) =>
      banner.chartType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.altText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = useCallback(async () => {
    const bannerData = editingId
      ? { ...formData, id: editingId }
      : { ...formData, id: generateId() };

    const success = await saveBanner(bannerData);
    if (success) {
      if (editingId) {
        setBanners((prev) => prev.map((b) => (b.id === editingId ? bannerData : b)));
      } else {
        setBanners((prev) => [...prev, bannerData]);
      }
      onDataChange?.();
    } else {
      alert("保存に失敗しました");
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyBanner());
  }, [editingId, formData, onDataChange]);

  const handleEdit = useCallback((banner: Partial<ChartBanner>) => {
    setFormData(banner);
    setEditingId(banner.id || null);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("このバナーを削除しますか？")) {
      const success = await deleteBanner(id);
      if (success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        onDataChange?.();
      } else {
        alert("削除に失敗しました");
      }
    }
  }, [onDataChange]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyBanner());
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    setUploading(true);
    try {
      const tempId = editingId || `temp-${Date.now()}`;
      const url = await uploadBannerImage(file, tempId);
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      } else {
        alert('画像のアップロードに失敗しました。Supabase Storageの「banners」バケットが作成されているか確認してください。');
      }
    } finally {
      setUploading(false);
    }
  }, [editingId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>バナー管理</CardTitle>
          <Button
            onClick={() => {
              setFormData(createEmptyBanner());
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            新規追加
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="チャートタイプで検索..."
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
              {editingId ? "バナー編集" : "新規バナー"}
            </CardTitle>
            <Button variant="ghost" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="チャートタイプ"
                options={chartTypeOptions}
                value={formData.chartType || "weekly"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    chartType: e.target.value as BannerChartType,
                  }))
                }
              />
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-bg-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-300">
                    有効
                  </label>
                </div>
              </div>
              <div className="col-span-2 space-y-3">
                <Input
                  label="画像URL"
                  value={formData.imageUrl || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="https://example.com/banner.png"
                />
                <div className="text-center text-gray-400 text-sm">または</div>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-gray-400">アップロード中...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-300">
                        画像をドラッグ&ドロップ
                      </p>
                      <p className="text-gray-500 text-sm">または</p>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        ファイルを選択
                      </Button>
                      <p className="text-gray-500 text-xs mt-2">
                        対応形式: PNG, JPG, GIF, WebP (最大5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <Input
                  label="リンクURL (クリック時の遷移先)"
                  value={formData.linkUrl || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))
                  }
                  placeholder="https://example.com/campaign"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="代替テキスト (alt属性)"
                  value={formData.altText || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, altText: e.target.value }))
                  }
                  placeholder="投票キャンペーン実施中"
                />
              </div>
              <Input
                label="表示開始日 (オプション)"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
              <Input
                label="表示終了日 (オプション)"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            {/* Preview */}
            {formData.imageUrl && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  プレビュー
                </label>
                <div className="bg-bg-input rounded-lg p-4 flex justify-center">
                  <img
                    src={formData.imageUrl}
                    alt={formData.altText || "Banner preview"}
                    className="max-h-40 rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                    }}
                  />
                </div>
              </div>
            )}

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

      {/* Banners List */}
      <Card>
        <CardHeader>
          <CardTitle>
            バナー一覧
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredBanners.length}件)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[150px_1fr_150px_80px_100px] gap-4 px-4 py-2 text-xs font-medium text-gray-400 border-b border-border">
            <div>チャートタイプ</div>
            <div>画像/リンク</div>
            <div>代替テキスト</div>
            <div>状態</div>
            <div>操作</div>
          </div>

          {/* Banners Rows */}
          <div className="divide-y divide-border">
            {filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className="grid grid-cols-[150px_1fr_150px_80px_100px] gap-4 px-4 py-3 items-center hover:bg-bg-input/50 transition-colors"
              >
                <div className="font-medium text-white">
                  {chartTypeOptions.find((o) => o.value === banner.chartType)?.label || banner.chartType}
                </div>
                <div className="flex items-center gap-3">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.altText || "Banner"}
                      className="h-12 rounded object-cover bg-bg-input"
                    />
                  ) : (
                    <div className="w-20 h-12 rounded bg-bg-input flex items-center justify-center text-gray-500">
                      <Image className="w-5 h-5" />
                    </div>
                  )}
                  {banner.linkUrl && (
                    <a
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      リンク
                    </a>
                  )}
                </div>
                <div className="text-gray-400 text-sm truncate">{banner.altText || "-"}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {banner.isActive ? "有効" : "無効"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id!)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBanners.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              {searchQuery
                ? "検索結果がありません"
                : "バナーがありません。「新規追加」をクリックして開始してください。"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function createEmptyBanner(): Partial<ChartBanner> {
  return {
    chartType: "weekly",
    imageUrl: "",
    linkUrl: "",
    altText: "",
    isActive: true,
  };
}

function generateId(): string {
  return crypto.randomUUID().slice(0, 8);
}
