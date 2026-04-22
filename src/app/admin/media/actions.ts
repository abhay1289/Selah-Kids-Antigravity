'use server';

import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

type MediaFile = {
  name: string;
  type: 'image';
  size: string;
  src: string;
  date: number;
};

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);

// In-memory cache so repeated MediaLibrary mounts don't re-walk public/ on
// every navigation. Short TTL keeps the library fresh during dev.
const CACHE_TTL_MS = 30_000;
let cache: { at: number; files: MediaFile[] } | null = null;

async function assertAuthenticated(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Offline mode: no Supabase configured. Permit — middleware already
  // returns NextResponse.next() for this case in matching branches.
  if (!url || !anon) return;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (refreshed) => {
        // Next 15 allows cookie writes inside server actions; this ensures a
        // silently-refreshed Supabase access token gets persisted so the
        // next call sees the user as still authenticated.
        refreshed.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Some invocation contexts (e.g. read-only fetches) may disallow
            // writes; swallow so we don't break the action on a non-critical
            // cookie-write failure.
          }
        });
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
}

async function walkImages(root: string, rel: string = '', depth = 0): Promise<MediaFile[]> {
  // Safety guard against pathological symlinks / accidentally deep trees.
  if (depth > 8) return [];

  // Explicit `encoding: 'utf8'` so Dirent.name is typed as string (not Buffer).
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await fs.readdir(path.join(root, rel), { withFileTypes: true, encoding: 'utf8' });
  } catch {
    return [];
  }

  const out: MediaFile[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...(await walkImages(root, relPath, depth + 1)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    try {
      const stats = await fs.stat(path.join(root, relPath));
      const kb = Math.round(stats.size / 1024);
      out.push({
        name: relPath,
        type: 'image',
        size: kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`,
        src: `/${relPath}`,
        date: stats.mtime.getTime(),
      });
    } catch {
      // stat failed — skip silently
    }
  }
  return out;
}

export async function getLocalMedia(): Promise<MediaFile[]> {
  await assertAuthenticated();

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return cache.files;
  }

  const publicDir = path.join(process.cwd(), 'public');
  const files = (await walkImages(publicDir)).sort((a, b) => b.date - a.date);
  cache = { at: now, files };
  return files;
}
