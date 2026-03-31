/**
 * K-STAR PROJECT - Type Definitions
 * Comprehensive type system for K-POP music charts
 */

// ============================================
// Chart Types
// ============================================

/** Available chart types */
export type ChartType =
  | 'songs'        // 楽曲チャート
  | 'albums'       // アルバムチャート
  | 'artists'      // アーティストチャート
  | 'streaming'    // ストリーミングチャート
  | 'digital'      // デジタルセールス
  | 'physical';    // フィジカルセールス

/** Trend direction for chart movement */
export type TrendDirection =
  | 'up'           // 上昇
  | 'down'         // 下降
  | 'same'         // 変動なし
  | 'new'          // 新登場
  | 're-entry';    // 再登場

/** Artist type */
export type ArtistType =
  | 'group'        // グループ
  | 'solo'         // ソロ
  | 'unit'         // ユニット
  | 'collaboration'; // コラボレーション

/** Gender category */
export type GenderCategory =
  | 'male'         // 男性
  | 'female'       // 女性
  | 'mixed';       // 混成

/** Album type */
export type AlbumType =
  | 'full'         // 正規アルバム
  | 'mini'         // ミニアルバム / EP
  | 'single'       // シングル
  | 'repackage'    // リパッケージ
  | 'ost'          // OST
  | 'compilation'; // コンピレーション

// ============================================
// Core Entities
// ============================================

/**
 * Artist entity
 * Represents a K-POP artist (group or solo)
 */
export interface Artist {
  id: string;
  name: string;              // 英語/ローマ字表記
  nameKo?: string;           // 韓国語名
  nameJa?: string;           // 日本語名
  type: ArtistType;
  gender: GenderCategory;
  agency: string;            // 所属事務所
  debutDate?: string;        // デビュー日 (ISO 8601)
  image: string;             // プロフィール画像URL
  coverImage?: string;       // カバー画像URL
  members?: ArtistMember[];  // グループメンバー (グループの場合)
  socialLinks?: SocialLinks;
  description?: string;
  descriptionJa?: string;
  active: boolean;           // 活動中かどうか
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Artist member (for groups)
 */
export interface ArtistMember {
  id: string;
  name: string;
  nameKo?: string;
  position?: string;         // メインボーカル、リーダーなど
  birthDate?: string;
  image?: string;
  active: boolean;           // グループ内での活動状態
}

/**
 * Social media links
 */
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  weverse?: string;
  spotify?: string;
  appleMusic?: string;
}

/**
 * Song entity
 */
