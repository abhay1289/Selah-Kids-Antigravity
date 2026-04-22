'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useCmsCollection } from '../../../../lib/useCms';

interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleEs: string;
  dateEn: string;
  dateEs: string;
  img: string;
  isPublished: boolean;
  isOpen: boolean;
}

const INITIAL_POSTS: BlogPost[] = [
  { id: '1', slug: 'the-strong-tower-of-security', titleEn: 'The Strong Tower of Security', titleEs: 'La Torre Fuerte de Seguridad', dateEn: 'April 7, 2026', dateEs: '7 de Abril, 2026', img: '/blog-armored-door.png', isPublished: true, isOpen: false },
  { id: '2', slug: 'are-we-repeating-patterns', titleEn: 'Are We Repeating Patterns?', titleEs: '¿Estamos Repitiendo Patrones?', dateEn: 'April 2, 2026', dateEs: '2 de Abril, 2026', img: '/blog-repeating-patterns.png', isPublished: true, isOpen: false },
  { id: '3', slug: 'the-call-to-be-a-blessing', titleEn: 'The Call to Be a Blessing', titleEs: 'El Llamado a Ser de Bendición', dateEn: 'April 15, 2026', dateEs: '15 de Abril, 2026', img: '/blog-the-call-to-be-a-blessing.png', isPublished: true, isOpen: false },
];

export default function BlogManager() {
  const { items: posts, setItems: setPosts, isSaving, save, error } = useCmsCollection<BlogPost>(
    'blog_posts',
    INITIAL_POSTS,
  );

  const addNew = () => {
    const p: BlogPost = { id: Date.now().toString(), slug: '', titleEn: '', titleEs: '', dateEn: '', dateEs: '', img: '', isPublished: false, isOpen: true };
    setPosts([p, ...posts]);
  };

  const update = <K extends keyof BlogPost>(id: string, field: K, value: BlogPost[K]) => setPosts(posts.map(p => p.id === id ? { ...p, [field]: value } : p));
  const toggle = (id: string) => setPosts(posts.map(p => p.id === id ? { ...p, isOpen: !p.isOpen } : p));
  const remove = (id: string) => { if (confirm('Delete this blog post?')) setPosts(posts.filter(p => p.id !== id)); };
  const handleSave = async () => {
    try { await save(); } catch { /* error surfaced via hook's `error` */ }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Blog Posts</h2>
          <span className="text-[12px] font-medium text-[#5a7d62]/50 bg-[#3a6b44]/5 px-3 py-1 rounded-full">{posts.length} posts</span>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20"><Plus size={15} /> New Post</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div key={post.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
            <button onClick={() => toggle(post.id)} className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#3a6b44]/[0.02] transition-colors group">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#3a6b44]/5 flex-shrink-0">
                {post.img && <img src={post.img} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold text-[#3a6b44] truncate group-hover:text-[#ff5c00] transition-colors">{post.titleEn || 'Untitled Post'}</h3>
                <p className="text-[12px] text-[#5a7d62]/50">{post.dateEn || 'No date'}</p>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); update(post.id, 'isPublished', !post.isPublished); }} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold ${post.isPublished ? 'bg-[#93d35c]/10 text-[#3a6b44]' : 'bg-[#feb835]/10 text-[#feb835]'}`}>{post.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}{post.isPublished ? 'Published' : 'Draft'}</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); remove(post.id); }} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><Trash2 size={14} /></motion.button>
              {post.isOpen ? <ChevronUp size={18} className="text-[#5a7d62]/40" /> : <ChevronDown size={18} className="text-[#5a7d62]/40" />}
            </button>
            <AnimatePresence>
              {post.isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-6 border-t border-[#3a6b44]/5 space-y-4">
                    <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">URL Slug</label><input value={post.slug} onChange={(e) => update(post.id, 'slug', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Title (EN) 🇺🇸</label><input value={post.titleEn} onChange={(e) => update(post.id, 'titleEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Title (ES) 🇪🇸</label><input value={post.titleEs} onChange={(e) => update(post.id, 'titleEs', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Date (EN)</label><input value={post.dateEn} onChange={(e) => update(post.id, 'dateEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                      <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Date (ES)</label><input value={post.dateEs} onChange={(e) => update(post.id, 'dateEs', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
                    </div>
                    <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Featured Image Path</label><div className="flex items-center gap-3"><div className="w-20 h-14 rounded-xl overflow-hidden bg-[#3a6b44]/5 flex-shrink-0">{post.img && <img src={post.img} alt="" className="w-full h-full object-cover" />}</div><input value={post.img} onChange={(e) => update(post.id, 'img', e.target.value)} className="flex-1 h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
