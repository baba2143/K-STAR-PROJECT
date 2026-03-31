#!/usr/bin/env node
/**
 * Spotify Track Info Fetcher
 *
 * Usage:
 *   node scripts/spotify-fetch.js <track_id_or_url>
 *
 * Examples:
 *   node scripts/spotify-fetch.js 1CPZ5BxNNd0n0nF4Orb9JS
 *   node scripts/spotify-fetch.js https://open.spotify.com/track/1CPZ5BxNNd0n0nF4Orb9JS
 *   node scripts/spotify-fetch.js "<iframe src='https://open.spotify.com/embed/track/1CPZ5BxNNd0n0nF4Orb9JS'></iframe>"
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file manually
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const CLIENT_ID = env.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env file');
  process.exit(1);
}

// Extract track ID from various input formats
function extractTrackId(input) {
  if (!input) return null;

  // Match track ID from URL or iframe
  const match = input.match(/track\/([a-zA-Z0-9]+)/);
  if (match) return match[1];

  // If it's just an ID (alphanumeric, ~22 chars)
  if (/^[a-zA-Z0-9]{20,25}$/.test(input.trim())) {
    return input.trim();
  }

  return null;
}

// Get access token using Client Credentials flow
async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch track info from Spotify API
async function fetchTrackInfo(trackId, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch track: ${response.status} ${response.statusText}`);
  }

  const track = await response.json();

  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    artistId: track.artists[0]?.id,
    album: track.album.name,
    albumId: track.album.id,
    releaseDate: track.album.release_date,
    coverImage: track.album.images[0]?.url, // Largest image
    coverImageMedium: track.album.images[1]?.url, // 300x300
    coverImageSmall: track.album.images[2]?.url, // 64x64
    duration: track.duration_ms,
    popularity: track.popularity,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
  };
}

// Main
async function main() {
  const input = process.argv[2];

  if (!input) {
    console.log('Usage: node scripts/spotify-fetch.js <track_id_or_url>');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/spotify-fetch.js 1CPZ5BxNNd0n0nF4Orb9JS');
    console.log('  node scripts/spotify-fetch.js https://open.spotify.com/track/1CPZ5BxNNd0n0nF4Orb9JS');
    process.exit(0);
  }

  const trackId = extractTrackId(input);

  if (!trackId) {
    console.error('Error: Could not extract track ID from input');
    process.exit(1);
  }

  console.log(`Fetching track: ${trackId}`);

  try {
    const accessToken = await getAccessToken();
    const trackInfo = await fetchTrackInfo(trackId, accessToken);

    console.log('');
    console.log('=== Track Info ===');
    console.log(`Title:        ${trackInfo.title}`);
    console.log(`Artist:       ${trackInfo.artist}`);
    console.log(`Album:        ${trackInfo.album}`);
    console.log(`Release Date: ${trackInfo.releaseDate}`);
    console.log(`Duration:     ${Math.floor(trackInfo.duration / 60000)}:${String(Math.floor((trackInfo.duration % 60000) / 1000)).padStart(2, '0')}`);
    console.log(`Popularity:   ${trackInfo.popularity}/100`);
    console.log(`Cover Image:  ${trackInfo.coverImage}`);
    console.log(`Spotify URL:  ${trackInfo.spotifyUrl}`);
    console.log('');
    console.log('=== JSON Output ===');
    console.log(JSON.stringify(trackInfo, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