export interface Song {
  id: string;
  title: string;
  titleKo?: string;
  titleJa?: string;
  artistId: string;
  artistName: string;        // 表示用 (非正規化)
  featuredArtists?: string[]; // フィーチャリングアーティストID
  albumId?: string;
  albumName?: string;
  releaseDate: string;       // リリース日 (ISO 8601)
  coverImage: string;
  duration?: number;         // 曲の長さ (秒)
  genre?: string[];
  composer?: string;         // 作曲者
  lyricist?: string;         // 作詞者
  arranger?: string;         // 編曲者
  youtubeId?: string;        // YouTube MV ID
  spotifyId?: string;
  appleMusicId?: string;
  isTitle?: boolean;         // タイトル曲かどうか
  lyrics?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Album entity
 */
export interface Album {
  id: string;
  title: string;
  titleKo?: string;
  titleJa?: string;
  artistId: string;
  artistName: string;        // 表示用 (非正規化)
  releaseDate: string;
  coverImage: string;
  albumType: AlbumType;
  trackCount?: number;
  tracks?: string[];         // Song IDs
  description?: string;
  spotifyId?: string;
  appleMusicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Chart Entries
// ============================================

/**
 * Base chart entry (common fields)
 */
export interface BaseChartEntry {
  rank: number;
  previousRank: number | null;
  peakPosition: number;
  weeksOnChart: number;
  trend: TrendDirection;
  isNew?: boolean;
  points?: number;           // チャートポイント (オプション)
}

/**
 * Song chart entry
 */
export interface SongChartEntry extends BaseChartEntry {
  songId: string;
  title: string;
  titleKo?: string;
  artist: string;
  artistId: string;
  coverImage: string;
  albumName?: string;
  spotifyId?: string;
  // Optional metrics
  streams?: number;
  downloads?: number;
  radioPlays?: number;
}

/**
 * Album chart entry
 */
export interface AlbumChartEntry extends BaseChartEntry {
  albumId: string;
  title: string;
  titleKo?: string;
  artist: string;
  artistId: string;
  coverImage: string;
  albumType: AlbumType;
  // Optional metrics
  sales?: number;
  physicalSales?: number;
  digitalSales?: number;
}

/**
 * Artist chart entry
 */
export interface ArtistChartEntry extends BaseChartEntry {
  artistId: string;
  name: string;
  nameKo?: string;
  image: string;
  type: ArtistType;
  gender: GenderCategory;
  // Current top song/album
  topSongTitle?: string;
  topSongRank?: number;
  // Optional metrics
  totalStreams?: number;
  totalSales?: number;
}

// Union type for all chart entries
export type ChartEntry = SongChartEntry | AlbumChartEntry | ArtistChartEntry;

// ============================================
// Chart Data Structures
// ============================================

/**
 * Chart week data
 */
export interface ChartWeekData<T extends BaseChartEntry = SongChartEntry> {
  id: string;                // e.g., "songs-2025-03-22"
  chartType: ChartType;
  weekStart: string;         // ISO 8601
  weekEnd: string;           // ISO 8601
  publishedAt: string;       // 公開日時
  entries: T[];
  totalEntries: number;
  highlights?: ChartHighlight[];
}

/**
 * Chart highlight (notable movements)
 */
export interface ChartHighlight {
  type: 'new_no1' | 'debut' | 'biggest_gain' | 'milestone';
  entryRank: number;
  description: string;
  descriptionJa?: string;
}

/**
 * Chart metadata
 */
export interface ChartMeta {
  chartType: ChartType;
  name: string;
  nameKo?: string;
  nameJa?: string;
  description: string;
  descriptionJa?: string;
  updateSchedule: string;    // e.g., "毎週金曜 18:00 (KST)"
  entryCount: number;        // チャート掲載数 (100, 200 など)
  icon?: string;
}

// ============================================
// API Response Types
// ============================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Search result
 */
export interface SearchResult {
  artists: Artist[];
  songs: Song[];
  albums: Album[];
  query: string;
  totalResults: number;
}

// ============================================
// Chart History
// ============================================

/**
 * Artist chart history entry
 */
export interface ArtistChartHistory {
  artistId: string;
  chartType: ChartType;
  history: {
    week: string;            // ISO 8601
    rank: number;
    points?: number;
  }[];
}

/**
 * Song chart history entry
 */
export interface SongChartHistory {
  songId: string;
  chartType: ChartType;
  history: {
    week: string;
    rank: number;
    points?: number;
  }[];
  peakPosition: number;
  peakWeek: string;
  totalWeeks: number;
  certifications?: string[];
}

// ============================================
// UI State Types
// ============================================

/**
 * Chart filter options
 */
export interface ChartFilterOptions {
  chartType?: ChartType;
  dateRange?: {
    start: string;
    end: string;
  };
  artistType?: ArtistType;
  gender?: GenderCategory;
  agency?: string;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: 'rank' | 'artist' | 'title' | 'weeksOnChart' | 'peakPosition';
  direction: 'asc' | 'desc';
}

// ============================================
// Data Index Types (for JSON files)
// ============================================

/**
 * Artists index (for data/artists/index.json)
 */
export interface ArtistsIndex {
  version: string;
  updatedAt: string;
  artists: Pick<Artist, 'id' | 'name' | 'nameKo' | 'type' | 'gender' | 'agency' | 'image' | 'active'>[];
}

/**
 * Songs index (for data/songs/index.json)
 */
export interface SongsIndex {
  version: string;
  updatedAt: string;
  songs: Pick<Song, 'id' | 'title' | 'titleKo' | 'artistId' | 'artistName' | 'coverImage' | 'releaseDate' | 'albumId' | 'isTitle' | 'duration'>[];
}

/**
 * Albums index (for data/albums/index.json)
 */
export interface AlbumsIndex {
  version: string;
  updatedAt: string;
  albums: Pick<Album, 'id' | 'title' | 'titleKo' | 'artistId' | 'artistName' | 'coverImage' | 'releaseDate' | 'albumType'>[];
}

/**
 * Charts index (for data/charts/index.json)
 * Lists all available chart weeks
 */
export interface ChartsIndex {
  version: string;
  updatedAt: string;
  charts: {
    [key in ChartType]?: {
      latestWeek: string;
      availableWeeks: string[];
    };
  };
}
