'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, File, Folder, Search } from 'lucide-react';
import { getLocalMedia } from './actions';

export default function MediaLibrary() {
  const [media, setMedia] = useState<{name: string, type: string, size: string, src: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getLocalMedia()
      .then(data => {
        setMedia(data);
      })
      .catch((err: Error) => {
        // Most likely cause: `assertAuthenticated` threw because the user's
        // session expired. Show an error rather than spinning forever.
        setLoadError(err?.message === 'Unauthorized' ? 'Session expired — please sign in again.' : 'Failed to load media library.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Media Library</h2>
          {!loading && !loadError && <span className="text-[12px] font-medium text-[#5a7d62]/50 bg-[#3a6b44]/5 px-3 py-1 rounded-full">{media.length} files</span>}
          {!loading && loadError && <span className="text-[12px] font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full">{loadError}</span>}
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7d62]/30" />
            <input placeholder="Search media..." className="h-[40px] pl-9 pr-4 w-[200px] rounded-xl bg-[#3a6b44]/[0.03] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5c00] to-[#FF7B29] text-white text-[13px] font-bold shadow-lg shadow-[#ff5c00]/20 transition-all"
          >
            <Upload size={15} /> Upload
          </motion.button>
        </div>
      </div>

      {/* Upload Zone */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="bg-white/50 backdrop-blur-xl rounded-2xl border-2 border-dashed border-[#3a6b44]/15 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/80 hover:border-[#ff5c00]/30 transition-all group"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#ff5c00]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Upload size={28} className="text-[#ff5c00]" />
        </div>
        <h3 className="text-[15px] font-bold text-[#3a6b44] mb-1" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Drop files here or click to upload
        </h3>
        <p className="text-[13px] text-[#5a7d62]/50">
          Supports PNG, JPG, WebP, PDF up to 5MB
        </p>
      </motion.div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#ff5c00]/30 border-t-[#ff5c00] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((file, i) => (
            <motion.div
              key={file.name + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 20) * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden cursor-pointer group"
            >
              {/* Preview */}
              <div className="aspect-square bg-gradient-to-br from-[#f1f8e7] to-white flex items-center justify-center overflow-hidden">
                <img src={file.src} alt={file.name} loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Info */}
              <div className="p-3 border-t border-[#3a6b44]/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3a6b44]/5 flex items-center justify-center text-[#ff5c00] flex-shrink-0">
                  <ImageIcon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#3a6b44] truncate">{file.name}</p>
                  <p className="text-[11px] text-[#5a7d62]/40 font-medium">{file.size}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
