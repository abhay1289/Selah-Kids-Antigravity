'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Save, Code, AlertTriangle } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';

interface CodeBlock { id: string; label: string; placement: 'head' | 'body-start' | 'body-end'; code: string; isActive: boolean; description: string; }

const INITIAL_BLOCKS: CodeBlock[] = [
  { id: '1', label: 'Google Analytics 4', placement: 'head', code: `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`, isActive: false, description: 'Google Analytics tracking code for visitor analytics' },
  { id: '2', label: 'Meta Pixel (Facebook)', placement: 'head', code: `<!-- Meta Pixel Code -->\n<script>\n  !function(f,b,e,v,n,t,s)\n  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n  n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n  n.queue=[];t=b.createElement(e);t.async=!0;\n  t.src=v;s=b.getElementsByTagName(e)[0];\n  s.parentNode.insertBefore(t,s)}(window, document,'script',\n  'https://connect.facebook.net/en_US/fbevents.js');\n  fbq('init', 'YOUR_PIXEL_ID');\n  fbq('track', 'PageView');\n</script>`, isActive: false, description: 'Facebook/Instagram ads tracking pixel' },
  { id: '3', label: 'Custom CSS Override', placement: 'head', code: '<style>\n  /* Custom CSS overrides */\n  \n</style>', isActive: false, description: 'Add custom CSS styles to override default theme' },
  { id: '4', label: 'Custom JavaScript', placement: 'body-end', code: '<script>\n  // Custom JavaScript\n  \n</script>', isActive: false, description: 'Add custom JavaScript at the end of the page body' },
];

const PLACEMENT_LABELS = { 'head': '🧠 <head>', 'body-start': '📄 <body> start', 'body-end': '📄 <body> end' };

export default function CustomCode() {
  const { items: blocks, setItems: setBlocks, isSaving, save, error } = useCmsCollection<CodeBlock>(
    'custom_code',
    INITIAL_BLOCKS,
  );
  const update = <K extends keyof CodeBlock>(id: string, field: K, value: CodeBlock[K]) => setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  const addBlock = () => setBlocks([...blocks, { id: Date.now().toString(), label: 'New Code Block', placement: 'head', code: '', isActive: false, description: '' }]);
  const removeBlock = (id: string) => { if (confirm('Delete this code block?')) setBlocks(blocks.filter(b => b.id !== id)); };
  const handleSave = async () => { try { await save(); } catch { /* surfaced via hook */ } };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Custom Code</h2><p className="text-[12px] text-[#5a7d62]/50">Inject tracking scripts, custom CSS & JS</p></div>
        <div className="flex gap-3 items-center">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileTap={{ scale: 0.98 }} onClick={addBlock} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 border border-[#ff5c00]/20"><Code size={14} /> Add Block</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 bg-[#feb835]/10 rounded-2xl p-4 border border-[#feb835]/20">
        <AlertTriangle size={18} className="text-[#feb835] flex-shrink-0 mt-0.5" />
        <div><p className="text-[13px] font-bold text-[#3a6b44]">Be careful with custom code</p><p className="text-[12px] text-[#5a7d62]/60">Invalid code can break your website. Only add code from trusted sources like Google, Facebook, or your developer.</p></div>
      </div>

      {/* Code Blocks */}
      {blocks.map((block) => (
        <motion.div key={block.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code size={16} className="text-[#5a7d62]/40" />
                <input value={block.label} onChange={e => update(block.id, 'label', e.target.value)} className="text-[14px] font-bold text-[#3a6b44] bg-transparent outline-none border-b-2 border-transparent focus:border-[#ff5c00]/20 transition-all" />
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => update(block.id, 'isActive', !block.isActive)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${block.isActive ? 'bg-[#93d35c]/10 text-[#3a6b44]' : 'bg-[#3a6b44]/5 text-[#5a7d62]/40'}`}>{block.isActive ? '✓ Active' : 'Inactive'}</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeBlock(block.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><Code size={14} /></motion.button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Placement</label><select value={block.placement} onChange={e => update(block.id, 'placement', e.target.value as CodeBlock['placement'])} className="h-[32px] px-3 rounded-lg bg-[#3a6b44]/[0.03] text-[#3a6b44] text-[12px] font-medium outline-none appearance-none cursor-pointer"><option value="head">{PLACEMENT_LABELS['head']}</option><option value="body-start">{PLACEMENT_LABELS['body-start']}</option><option value="body-end">{PLACEMENT_LABELS['body-end']}</option></select></div>
              <div className="flex-1"><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Description</label><input value={block.description} onChange={e => update(block.id, 'description', e.target.value)} className="w-full h-[32px] px-3 rounded-lg bg-[#3a6b44]/[0.03] text-[#3a6b44] text-[12px] outline-none" /></div>
            </div>
            <textarea value={block.code} onChange={e => update(block.id, 'code', e.target.value)} rows={8} className="w-full px-5 py-4 rounded-xl bg-[#1e1e2e] text-[#c6d0f5] text-[12px] font-mono outline-none resize-none leading-relaxed border-2 border-transparent focus:border-[#ff5c00]/20 transition-all" spellCheck={false} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
