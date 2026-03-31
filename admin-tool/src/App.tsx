import { useState, useCallback, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ChartEditor } from "@/components/charts/ChartEditor";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { ArtistManager } from "@/components/artists/ArtistManager";
import { SongManager } from "@/components/songs/SongManager";
import { AlbumManager } from "@/components/albums/AlbumManager";
import { ImportPanel, ExportPanel } from "@/components/ImportExport";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { downloadJSON, generateChartJSON, generateArtistsIndexJSON, generateSongsIndexJSON, generateAlbumsIndexJSON } from "@/lib/export";
import { loadArtists, loadSongs, loadAlbums } from "@/lib/dataApi";
import type { Artist, Song, Album } from "@/types";

type TabId = "charts" | "categories" | "artists" | "songs" | "albums" | "import" | "export" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("charts");
  const [artists, setArtists] = useState<Partial<Artist>[]>([]);
  const [songs, setSongs] = useState<Partial<Song>[]>([]);
  const [albums, setAlbums] = useState<Partial<Album>[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [artistsData, songsData, albumsData] = await Promise.all([
          loadArtists<Partial<Artist>>(),
          loadSongs<Partial<Song>>(),
          loadAlbums<Partial<Album>>(),
        ]);
        setArtists(artistsData);
        setSongs(songsData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reload data function for children to call after mutations
  const reloadData = useCallback(async () => {
    const [artistsData, songsData, albumsData] = await Promise.all([
      loadArtists<Partial<Artist>>(),
      loadSongs<Partial<Song>>(),
      loadAlbums<Partial<Album>>(),
    ]);
    setArtists(artistsData);
    setSongs(songsData);
    setAlbums(albumsData);
  }, []);

  // Export artists as JSON file
  const handleArtistsExport = useCallback((data: Partial<Artist>[]) => {
    const output = generateArtistsIndexJSON(data);
    downloadJSON(output, "artists-index.json");
  }, []);

  // Export songs as JSON file
  const handleSongsExport = useCallback((data: Partial<Song>[]) => {
    const output = generateSongsIndexJSON(data);
    downloadJSON(output, "songs-index.json");
  }, []);

  // Export albums as JSON file
  const handleAlbumsExport = useCallback((data: Partial<Album>[]) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabId)}>
      {activeTab === "charts" && (
        <ChartEditor
          onExport={handleChartExport}
          songs={songs.map((s) => ({
            id: s.id || "",
            title: s.title || "",
            artistId: s.artistId || "",
            artistName: artists.find((a) => a.id === s.artistId)?.name || "",
            spotifyId: s.spotifyId,
            coverImage: s.coverImage,
          }))}
          artists={artists.map((a) => ({ id: a.id || "", name: a.name || "" }))}
        />
      )}

      {activeTab === "categories" && <CategoryManager />}

      {activeTab === "artists" && (
        <ArtistManager
          initialArtists={artists}
          onSave={handleArtistsExport}
          onDataChange={reloadData}
        />
      )}

      {activeTab === "songs" && (
        <SongManager
          initialSongs={songs}
          artists={artists.map((a) => ({ id: a.id || "", name: a.name || "" }))}
          albums={albums.map((a) => ({ id: a.id || "", title: a.title || "", artistId: a.artistId || "" }))}
          onSave={handleSongsExport}
          onDataChange={reloadData}
        />
      )}

      {activeTab === "albums" && (
        <AlbumManager
          initialAlbums={albums}
          artists={artists.map((a) => ({ id: a.id || "", name: a.name || "" }))}
          onSave={handleAlbumsExport}
          onDataChange={reloadData}
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
                データはSupabaseクラウドデータベースに保存されています。
                すべてのデバイスで同期され、永続的に保存されます。
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-400 text-sm">Supabase接続中</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                データ統計
              </h3>
              <div className="text-gray-400 text-sm space-y-1">
                <p>アーティスト: {artists.length}件</p>
                <p>楽曲: {songs.length}件</p>
                <p>アルバム: {albums.length}件</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                バージョン情報
              </h3>
              <p className="text-gray-400 text-sm">K-STAR Admin Tool v1.1.0 (Supabase版)</p>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}

export default App;
