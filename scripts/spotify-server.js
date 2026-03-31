#!/usr/bin/env node
/**
 * Spotify API Server
 *
 * Runs a local server that proxies Spotify API requests.
 * Used by the admin tool to fetch track info.
 *
 * Usage:
 *   node scripts/spotify-server.js
 *
 * The server runs on port 3100 and provides:
 *   GET /api/spotify/track/:id - Fetch track info
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3100;

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

// Cache access token
let accessToken = null;
let tokenExpiry = 0;

// Get access token using Client Credentials flow
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 min early
  return accessToken;
}

// Fetch track info from Spotify API
async function fetchTrackInfo(trackId) {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch track: ${response.status}`);
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
    coverImage: track.album.images[0]?.url,
    coverImageMedium: track.album.images[1]?.url,
    duration: Math.floor(track.duration_ms / 1000),
    popularity: track.popularity,
    spotifyUrl: track.external_urls.spotify,
  };
}

// Extract track ID from various formats
function extractTrackId(input) {
  if (!input) return null;
  const match = input.match(/track\/([a-zA-Z0-9]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9]{20,25}$/.test(input.trim())) {
    return input.trim();
  }
  return null;
}

// Create HTTP server
const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Health check
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Fetch track info
  if (url.pathname.startsWith('/api/spotify/track/')) {
    const input = decodeURIComponent(url.pathname.replace('/api/spotify/track/', ''));
    const trackId = extractTrackId(input);

    if (!trackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid track ID' }));
      return;
    }

    try {
      const trackInfo = await fetchTrackInfo(trackId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(trackInfo));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🎵 Spotify API Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  GET http://localhost:${PORT}/api/spotify/track/{trackId}`);
  console.log(`  GET http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('Press Ctrl+C to stop');
});
