'use server';

import fs from 'fs';
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

async function assertAuthenticated(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Offline mode: no Supabase configured. Permit (dev convenience); middleware
  // already returns NextResponse.next() for this case. Revisit when CMS is live.
  if (!url || !anon) return;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {
        // Server actions called via form posts may not attach set-cookie here; no-op.
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
}

function walkImages(root: string, rel: string = ''): MediaFile[] {
  const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);
  const out: MediaFile[] = [];
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(path.join(root, rel), { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...walkImages(root, relPath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    try {
      const stats = fs.statSync(path.join(root, relPath));
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
  const publicDir = path.join(process.cwd(), 'public');
  return walkImages(publicDir).sort((a, b) => b.date - a.date);
}
