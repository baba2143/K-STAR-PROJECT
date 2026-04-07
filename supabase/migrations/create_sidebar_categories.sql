-- Create sidebar_categories and sidebar_chart_items tables
-- Run this in Supabase SQL Editor
-- These tables manage the sidebar navigation categories and their chart items

-- ============================================
-- Sidebar Categories Table
-- ============================================

CREATE TABLE IF NOT EXISTS sidebar_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sidebar_categories_sort_order
ON sidebar_categories (sort_order);

CREATE INDEX IF NOT EXISTS idx_sidebar_categories_active
ON sidebar_categories (is_active);

-- Add RLS policies
ALTER TABLE sidebar_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to sidebar categories"
ON sidebar_categories
FOR SELECT
USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Allow authenticated users to manage sidebar categories"
ON sidebar_categories
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_sidebar_categories_updated_at
  BEFORE UPDATE ON sidebar_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sidebar_categories IS 'Sidebar navigation categories (K-STAR CHART, K-STAR ARTIST CHART, etc.)';
COMMENT ON COLUMN sidebar_categories.id IS 'Unique identifier (e.g., kstar-chart, kstar-artist-chart)';
COMMENT ON COLUMN sidebar_categories.label IS 'Display label (e.g., K-STAR CHART)';
COMMENT ON COLUMN sidebar_categories.sort_order IS 'Display order in sidebar';
COMMENT ON COLUMN sidebar_categories.is_active IS 'Whether the category is visible';

-- ============================================
-- Sidebar Chart Items Table
-- ============================================

CREATE TABLE IF NOT EXISTS sidebar_chart_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES sidebar_categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  chart_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  coming_soon BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_sidebar_chart_items_category_id
ON sidebar_chart_items (category_id);

CREATE INDEX IF NOT EXISTS idx_sidebar_chart_items_sort_order
ON sidebar_chart_items (sort_order);

CREATE INDEX IF NOT EXISTS idx_sidebar_chart_items_chart_type
ON sidebar_chart_items (chart_type);

CREATE INDEX IF NOT EXISTS idx_sidebar_chart_items_active
ON sidebar_chart_items (is_active);

-- Add RLS policies
ALTER TABLE sidebar_chart_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to sidebar chart items"
ON sidebar_chart_items
FOR SELECT
USING (true);

-- Allow authenticated users to manage chart items
CREATE POLICY "Allow authenticated users to manage sidebar chart items"
ON sidebar_chart_items
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_sidebar_chart_items_updated_at
  BEFORE UPDATE ON sidebar_chart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sidebar_chart_items IS 'Chart items under each sidebar category';
COMMENT ON COLUMN sidebar_chart_items.id IS 'Unique identifier';
COMMENT ON COLUMN sidebar_chart_items.category_id IS 'Reference to parent category';
COMMENT ON COLUMN sidebar_chart_items.label IS 'Display label (e.g., WEEKLY CHART)';
COMMENT ON COLUMN sidebar_chart_items.path IS 'Navigation path (e.g., /charts/weekly)';
COMMENT ON COLUMN sidebar_chart_items.chart_type IS 'Chart type for banner association (e.g., weekly, monthly)';
COMMENT ON COLUMN sidebar_chart_items.sort_order IS 'Display order within category';
COMMENT ON COLUMN sidebar_chart_items.is_active IS 'Whether the item is visible';
COMMENT ON COLUMN sidebar_chart_items.coming_soon IS 'Whether to show as coming soon';

-- ============================================
-- Insert Initial Data
-- ============================================

-- K-STAR CHART Category
INSERT INTO sidebar_categories (id, label, sort_order, is_active) VALUES
  ('kstar-chart', 'K-STAR CHART', 0, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sidebar_chart_items (id, category_id, label, path, chart_type, sort_order, is_active, coming_soon) VALUES
  ('weekly-chart', 'kstar-chart', 'WEEKLY CHART', '/charts/weekly', 'weekly', 0, true, false),
  ('monthly-chart', 'kstar-chart', 'MONTHLY CHART', '/charts/monthly', 'monthly', 1, true, true),
  ('season-chart', 'kstar-chart', 'SEASON CHART', '/charts/season', 'season', 2, true, true),
  ('year-end-chart', 'kstar-chart', 'YEAR-END CHART', '/charts/year-end', 'year-end', 3, true, true)
ON CONFLICT (id) DO NOTHING;

-- K-STAR ARTIST CHART Category
INSERT INTO sidebar_categories (id, label, sort_order, is_active) VALUES
  ('kstar-artist-chart', 'K-STAR ARTIST CHART', 1, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sidebar_chart_items (id, category_id, label, path, chart_type, sort_order, is_active, coming_soon) VALUES
  ('best-rookie', 'kstar-artist-chart', 'BEST ROOKIE', '/charts/artist/rookie', 'rookie', 0, true, true),
  ('best-solo', 'kstar-artist-chart', 'BEST SOLO&FEATURING', '/charts/artist/solo', 'solo', 1, true, true),
  ('best-group', 'kstar-artist-chart', 'BEST GROUP', '/charts/artist/group', 'group', 2, true, true),
  ('best-icon', 'kstar-artist-chart', 'BEST ICON', '/charts/artist/icon', 'icon', 3, true, true),
  ('best-global', 'kstar-artist-chart', 'BEST GLOBAL', '/charts/artist/global', 'global', 4, true, true)
ON CONFLICT (id) DO NOTHING;

-- GLOBAL CHAMP CHART Category
INSERT INTO sidebar_categories (id, label, sort_order, is_active) VALUES
  ('global-champ-chart', 'GLOBAL CHAMP CHART', 2, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sidebar_chart_items (id, category_id, label, path, chart_type, sort_order, is_active, coming_soon) VALUES
  ('global-mv-chart', 'global-champ-chart', 'GLOBAL MUSIC VIDEO CHART', '/charts/global/global-mv', 'global-mv', 0, true, true),
  ('hot-now-mv-chart', 'global-champ-chart', 'HOT NOW MUSIC VIDEO CHART', '/charts/global/global-hot-mv', 'hot-now', 1, true, true)
ON CONFLICT (id) DO NOTHING;
