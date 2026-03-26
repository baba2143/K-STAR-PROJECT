import type { Artist, Song, SongChartEntry, ChartWeekData } from "@/types";

export interface ImportResult<T> {
  success: boolean;
  data?: T[];
  error?: string;
  warnings?: string[];
}

/**
 * Parse CSV content to array of objects
 */
export function parseCSV<T extends Record<string, unknown>>(
  content: string,
  mapping?: Record<string, keyof T>
): ImportResult<T> {
  try {
    const lines = content.trim().split("\n");
    if (lines.length < 2) {
      return { success: false, error: "CSVファイルにデータがありません" };
    }

    const headers = parseCSVLine(lines[0]);
    const data: T[] = [];
    const warnings: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        warnings.push(`行 ${i + 1}: カラム数が一致しません`);
        continue;
      }

      const row: Record<string, unknown> = {};
      headers.forEach((header, idx) => {
        const key = mapping?.[header] ?? (header as keyof T);
        row[key as string] = values[idx];
      });
      data.push(row as T);
    }

    return { success: true, data, warnings: warnings.length > 0 ? warnings : undefined };
  } catch (error) {
    return {
      success: false,
      error: `CSVパース中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * Parse JSON content
 */
export function parseJSON<T>(content: string): ImportResult<T> {
  try {
    const data = JSON.parse(content);

    // Check if it's an array or object with data array
    let items: T[];
    if (Array.isArray(data)) {
      items = data;
    } else if (data.artists) {
      items = data.artists;
    } else if (data.songs) {
      items = data.songs;
    } else if (data.albums) {
      items = data.albums;
    } else if (data.entries) {
      items = data.entries;
    } else if (data.data) {
      items = data.data;
    } else {
      return { success: false, error: "認識可能なデータ形式ではありません" };
    }

    return { success: true, data: items };
  } catch (error) {
    return {
      success: false,
      error: `JSONパース中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Import artists from file content
 */
export function importArtists(
  content: string,
  format: "csv" | "json"
): ImportResult<Partial<Artist>> {
  if (format === "json") {
    return parseJSON<Partial<Artist>>(content);
  }

  const csvMapping: Record<string, keyof Artist> = {
    name: "name",
    "名前": "name",
    nameKo: "nameKo",
    "韓国語名": "nameKo",
    type: "type",
    "タイプ": "type",
    gender: "gender",
    "性別": "gender",
    agency: "agency",
    "事務所": "agency",
    image: "image",
    "画像URL": "image",
    debutDate: "debutDate",
    "デビュー日": "debutDate",
  };

  return parseCSV<Partial<Artist>>(content, csvMapping);
}

/**
 * Import songs from file content
 */
export function importSongs(
  content: string,
  format: "csv" | "json"
): ImportResult<Partial<Song>> {
  if (format === "json") {
    return parseJSON<Partial<Song>>(content);
  }

  const csvMapping: Record<string, keyof Song> = {
    title: "title",
    "タイトル": "title",
    titleKo: "titleKo",
    "韓国語タイトル": "titleKo",
    artistName: "artistName",
    "アーティスト": "artistName",
    albumName: "albumName",
    "アルバム": "albumName",
    releaseDate: "releaseDate",
    "リリース日": "releaseDate",
    coverImage: "coverImage",
    "画像URL": "coverImage",
  };

  return parseCSV<Partial<Song>>(content, csvMapping);
}

/**
 * Import chart entries from file content
 */
export function importChartEntries(
  content: string,
  format: "csv" | "json"
): ImportResult<Partial<SongChartEntry>> {
  if (format === "json") {
    // Try to parse as raw JSON first
    try {
      const parsed = JSON.parse(content);

      // Check if it's a ChartWeekData object
      if (parsed.entries && Array.isArray(parsed.entries)) {
        return {
          success: true,
          data: (parsed as ChartWeekData<SongChartEntry>).entries,
        };
      }

      // Check if it's an array of entries
      if (Array.isArray(parsed)) {
        return { success: true, data: parsed };
      }

      return { success: false, error: "認識可能なチャートデータ形式ではありません" };
    } catch (error) {
      return {
        success: false,
        error: `JSONパース中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  const csvMapping: Record<string, keyof SongChartEntry> = {
    rank: "rank",
    "順位": "rank",
    title: "title",
    "タイトル": "title",
    artist: "artist",
    "アーティスト": "artist",
    previousRank: "previousRank",
    "前週": "previousRank",
    weeksOnChart: "weeksOnChart",
    "週数": "weeksOnChart",
    trend: "trend",
    "トレンド": "trend",
    coverImage: "coverImage",
    "画像URL": "coverImage",
  };

  const result = parseCSV<Partial<SongChartEntry>>(content, csvMapping);

  // Convert numeric strings to numbers
  if (result.success && result.data) {
    result.data = result.data.map((entry) => ({
      ...entry,
      rank: entry.rank ? Number(entry.rank) : undefined,
      previousRank: entry.previousRank ? Number(entry.previousRank) : null,
      weeksOnChart: entry.weeksOnChart ? Number(entry.weeksOnChart) : 1,
    }));
  }

  return result;
}

/**
 * Read file and return content
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("ファイル読み込みに失敗しました"));
    reader.readAsText(file);
  });
}

/**
 * Detect file format from extension
 */
export function detectFormat(filename: string): "csv" | "json" | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "csv") return "csv";
  if (ext === "json") return "json";
  return null;
}
