'use server';

import fs from 'fs';
import path from 'path';

export async function getLocalMedia() {
  const publicDir = path.join(process.cwd(), 'public');
  
  try {
    const files = fs.readdirSync(publicDir);
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext);
    });

    const detailedFiles = mediaFiles.map(file => {
      const filePath = path.join(publicDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      return {
        name: file,
        type: 'image',
        size: `${sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'}`,
        src: `/${file}`,
        date: stats.mtime.getTime()
      };
    });

    return detailedFiles.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Error reading public directory', error);
    return [];
  }
}
