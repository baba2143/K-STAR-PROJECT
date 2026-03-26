import { useState, useCallback, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ChartEditor } from "@/components/charts/ChartEditor";
import { ArtistManager } from "@/components/artists/ArtistManager";
import { SongManager } from "@/components/songs/SongManager";
import { AlbumManager } from "@/components/albums/AlbumManager";
import { ImportPanel, ExportPanel } from "@/components/ImportExport";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { downloadJSON, generateChartJSON, generateArtistsIndexJSON, generateSongsIndexJSON, generateAlbumsIndexJSON } from "@/lib/export";
import type { Artist, Song, Album } from "@/types";

type TabId = "charts" | "artists" | "songs" | "albums" | "import" | "export" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("charts");
  const [artists, setArtists] = useState<Partial<Artist>[]>([]);
  const [songs, setSongs] = useState<Partial<Song>[]>([]);
  const [albums, setAlbums] = useState<Partial<Album>[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedArtists = localStorage.getItem("kstar-artists");
    if (savedArtists) {
      try {
        setArtists(JSON.parse(savedArtists));
      } catch {
        // Ignore parse errors
      }
    }

    const savedSongs = localStorage.getItem("kstar-songs");
    if (savedSongs) {
      try {
        setSongs(JSON.parse(savedSongs));
      } catch {
        // Ignore parse errors
      }
    }

    const savedAlbums = localStorage.getItem("kstar-albums");
    if (savedAlbums) {
      try {
        setAlbums(JSON.parse(savedAlbums));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save artists to localStorage when changed
  const handleArtistsSave = useCallback((data: Partial<Artist>[]) => {
    setArtists(data);
    localStorage.setItem("kstar-artists", JSON.stringify(data));

    // Also generate and download the JSON
    const output = generateArtistsIndexJSON(data);
    downloadJSON(output, "artists-index.json");
  }, []);

  // Save songs to localStorage when changed
  const handleSongsSave = useCallback((data: Partial<Song>[]) => {
    setSongs(data);
    localStorage.setItem("kstar-songs", JSON.stringify(data));

    // Also generate and download the JSON
    const output = generateSongsIndexJSON(data);
    downloadJSON(output, "songs-index.json");
  }, []);

  // Save albums to localStorage when changed
  const handleAlbumsSave = useCallback((data: Partial<Album>[]) => {
    setAlbums(data);
    localStorage.setItem("kstar-albums", JSON.stringify(data));

    // Also generate and download the JSON
    const output = generateAlbumsIndexJSON(data);
    downloadJSON(output, "albums-index.json");
  }, []);

  const handleChartExport = useCallback(
    (data: { chartType: string; week: string; entries: unknown[] }) => {
      const output = generateChartJSON(
        data.chartType as "songs",
        data.week,
        data.entries as []
      );
      downloadJSON(output, `${data.chartType}-${data.week}.json`);
    },
    []
  );

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabId)}>
      {activeTab === "charts" && <ChartEditor onExport={handleChartExport} />}

      {activeTab === "artists" && (
        <ArtistManager initialArtists={artists} onSave={handleArtistsSave} />
      )}

      {activeTab === "songs" && (
        <SongManager
          initialSongs={songs}
          artists={artists.map((a) => ({ id: a.id || "", name: a.name || "" }))}
          albums={albums.map((a) => ({ id: a.id || "", title: a.title || "", artistId: a.artistId || "" }))}
          onSave={handleSongsSave}
        />
      )}

      {activeTab === "albums" && (
        <AlbumManager
          initialAlbums={albums}
          artists={artists.map((a) => ({ id: a.id || "", name: a.name || "" }))}
          onSave={handleAlbumsSave}
        />
      )}

      {activeTab === "import" && <ImportPanel />}

      {activeTab === "export" && <ExportPanel />}

      {activeTab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle>設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                データ保存先
              </h3>
              <p className="text-gray-400 text-sm">
                現在、データはブラウザのローカルストレージに保存されています。
                エクスポート機能を使用して、JSONファイルとしてダウンロードできます。
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                バージョン情報
              </h3>
              <p className="text-gray-400 text-sm">K-STAR Admin Tool v1.0.0</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                ローカルストレージのクリア
              </h3>
              <button
                onClick={() => {
                  if (confirm("すべてのローカルデータを削除しますか？")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                データをクリア
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}

export default App;
