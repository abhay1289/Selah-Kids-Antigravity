'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Plus, Trash2, ChevronDown, ChevronUp,
  Play, Eye, EyeOff, Link2
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  category: string;
  language: string;
  img: string;
  youtubeUrl: string;
  date: string;
  isPublished: boolean;
}

const INITIAL_VIDEOS: Video[] = [
  { id: '1', title: 'I Am Blessed', titleEs: 'Bendecido Estoy', description: 'A wonderful reminder of our blessings from God.', descriptionEs: 'Un hermoso recordatorio de nuestras bendiciones.', category: 'Music Video', language: 'EN', img: '/thumb-i-am-blessed-en.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=example1', date: '2024', isPublished: true },
  { id: '2', title: 'The Great News!', titleEs: '¡La Gran Noticia!', description: 'The Great News song teaches kids about the good news of Jesus.', descriptionEs: 'Esta canción enseña a los niños sobre las buenas nuevas de Jesús.', category: 'Music Video', language: 'EN', img: '/thumb-the-great-news-en.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=example2', date: '2024', isPublished: true },
  { id: '3', title: 'David and Goliath', titleEs: 'David y Goliat', description: 'The story of David and Goliath teaches courage.', descriptionEs: 'La historia de David y Goliat enseña valentía.', category: 'Cartoon', language: 'EN', img: '/thumb-david-goliath-en.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=example3', date: '2025', isPublished: true },
];

export default function VideoManager() {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addNewVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      title: 'New Video',
      titleEs: 'Nuevo Video',
      description: '',
      descriptionEs: '',
      category: 'Music Video',
      language: 'EN',
      img: '',
      youtubeUrl: '',
      date: new Date().getFullYear().toString(),
      isPublished: false,
    };
    setVideos([newVideo, ...videos]);
    setExpandedVideo(newVideo.id);
  };

  const updateVideo = <K extends keyof Video>(id: string, field: K, value: Video[K]) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const deleteVideo = (id: string) => {
    if (confirm('Delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
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
                  {video.img && <img src={video.img} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play size={14} className="text-white" /></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-[#3a6b44] truncate group-hover:text-[#ff5c00] transition-colors">{video.title}</h3>
                  <p className="text-[12px] text-[#5a7d62]/50 font-medium">{video.category} • {video.language} • {video.date}</p>
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
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Title (ES) 🇪🇸</label><input value={video.titleEs} onChange={(e) => updateVideo(video.id, 'titleEs', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Description (EN)</label><textarea value={video.description} onChange={(e) => updateVideo(video.id, 'description', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Description (ES)</label><textarea value={video.descriptionEs} onChange={(e) => updateVideo(video.id, 'descriptionEs', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Category</label><select value={video.category} onChange={(e) => updateVideo(video.id, 'category', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[14px] font-medium outline-none"><option value="Music Video">Music Video</option><option value="Cartoon">Cartoon</option><option value="Worship">Worship</option></select></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Language</label><select value={video.language} onChange={(e) => updateVideo(video.id, 'language', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[14px] font-medium outline-none"><option value="EN">English</option><option value="ES">Español</option><option value="Both">Both</option></select></div>
                        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Year</label><input value={video.date} onChange={(e) => updateVideo(video.id, 'date', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
                      </div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 flex items-center gap-1"><Link2 size={12} /> YouTube URL</label><input value={video.youtubeUrl} onChange={(e) => updateVideo(video.id, 'youtubeUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Thumbnail</label>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-14 rounded-xl bg-[#3a6b44]/5 border-2 border-dashed border-[#3a6b44]/10 overflow-hidden">{video.img && <img src={video.img} alt="" className="w-full h-full object-cover" />}</div>
                          <input value={video.img} onChange={(e) => updateVideo(video.id, 'img', e.target.value)} placeholder="Image path" className="flex-1 h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#3a6b44]/5">
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => updateVideo(video.id, 'isPublished', !video.isPublished)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${video.isPublished ? 'bg-[#93d35c]/10 text-[#3a6b44] border border-[#93d35c]/20' : 'bg-[#feb835]/10 text-[#feb835] border border-[#feb835]/20'}`}>{video.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}{video.isPublished ? 'Published' : 'Draft'}</motion.button>
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
