'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Plus, Trash2, ChevronDown, ChevronUp,
  Play, Eye, EyeOff, Link2
} from 'lucide-react';
import { useCmsCollection } from '../../../../lib/useCms';
import { INITIAL_VIDEOS } from '../../../../data/cms-fallbacks';
import type { Episode, EpisodeCategory, EpisodeLanguage, AgeBand } from '../../../../data/catalog';

// Admin-editable wrapper around canonical Episode shape. `isPublished` is a
// UI-only flag that useCmsCollection.save() reads to drive the separate
// `is_published` DB column (Phase 1 RLS filter).
type EpisodeEditable = Episode & { isPublished?: boolean };

const INITIAL_EDITABLE: EpisodeEditable[] = INITIAL_VIDEOS.map((e) => ({ ...e, isPublished: true }));

const CATEGORIES: EpisodeCategory[] = ['music-video', 'sing-along', 'sensory'];
const LANGUAGES: EpisodeLanguage[] = ['EN', 'ES'];
const AGE_BANDS: AgeBand[] = ['2-4', '3-6', '5-8', 'all'];

export default function VideoManager() {
  const { items: videos, setItems: setVideos, isSaving, save, error } = useCmsCollection<EpisodeEditable>(
    'videos',
    INITIAL_EDITABLE,
  );
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const addNewVideo = () => {
    const newId = `new-video-${Date.now()}`;
    const newVideo: EpisodeEditable = {
      id: newId,
      youtubeId: '',
      title: 'New Video',
      titleEs: 'Nuevo Video',
      description: '',
      descriptionEs: '',
      category: 'music-video',
      language: 'EN',
      thumbnail: '',
      dateIso: new Date().toISOString().slice(0, 10),
      dateLabel: '',
      durationSec: 0,
      ageBand: 'all',
      tags: [],
      sensoryFriendly: false,
      isPublished: false,
    };
    setVideos([newVideo, ...videos]);
    setExpandedVideo(newVideo.id);
  };

  const updateVideo = <K extends keyof EpisodeEditable>(id: string, field: K, value: EpisodeEditable[K]) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const deleteVideo = (id: string) => {
    if (confirm('Delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const handleSave = async () => {
    try { await save(); } catch { /* error surfaced via hook */ }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Video Library</h2>
          <span className="text-[12px] font-medium text-[#5a7d62]/50 bg-[#3a6b44]/5 px-3 py-1 rounded-full">{videos.length} videos</span>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addNewVideo} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20">
            <Plus size={15} /> Add Video
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all">
            <Save size={15} /> {isSaving ? 'Saving...' : 'Save All'}
          </motion.button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="space-y-3">
        <AnimatePresence>
          {videos.map((video) => (
            <motion.div key={video.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
              <button onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)} className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#3a6b44]/[0.02] transition-colors group">
                <div className="w-20 h-12 rounded-xl bg-[#3a6b44]/5 border border-[#3a6b44]/10 overflow-hidden flex-shrink-0 relative">
                  {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play size={14} className="text-white" /></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-[#3a6b44] truncate group-hover:text-[#ff5c00] transition-colors">{video.title}</h3>
                  <p className="text-[12px] text-[#5a7d62]/50 font-medium">{video.category} • {video.language} • {video.dateLabel || video.dateIso}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ${video.isPublished ? 'bg-[#93d35c]/10 text-[#3a6b44]' : 'bg-[#feb835]/10 text-[#feb835]'}`}>
                  {video.isPublished ? 'Published' : 'Draft'}
                </span>
                {expandedVideo === video.id ? <ChevronUp size={16} className="text-[#5a7d62]/30" /> : <ChevronDown size={16} className="text-[#5a7d62]/30" />}
              </button>

              <AnimatePresence>
                {expandedVideo === video.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                    <div className="p-6 border-t border-[#3a6b44]/5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Title (EN) 🇺🇸</label><input value={video.title} onChange={(e) => updateVideo(video.id, 'title', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Title (ES) 🇪🇸</label><input value={video.titleEs ?? ''} onChange={(e) => updateVideo(video.id, 'titleEs', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Description (EN)</label><textarea value={video.description} onChange={(e) => updateVideo(video.id, 'description', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Description (ES)</label><textarea value={video.descriptionEs ?? ''} onChange={(e) => updateVideo(video.id, 'descriptionEs', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Category</label><select value={video.category} onChange={(e) => updateVideo(video.id, 'category', e.target.value as EpisodeCategory)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[14px] font-medium outline-none">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Language</label><select value={video.language} onChange={(e) => updateVideo(video.id, 'language', e.target.value as EpisodeLanguage)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[14px] font-medium outline-none">{LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Age Band</label><select value={video.ageBand} onChange={(e) => updateVideo(video.id, 'ageBand', e.target.value as AgeBand)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[14px] font-medium outline-none">{AGE_BANDS.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Date (YYYY-MM-DD)</label><input value={video.dateIso} onChange={(e) => updateVideo(video.id, 'dateIso', e.target.value)} placeholder="2025-04-01" className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Date Label</label><input value={video.dateLabel} onChange={(e) => updateVideo(video.id, 'dateLabel', e.target.value)} placeholder="APR 2025" className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 flex items-center gap-1"><Link2 size={12} /> YouTube ID</label><input value={video.youtubeId} onChange={(e) => updateVideo(video.id, 'youtubeId', e.target.value)} placeholder="11-char ID (e.g. dQw4w9WgXcQ)" className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Duration (seconds)</label><input type="number" value={video.durationSec} onChange={(e) => updateVideo(video.id, 'durationSec', Number(e.target.value) || 0)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                      </div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Thumbnail</label>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-14 rounded-xl bg-[#3a6b44]/5 border-2 border-dashed border-[#3a6b44]/10 overflow-hidden">{video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />}</div>
                          <input value={video.thumbnail} onChange={(e) => updateVideo(video.id, 'thumbnail', e.target.value)} placeholder="/thumb-foo.jpg" className="flex-1 h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
                        </div>
                      </div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Tags (comma-separated)</label><input value={video.tags.join(', ')} onChange={(e) => updateVideo(video.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="joy, praise, worship" className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Paired ID (same song, other language)</label><input value={video.pairedId ?? ''} onChange={(e) => updateVideo(video.id, 'pairedId', e.target.value || undefined)} placeholder="e.g. jesus-me-ama-es" className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#3a6b44]/5">
                        <div className="flex items-center gap-3">
                          <motion.button whileTap={{ scale: 0.98 }} onClick={() => updateVideo(video.id, 'isPublished', !video.isPublished)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${video.isPublished ? 'bg-[#93d35c]/10 text-[#3a6b44] border border-[#93d35c]/20' : 'bg-[#feb835]/10 text-[#feb835] border border-[#feb835]/20'}`}>{video.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}{video.isPublished ? 'Published' : 'Draft'}</motion.button>
                          <label className="flex items-center gap-2 text-[12px] font-semibold text-[#3a6b44] cursor-pointer"><input type="checkbox" checked={video.sensoryFriendly} onChange={(e) => updateVideo(video.id, 'sensoryFriendly', e.target.checked)} /> Sensory-friendly</label>
                        </div>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => deleteVideo(video.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 text-red-500 text-[12px] font-bold hover:bg-red-500/10 border border-red-500/10"><Trash2 size={14} /> Delete</motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
