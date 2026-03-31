#!/usr/bin/env node
/**
 * Fetch Spotify Album Art URLs
 * This script fetches album art URLs from Spotify oEmbed API and updates JSON data files.
 * Run from server-side to avoid CORS issues.
 *
 * Usage: node scripts/fetch-spotify-art.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SONGS_FILE = path.join(DATA_DIR, 'songs', 'index.json');
const CHART_FILE = path.join(DATA_DIR, 'charts', 'songs', '2025-03-22.json');

async function fetchSpotifyAlbumArt(trackId) {
  if (!trackId) return null;

  try {
    const url = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch art for ${trackId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.thumbnail_url;
  } catch (error) {
    console.error(`Error fetching art for ${trackId}:`, error.message);
    return null;
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateSongsFile() {
  console.log('Updating songs/index.json...');

  const songsData = JSON.parse(fs.readFileSync(SONGS_FILE, 'utf8'));
  let updated = 0;

  for (const song of songsData.songs) {
    if (song.spotifyId && !song.coverImage) {
      console.log(`Fetching art for: ${song.title} (${song.spotifyId})`);
      const artUrl = await fetchSpotifyAlbumArt(song.spotifyId);

      if (artUrl) {
        song.coverImage = artUrl;
        updated++;
        console.log(`  -> ${artUrl}`);
      }

      // Rate limiting
      await delay(200);
    }
  }

  songsData.updatedAt = new Date().toISOString();
  fs.writeFileSync(SONGS_FILE, JSON.stringify(songsData, null, 2));
  console.log(`Updated ${updated} songs in index.json`);
}

async function updateChartFile() {
  console.log('\nUpdating chart file...');

  const chartData = JSON.parse(fs.readFileSync(CHART_FILE, 'utf8'));
  let updated = 0;

  for (const entry of chartData.entries) {
    if (entry.spotifyId && !entry.coverImage) {
      console.log(`Fetching art for: ${entry.title} (${entry.spotifyId})`);
      const artUrl = await fetchSpotifyAlbumArt(entry.spotifyId);

      if (artUrl) {
        entry.coverImage = artUrl;
        updated++;
        console.log(`  -> ${artUrl}`);
      }

      // Rate limiting
      await delay(200);
    }
  }

  fs.writeFileSync(CHART_FILE, JSON.stringify(chartData, null, 2));
  console.log(`Updated ${updated} entries in chart file`);
}

async function main() {
  console.log('Spotify Album Art Fetcher');
  console.log('=========================\n');

  await updateSongsFile();
  await updateChartFile();

  console.log('\nDone!');
}

main().catch(console.error);
