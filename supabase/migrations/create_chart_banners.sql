-- Create chart_banners table for managing banner images on chart pages
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS chart_banners (
  id TEXT PRIMARY KEY,
  chart_type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  alt_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create unique constraint to ensure one active banner per chart type
CREATE UNIQUE INDEX IF NOT EXISTS idx_chart_banners_chart_type_active
ON chart_banners (chart_type)
WHERE is_active = true;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chart_banners_chart_type
ON chart_banners (chart_type);

-- Add RLS policies
ALTER TABLE chart_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to banners"
ON chart_banners
FOR SELECT
USING (true);

-- Allow authenticated users to manage banners
CREATE POLICY "Allow authenticated users to manage banners"
ON chart_banners
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chart_banners_updated_at
  BEFORE UPDATE ON chart_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a sample banner for weekly chart (optional)
-- INSERT INTO chart_banners (id, chart_type, image_url, link_url, alt_text, is_active)
-- VALUES ('sample-weekly', 'weekly', '/images/chart-banner.png', 'https://example.com/vote', '投票キャンペーン実施中', true);

COMMENT ON TABLE chart_banners IS 'Banner images for chart hero sections';
COMMENT ON COLUMN chart_banners.chart_type IS 'Chart type: weekly, monthly, season, year-end, album, artist, rookie, solo, group, icon, global, global-mv';
COMMENT ON COLUMN chart_banners.image_url IS 'URL of the banner image';
COMMENT ON COLUMN chart_banners.link_url IS 'URL to navigate when banner is clicked (optional)';
COMMENT ON COLUMN chart_banners.alt_text IS 'Alt text for accessibility';
COMMENT ON COLUMN chart_banners.is_active IS 'Whether the banner is currently active';
COMMENT ON COLUMN chart_banners.start_date IS 'Start date for time-limited banners (optional)';
COMMENT ON COLUMN chart_banners.end_date IS 'End date for time-limited banners (optional)';
