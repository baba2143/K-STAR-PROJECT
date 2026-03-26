import { useState, useCallback, useRef } from "react";
import { Upload, FileJson, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Select } from "@/components/ui";
import { readFile, detectFormat, importArtists, importSongs, importChartEntries } from "@/lib/import";
import { downloadJSON, generateArtistsIndexJSON, generateSongsIndexJSON, generateChartJSON } from "@/lib/export";

type ImportType = "artists" | "songs" | "charts";

interface ImportStatus {
  type: "success" | "error" | "warning";
  message: string;
}

const importTypeOptions = [
  { value: "charts", label: "チャートデータ" },
  { value: "artists", label: "アーティストデータ" },
  { value: "songs", label: "楽曲データ" },
];

export function ImportPanel() {
  const [importType, setImportType] = useState<ImportType>("charts");
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [preview, setPreview] = useState<unknown[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setStatus(null);
      setPreview(null);

      const format = detectFormat(file.name);
      if (!format) {
        setStatus({
          type: "error",
          message: "対応していないファイル形式です。CSV または JSON ファイルを選択してください。",
        });
        return;
      }

      try {
        const content = await readFile(file);

        let result;
        switch (importType) {
          case "artists":
            result = importArtists(content, format);
            break;
          case "songs":
            result = importSongs(content, format);
            break;
          case "charts":
            result = importChartEntries(content, format);
            break;
        }

        if (!result.success) {
          setStatus({ type: "error", message: result.error || "インポートに失敗しました" });
          return;
        }

        setPreview(result.data || []);
        setStatus({
          type: "success",
          message: `${result.data?.length || 0}件のデータを読み込みました`,
        });

        if (result.warnings?.length) {
          setStatus({
            type: "warning",
            message: `${result.data?.length || 0}件読み込み完了（警告: ${result.warnings.length}件）`,
          });
        }
      } catch (error) {
        setStatus({
          type: "error",
          message: error instanceof Error ? error.message : "ファイル読み込みに失敗しました",
        });
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [importType]
  );

  const handleApply = useCallback(() => {
    if (!preview) return;

    // Save to localStorage for now
    const key = `kstar-${importType}`;
    localStorage.setItem(key, JSON.stringify(preview));

    setStatus({
      type: "success",
      message: `${preview.length}件のデータを保存しました`,
    });
    setPreview(null);
  }, [importType, preview]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>データインポート</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Import Type Selection */}
        <div className="max-w-xs">
          <Select
            label="インポートタイプ"
            options={importTypeOptions}
            value={importType}
            onChange={(e) => setImportType(e.target.value as ImportType)}
          />
        </div>

        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-10 h-10 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-300 mb-2">
            クリックしてファイルを選択、またはドラッグ&ドロップ
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </span>
            <span className="flex items-center gap-1">
              <FileJson className="w-4 h-4" /> JSON
            </span>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              status.type === "error"
                ? "bg-red-500/10 text-red-400"
                : status.type === "warning"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-green-500/10 text-green-400"
            }`}
          >
            {status.type === "error" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Preview */}
        {preview && preview.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">
              プレビュー（先頭5件）
            </h3>
            <div className="bg-bg-input rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-gray-400">
                {JSON.stringify(preview.slice(0, 5), null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApply}>データを適用</Button>
              <Button variant="secondary" onClick={() => setPreview(null)}>
                キャンセル
              </Button>
            </div>
          </div>
        )}

        {/* Format Help */}
        <div className="text-sm text-gray-500">
          <h4 className="font-medium text-gray-400 mb-2">CSVフォーマット例:</h4>
          {importType === "charts" && (
            <code className="block bg-bg-input p-3 rounded text-xs">
              順位,タイトル,アーティスト,前週,週数,トレンド
              <br />
              1,Supernatural,NewJeans,2,8,up
              <br />
              2,APT.,ROSÉ & Bruno Mars,1,22,down
            </code>
          )}
          {importType === "artists" && (
            <code className="block bg-bg-input p-3 rounded text-xs">
              名前,韓国語名,タイプ,性別,事務所,デビュー日
              <br />
              NewJeans,뉴진스,group,female,ADOR,2022-07-22
            </code>
          )}
          {importType === "songs" && (
            <code className="block bg-bg-input p-3 rounded text-xs">
              タイトル,韓国語タイトル,アーティスト,アルバム,リリース日
              <br />
              Supernatural,Supernatural,NewJeans,Supernatural,2024-06-21
            </code>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ExportPanel() {
  const [exportType, setExportType] = useState<ImportType>("charts");

  const handleExport = useCallback(() => {
    const key = `kstar-${exportType}`;
    const data = localStorage.getItem(key);

    if (!data) {
      alert("エクスポートするデータがありません");
      return;
    }

    const parsed = JSON.parse(data);

    let output;
    let filename;

    switch (exportType) {
      case "artists":
        output = generateArtistsIndexJSON(parsed);
        filename = "artists-index.json";
        break;
      case "songs":
        output = generateSongsIndexJSON(parsed);
        filename = "songs-index.json";
        break;
      case "charts":
        output = generateChartJSON("songs", new Date().toISOString().split("T")[0], parsed);
        filename = `songs-${new Date().toISOString().split("T")[0]}.json`;
        break;
    }

    downloadJSON(output, filename);
  }, [exportType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>データエクスポート</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-xs">
          <Select
            label="エクスポートタイプ"
            options={importTypeOptions}
            value={exportType}
            onChange={(e) => setExportType(e.target.value as ImportType)}
          />
        </div>

        <Button onClick={handleExport}>
          JSONをダウンロード
        </Button>

        <p className="text-sm text-gray-500">
          データは K-STAR PROJECT のフォーマットに準拠したJSONファイルとしてエクスポートされます。
        </p>
      </CardContent>
    </Card>
  );
}
