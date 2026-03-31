#!/usr/bin/env node
/**
 * Data API Server
 *
 * Runs a local server that manages chart/song/artist data.
 * Used by both admin tool (to save) and client (to read).
 *
 * Usage:
 *   node scripts/data-server.js
 *
 * The server runs on port 3200 and provides:
 *   GET  /api/songs - Get all songs
 *   POST /api/songs - Save songs
 *   GET  /api/artists - Get all artists
 *   POST /api/artists - Save artists
 *   GET  /api/albums - Get all albums
 *   POST /api/albums - Save albums
 *   GET  /api/charts/:type/:date - Get chart data
 *   POST /api/charts/:type/:date - Save chart data
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3200;

// Data directory paths
const CLIENT_DATA_DIR = resolve(__dirname, '../client/public/data');
const DATA_DIR = resolve(__dirname, '../data');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper: Read JSON file
function readJson(filePath) {
  try {
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
  }
  return null;
}

// Helper: Write JSON file
function writeJson(filePath, data) {
  try {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e.message);
    return false;
  }
}

// Helper: Parse request body
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
  });
}

// Helper: Send JSON response
function sendJson(res, data, status = 200) {
  res.writeHead(status, { ...corsHeaders, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Request handler
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  console.log(`${method} ${path}`);

  // Routes
  try {
    // Songs
    if (path === '/api/songs') {
      if (method === 'GET') {
        const data = readJson(resolve(CLIENT_DATA_DIR, 'songs/index.json')) || [];
        sendJson(res, data);
      } else if (method === 'POST') {
        const data = await parseBody(req);
        if (data) {
          // Save to both locations
          writeJson(resolve(CLIENT_DATA_DIR, 'songs/index.json'), data);
          writeJson(resolve(DATA_DIR, 'songs/index.json'), data);
          sendJson(res, { success: true, count: data.length });
        } else {
          sendJson(res, { error: 'Invalid JSON' }, 400);
        }
      }
      return;
    }

    // Artists
    if (path === '/api/artists') {
      if (method === 'GET') {
        const data = readJson(resolve(CLIENT_DATA_DIR, 'artists/index.json')) || [];
        sendJson(res, data);
      } else if (method === 'POST') {
        const data = await parseBody(req);
        if (data) {
          writeJson(resolve(CLIENT_DATA_DIR, 'artists/index.json'), data);
          writeJson(resolve(DATA_DIR, 'artists/index.json'), data);
          sendJson(res, { success: true, count: data.length });
        } else {
          sendJson(res, { error: 'Invalid JSON' }, 400);
        }
      }
      return;
    }

    // Albums
    if (path === '/api/albums') {
      if (method === 'GET') {
        const data = readJson(resolve(CLIENT_DATA_DIR, 'albums/index.json')) || [];
        sendJson(res, data);
      } else if (method === 'POST') {
        const data = await parseBody(req);
        if (data) {
          writeJson(resolve(CLIENT_DATA_DIR, 'albums/index.json'), data);
          writeJson(resolve(DATA_DIR, 'albums/index.json'), data);
          sendJson(res, { success: true, count: data.length });
        } else {
          sendJson(res, { error: 'Invalid JSON' }, 400);
        }
      }
      return;
    }

    // Charts
    const chartMatch = path.match(/^\/api\/charts\/([^/]+)\/([^/]+)$/);
    if (chartMatch) {
      const [, chartType, date] = chartMatch;
      const chartPath = resolve(CLIENT_DATA_DIR, `charts/${chartType}/${date}.json`);
      const dataChartPath = resolve(DATA_DIR, `charts/${chartType}/${date}.json`);

      if (method === 'GET') {
        const data = readJson(chartPath);
        if (data) {
          sendJson(res, data);
        } else {
          sendJson(res, { error: 'Chart not found' }, 404);
        }
      } else if (method === 'POST') {
        const data = await parseBody(req);
        if (data) {
          writeJson(chartPath, data);
          writeJson(dataChartPath, data);
          sendJson(res, { success: true, chartType, date });
        } else {
          sendJson(res, { error: 'Invalid JSON' }, 400);
        }
      }
      return;
    }

    // Health check
    if (path === '/api/health') {
      sendJson(res, { status: 'ok', timestamp: new Date().toISOString() });
      return;
    }

    // Not found
    sendJson(res, { error: 'Not found' }, 404);
  } catch (e) {
    console.error('Error:', e);
    sendJson(res, { error: e.message }, 500);
  }
}

// Start server
const server = createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`\n📊 Data API Server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET/POST /api/songs     - Songs data`);
  console.log(`  GET/POST /api/artists   - Artists data`);
  console.log(`  GET/POST /api/albums    - Albums data`);
  console.log(`  GET/POST /api/charts/:type/:date - Chart data`);
  console.log(`\nData directory: ${CLIENT_DATA_DIR}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
