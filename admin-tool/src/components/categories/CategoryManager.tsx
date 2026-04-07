import { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical, FolderPlus, Save, Loader2 } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { SidebarCategory, SidebarChartItem, SidebarCategoryWithItems } from "@/types";
import {
  loadSidebarCategoriesWithItems,
  saveSidebarCategory,
  saveSidebarChartItem,
  deleteSidebarCategory,
  deleteSidebarChartItem,
} from "@/lib/dataApi";

interface CategoryManagerProps {
  onDataChange?: () => void;
}

export function CategoryManager({ onDataChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<SidebarCategoryWithItems[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load categories from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loadSidebarCategoriesWithItems<SidebarCategoryWithItems>();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = useCallback(async () => {
    const newCategory: SidebarCategoryWithItems = {
      id: crypto.randomUUID().slice(0, 8),
      label: "NEW CATEGORY",
      sortOrder: categories.length,
      isActive: true,
      items: [],
    };

    setSaving(true);
    const success = await saveSidebarCategory(newCategory);
    if (success) {
      setCategories((prev) => [...prev, newCategory]);
      onDataChange?.();
    } else {
      alert("カテゴリの追加に失敗しました");
    }
    setSaving(false);
  }, [categories.length, onDataChange]);

  const removeCategory = useCallback(async (id: string) => {
    if (!confirm("このカテゴリを削除しますか？配下のチャート項目も削除されます。")) {
      return;
    }

    setSaving(true);
    const success = await deleteSidebarCategory(id);
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      onDataChange?.();
    } else {
      alert("カテゴリの削除に失敗しました");
    }
    setSaving(false);
  }, [onDataChange]);

  const updateCategory = useCallback(async (id: string, field: keyof SidebarCategory, value: unknown) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    const updatedCategory = { ...category, [field]: value };

    setSaving(true);
    const success = await saveSidebarCategory(updatedCategory);
    if (success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
      onDataChange?.();
    } else {
      alert("カテゴリの更新に失敗しました");
    }
    setSaving(false);
  }, [categories, onDataChange]);

  const moveCategory = useCallback(async (id: string, direction: "up" | "down") => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return;

    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const newCategories = [...categories];
    [newCategories[idx], newCategories[newIdx]] = [newCategories[newIdx], newCategories[idx]];

    // Update sort orders
    const updatedCategories = newCategories.map((cat, i) => ({
      ...cat,
      sortOrder: i,
    }));

    setSaving(true);
    // Save both categories with new sort orders
    const success1 = await saveSidebarCategory(updatedCategories[idx]);
    const success2 = await saveSidebarCategory(updatedCategories[newIdx]);

    if (success1 && success2) {
      setCategories(updatedCategories);
      onDataChange?.();
    } else {
      alert("順序の変更に失敗しました");
    }
    setSaving(false);
  }, [categories, onDataChange]);

  const addChartItem = useCallback(async (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const newItem: SidebarChartItem = {
      id: crypto.randomUUID().slice(0, 8),
      categoryId,
      label: "NEW CHART",
      path: "/charts/new",
      chartType: "new",
      sortOrder: category.items.length,
      isActive: true,
      comingSoon: true,
    };

    setSaving(true);
    const success = await saveSidebarChartItem(newItem);
    if (success) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, items: [...c.items, newItem] }
            : c
        )
      );
      onDataChange?.();
    } else {
      alert("チャート項目の追加に失敗しました");
    }
    setSaving(false);
  }, [categories, onDataChange]);

  const removeChartItem = useCallback(async (categoryId: string, itemId: string) => {
    if (!confirm("このチャート項目を削除しますか？")) {
      return;
    }

    setSaving(true);
    const success = await deleteSidebarChartItem(itemId);
    if (success) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.filter((item) => item.id !== itemId) }
            : c
        )
      );
      onDataChange?.();
    } else {
      alert("チャート項目の削除に失敗しました");
    }
    setSaving(false);
  }, [onDataChange]);

  const updateChartItem = useCallback(
    async (categoryId: string, itemId: string, field: keyof SidebarChartItem, value: unknown) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;

      const item = category.items.find((i) => i.id === itemId);
      if (!item) return;

      const updatedItem = { ...item, [field]: value };

      setSaving(true);
      const success = await saveSidebarChartItem(updatedItem);
      if (success) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, [field]: value } : i
                  ),
                }
              : c
          )
        );
        onDataChange?.();
      } else {
        alert("チャート項目の更新に失敗しました");
      }
      setSaving(false);
    },
    [categories, onDataChange]
  );

  const moveChartItem = useCallback(
    async (categoryId: string, itemId: string, direction: "up" | "down") => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;

      const itemIndex = category.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return;

      const newIdx = direction === "up" ? itemIndex - 1 : itemIndex + 1;
      if (newIdx < 0 || newIdx >= category.items.length) return;

      const newItems = [...category.items];
      [newItems[itemIndex], newItems[newIdx]] = [newItems[newIdx], newItems[itemIndex]];

      // Update sort orders
      const updatedItems = newItems.map((item, i) => ({
        ...item,
        sortOrder: i,
      }));

      setSaving(true);
      // Save both items with new sort orders
      const success1 = await saveSidebarChartItem(updatedItems[itemIndex]);
      const success2 = await saveSidebarChartItem(updatedItems[newIdx]);

      if (success1 && success2) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId ? { ...c, items: updatedItems } : c
          )
        );
        onDataChange?.();
      } else {
        alert("順序の変更に失敗しました");
      }
      setSaving(false);
    },
    [categories, onDataChange]
  );

  const handleExportJSON = useCallback(() => {
    const sidebarCategories = categories.map((c) => ({
      label: c.label,
      hasChildren: true,
      active: false,
    }));

    const chartArrays: Record<string, { label: string; path: string; active: boolean; comingSoon?: boolean }[]> = {};
    categories.forEach((c) => {
      const varName = c.label
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/-/g, "");
      chartArrays[varName] = c.items.map((item) => ({
        label: item.label,
        path: item.path,
        active: item.isActive && !item.comingSoon,
        comingSoon: item.comingSoon,
      }));
    });

    const output = {
      sidebarCategories,
      chartArrays,
    };

    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sidebar-categories.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-400">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ管理</CardTitle>
          <div className="flex gap-2">
            <Button onClick={addCategory} variant="secondary" disabled={saving}>
              <FolderPlus className="w-4 h-4 mr-2" />
              カテゴリ追加
            </Button>
            <Button onClick={handleExportJSON} variant="secondary">
              JSONエクスポート
            </Button>
            {saving && (
              <div className="flex items-center text-sm text-gray-400">
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                保存中...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            サイドバーに表示されるカテゴリとチャート項目を管理します。変更は自動的にデータベースに保存されます。
          </p>
        </CardContent>
      </Card>

      {/* Categories List */}
      {categories.map((category, catIdx) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-center gap-3 flex-1">
              <GripVertical className="w-5 h-5 text-gray-500 cursor-grab" />
              <Input
                value={category.label}
                onChange={(e) => updateCategory(category.id, "label", e.target.value)}
                onBlur={(e) => updateCategory(category.id, "label", e.target.value)}
                className="flex-1 font-bold text-lg"
                disabled={saving}
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveCategory(category.id, "up")}
                disabled={catIdx === 0 || saving}
                className="p-2 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveCategory(category.id, "down")}
                disabled={catIdx === categories.length - 1 || saving}
                className="p-2 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeCategory(category.id)}
                disabled={saving}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === category.id ? null : category.id)
                }
                className="p-2 text-gray-400 hover:text-white hover:bg-bg-input rounded"
              >
                {expandedCategory === category.id ? "閉じる" : "編集"}
              </button>
            </div>
          </CardHeader>

          {expandedCategory === category.id && (
            <CardContent>
              {/* Chart Items Table */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-300">
                    チャート項目 ({category.items.length}件)
                  </h4>
                  <Button
                    onClick={() => addChartItem(category.id)}
                    variant="secondary"
                    className="text-xs py-1 px-2"
                    disabled={saving}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    項目追加
                  </Button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[30px_1fr_1fr_100px_80px_80px_60px] gap-2 px-3 py-2 text-xs font-medium text-gray-400 border-b border-border">
                  <div></div>
                  <div>ラベル</div>
                  <div>パス</div>
                  <div>チャートタイプ</div>
                  <div>アクティブ</div>
                  <div>Coming Soon</div>
                  <div>操作</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[30px_1fr_1fr_100px_80px_80px_60px] gap-2 px-3 py-2 items-center hover:bg-bg-input/50"
                    >
                      <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateChartItem(category.id, item.id, "label", e.target.value)
                        }
                        className="py-1 text-sm"
                        disabled={saving}
                      />
                      <Input
                        value={item.path}
                        onChange={(e) =>
                          updateChartItem(category.id, item.id, "path", e.target.value)
                        }
                        className="py-1 text-sm"
                        disabled={saving}
                      />
                      <Input
                        value={item.chartType}
                        onChange={(e) =>
                          updateChartItem(category.id, item.id, "chartType", e.target.value)
                        }
                        className="py-1 text-sm"
                        disabled={saving}
                      />
                      <label className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) =>
                            updateChartItem(category.id, item.id, "isActive", e.target.checked)
                          }
                          disabled={saving}
                          className="w-4 h-4 rounded bg-bg-input border-border text-primary focus:ring-primary"
                        />
                      </label>
                      <label className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={item.comingSoon}
                          onChange={(e) =>
                            updateChartItem(category.id, item.id, "comingSoon", e.target.checked)
                          }
                          disabled={saving}
                          className="w-4 h-4 rounded bg-bg-input border-border text-primary focus:ring-primary"
                        />
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveChartItem(category.id, item.id, "up")}
                          disabled={itemIdx === 0 || saving}
                          className="p-1 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveChartItem(category.id, item.id, "down")}
                          disabled={itemIdx === category.items.length - 1 || saving}
                          className="p-1 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeChartItem(category.id, item.id)}
                          disabled={saving}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded disabled:opacity-30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {category.items.length === 0 && (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    チャート項目がありません。「項目追加」をクリックして開始してください。
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            カテゴリがありません。「カテゴリ追加」をクリックして開始してください。
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Re-export types for backward compatibility
export type { SidebarCategory, SidebarChartItem, SidebarCategoryWithItems };
