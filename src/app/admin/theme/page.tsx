'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Palette, Type, Sparkles } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';

interface ColorToken { id: string; label: string; cssVar: string; value: string; }
interface FontSetting { id: string; label: string; family: string; weight: string; usage: string; }

const INITIAL_COLORS: ColorToken[] = [
  { id: '1', label: 'Primary Orange', cssVar: '--selah-orange', value: '#FF5C00' },
  { id: '2', label: 'Dark Green', cssVar: '--selah-dark', value: '#3A6B44' },
  { id: '3', label: 'Lime Green', cssVar: '--selah-green', value: '#93D35C' },
  { id: '4', label: 'Yellow', cssVar: '--selah-yellow', value: '#FEB835' },
  { id: '5', label: 'Sky Blue', cssVar: '--selah-blue', value: '#00BFFF' },
  { id: '6', label: 'Red (YouTube)', cssVar: '--selah-red', value: '#FF0000' },
  { id: '7', label: 'Background', cssVar: '--selah-bg', value: '#FAFDF6' },
  { id: '8', label: 'Muted Text', cssVar: '--selah-muted', value: '#5A7D62' },
  { id: '9', label: 'Border', cssVar: '--selah-border', value: '#E8F0E0' },
  { id: '10', label: 'Light BG', cssVar: '--selah-light', value: '#F1F8E7' },
];

const INITIAL_FONTS: FontSetting[] = [
  { id: '1', label: 'Display Font', family: 'Fredoka', weight: '600-700', usage: 'Headings, titles, hero text' },
  { id: '2', label: 'Body Font', family: 'Quicksand', weight: '400-600', usage: 'Body text, descriptions, UI' },
];

interface ThemeTokens { id: string; borderRadius: string; glassOpacity: string; }
const INITIAL_TOKENS: ThemeTokens[] = [{ id: 'tokens', borderRadius: '2rem', glassOpacity: '0.6' }];

export default function ThemeManager() {
  const colorsHook = useCmsCollection<ColorToken>('theme_colors', INITIAL_COLORS);
  const tokensHook = useCmsCollection<ThemeTokens>('theme_tokens', INITIAL_TOKENS, { sortOrder: false });
  const { items: colors, setItems: setColors } = colorsHook;
  const tokens = tokensHook.items[0] ?? INITIAL_TOKENS[0];
  const setTokens = (t: ThemeTokens) => tokensHook.setItems([t]);
  const [fonts] = useState<FontSetting[]>(INITIAL_FONTS);
  const borderRadius = tokens.borderRadius;
  const glassOpacity = tokens.glassOpacity;
  const setBorderRadius = (v: string) => setTokens({ ...tokens, borderRadius: v });
  const setGlassOpacity = (v: string) => setTokens({ ...tokens, glassOpacity: v });
  const isSaving = colorsHook.isSaving || tokensHook.isSaving;
  const error = colorsHook.error || tokensHook.error;

  const updateColor = (id: string, value: string) => setColors(colors.map(c => c.id === id ? { ...c, value } : c));
  const handleSave = async () => { try { await Promise.all([colorsHook.save(), tokensHook.save()]); } catch { /* surfaced via hook */ } };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Theme & Design</h2><p className="text-[12px] text-[#5a7d62]/50">Colors, fonts, and visual identity</p></div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Color Palette */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
        <h3 className="text-[14px] font-bold text-[#3a6b44] flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}><Palette size={16} className="text-[#ff5c00]" /> Color Palette</h3>
        {/* Preview Swatch Row */}
        <div className="flex gap-2 flex-wrap">
          {colors.map(c => (
            <motion.div key={c.id} whileHover={{ scale: 1.1, y: -4 }} className="w-12 h-12 rounded-2xl shadow-md cursor-pointer border-2 border-white" style={{ backgroundColor: c.value }} title={c.label} />
          ))}
        </div>
        {/* Color Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colors.map(c => (
            <div key={c.id} className="flex items-center gap-3">
              <input type="color" value={c.value} onChange={e => updateColor(c.id, e.target.value)} className="w-10 h-10 rounded-xl border-2 border-[#3a6b44]/10 cursor-pointer" />
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-[#3a6b44]">{c.label}</p>
                <p className="text-[10px] text-[#5a7d62]/30 font-mono">{c.cssVar}</p>
              </div>
              <input value={c.value} onChange={e => updateColor(c.id, e.target.value)} className="w-[90px] h-[32px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] font-mono outline-none transition-all text-center uppercase" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Typography */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
        <h3 className="text-[14px] font-bold text-[#3a6b44] flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}><Type size={16} className="text-[#00BFFF]" /> Typography</h3>
        {fonts.map(f => (
          <div key={f.id} className="p-4 rounded-xl bg-[#3a6b44]/[0.02] border border-[#3a6b44]/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-[#3a6b44]">{f.label}</span>
              <span className="text-[11px] text-[#5a7d62]/40">{f.usage}</span>
            </div>
            <p className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: f.family === 'Fredoka' ? 'var(--font-fredoka)' : 'var(--font-quicksand)' }}>The quick brown fox jumps over the lazy dog</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[11px] font-mono text-[#5a7d62]/40">Family: {f.family}</span>
              <span className="text-[11px] font-mono text-[#5a7d62]/40">Weight: {f.weight}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Design Tokens */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <h3 className="text-[14px] font-bold text-[#3a6b44] flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}><Sparkles size={16} className="text-[#feb835]" /> Design Tokens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Card Border Radius</label><input value={borderRadius} onChange={e => setBorderRadius(e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-mono outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Glass Card Opacity</label><input value={glassOpacity} onChange={e => setGlassOpacity(e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-mono outline-none transition-all" /></div>
        </div>
        {/* Live Preview */}
        <div className="mt-4"><p className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-2">Component Preview</p>
          <div className="flex gap-4 flex-wrap">
            {[colors[0], colors[2], colors[3], colors[4]].map((c, i) => (
              <div key={i} className="p-4 rounded-2xl text-white text-[13px] font-bold shadow-lg" style={{ backgroundColor: c.value, borderRadius }}>{c.label}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
