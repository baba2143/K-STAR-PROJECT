import { useState, useCallback } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical, FolderPlus } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export interface ChartItem {
  label: string;
  path: string;
  active: boolean;
  comingSoon?: boolean;
}

export interface Category {
  id: string;
  label: string;
  hasChildren: boolean;
  items: ChartItem[];
}

interface CategoryManagerProps {
  initialCategories?: Category[];
  onSave?: (categories: Category[]) => void;
}

const defaultCategories: Category[] = [
  {
    id: "kstar-chart",
    label: "K-STAR CHART",
    hasChildren: true,
    items: [
      { label: "WEEKLY CHART", path: "/charts/weekly", active: true },
      { label: "MONTHLY CHART", path: "/charts/monthly", active: false, comingSoon: true },
      { label: "SEASON CHART", path: "/charts/season", active: false, comingSoon: true },
      { label: "YEAR-END CHART", path: "/charts/year-end", active: false, comingSoon: true },
    ],
  },
  {
    id: "kstar-artist-chart",
    label: "K-STAR ARTIST CHART",
    hasChildren: true,
    items: [
      { label: "BEST ROOKIE", path: "/charts/artist/rookie", active: false, comingSoon: true },
      { label: "BEST SOLO&FEATURING", path: "/charts/artist/solo", active: false, comingSoon: true },
      { label: "BEST GROUP", path: "/charts/artist/group", active: false, comingSoon: true },
      { label: "BEST ICON", path: "/charts/artist/icon", active: false, comingSoon: true },
      { label: "BEST GLOBAL", path: "/charts/artist/global", active: false, comingSoon: true },
    ],
  },
  {
    id: "global-champ-chart",
    label: "GLOBAL CHAMP CHART",
    hasChildren: true,
    items: [
      { label: "GLOBAL MUSIC VIDEO CHART", path: "/charts/global/mv", active: false, comingSoon: true },
      { label: "HOT NOW MUSIC VIDEO CHART", path: "/charts/global/hot-mv", active: false, comingSoon: true },
    ],
  },
];

export function CategoryManager({ initialCategories, onSave }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories || defaultCategories
  );
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const addCategory = useCallback(() => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      label: "NEW CATEGORY",
      hasChildren: true,
      items: [],
    };
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const removeCategory = useCallback((id: string) => {
    if (confirm("このカテゴリを削除しますか？")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  const updateCategory = useCallback((id: string, field: keyof Category, value: unknown) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }, []);

  const moveCategory = useCallback((id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const newCategories = [...prev];
      [newCategories[idx], newCategories[newIdx]] = [newCategories[newIdx], newCategories[idx]];
      return newCategories;
    });
  }, []);

  const addChartItem = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: [
                ...c.items,
                {
                  label: "NEW CHART",
                  path: "/charts/new",
                  active: false,
                  comingSoon: true,
                },
              ],
            }
          : c
      )
    );
  }, []);

  const removeChartItem = useCallback((categoryId: string, itemIndex: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.filter((_, idx) => idx !== itemIndex) }
          : c
      )
    );
  }, []);

  const updateChartItem = useCallback(
    (categoryId: string, itemIndex: number, field: keyof ChartItem, value: unknown) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((item, idx) =>
                  idx === itemIndex ? { ...item, [field]: value } : item
                ),
              }
            : c
        )
      );
    },
    []
  );

  const moveChartItem = useCallback(
    (categoryId: string, itemIndex: number, direction: "up" | "down") => {
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== categoryId) return c;
          const newIdx = direction === "up" ? itemIndex - 1 : itemIndex + 1;
          if (newIdx < 0 || newIdx >= c.items.length) return c;
          const newItems = [...c.items];
          [newItems[itemIndex], newItems[newIdx]] = [newItems[newIdx], newItems[itemIndex]];
          return { ...c, items: newItems };
        })
      );
    },
    []
  );

  const handleExportJSON = useCallback(() => {
    // Also trigger onSave callback if provided
    onSave?.(categories);
    const sidebarCategories = categories.map((c) => ({
      label: c.label,
      hasChildren: c.hasChildren,
      active: false,
    }));

    const chartArrays: Record<string, ChartItem[]> = {};
    categories.forEach((c) => {
      const varName = c.label
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/-/g, "");
      chartArrays[varName] = c.items;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ管理</CardTitle>
          <div className="flex gap-2">
            <Button onClick={addCategory} variant="secondary">
              <FolderPlus className="w-4 h-4 mr-2" />
              カテゴリ追加
            </Button>
            <Button onClick={handleExportJSON}>
              JSONエクスポート
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            サイドバーに表示されるカテゴリとチャート項目を管理します。
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
                className="flex-1 font-bold text-lg"
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveCategory(category.id, "up")}
                disabled={catIdx === 0}
                className="p-2 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveCategory(category.id, "down")}
                disabled={catIdx === categories.length - 1}
                className="p-2 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeCategory(category.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
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
                  <Button onClick={() => addChartItem(category.id)} variant="secondary" className="text-xs py-1 px-2">
                    <Plus className="w-3 h-3 mr-1" />
                    項目追加
                  </Button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[30px_1fr_1fr_80px_80px_60px] gap-2 px-3 py-2 text-xs font-medium text-gray-400 border-b border-border">
                  <div></div>
                  <div>ラベル</div>
                  <div>パス</div>
                  <div>アクティブ</div>
                  <div>Coming Soon</div>
                  <div>操作</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="grid grid-cols-[30px_1fr_1fr_80px_80px_60px] gap-2 px-3 py-2 items-center hover:bg-bg-input/50"
                    >
                      <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateChartItem(category.id, itemIdx, "label", e.target.value)
                        }
                        className="py-1 text-sm"
                      />
                      <Input
                        value={item.path}
                        onChange={(e) =>
                          updateChartItem(category.id, itemIdx, "path", e.target.value)
                        }
                        className="py-1 text-sm"
                      />
                      <label className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(e) =>
                            updateChartItem(category.id, itemIdx, "active", e.target.checked)
                          }
                          className="w-4 h-4 rounded bg-bg-input border-border text-primary focus:ring-primary"
                        />
                      </label>
                      <label className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={item.comingSoon || false}
                          onChange={(e) =>
                            updateChartItem(category.id, itemIdx, "comingSoon", e.target.checked)
                          }
                          className="w-4 h-4 rounded bg-bg-input border-border text-primary focus:ring-primary"
                        />
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveChartItem(category.id, itemIdx, "up")}
                          disabled={itemIdx === 0}
                          className="p-1 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveChartItem(category.id, itemIdx, "down")}
                          disabled={itemIdx === category.items.length - 1}
                          className="p-1 text-gray-400 hover:text-white hover:bg-bg-input rounded disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeChartItem(category.id, itemIdx)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
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
