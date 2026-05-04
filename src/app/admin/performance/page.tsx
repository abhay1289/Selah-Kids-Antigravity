'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Move, CheckCircle2, AlertTriangle, XCircle, Lightbulb, ArrowUpRight, Image, Type, Code, Wifi } from 'lucide-react';

function ScoreGauge({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 90 ? '#93d35c' : score >= 50 ? '#feb835' : '#ef4444';
  const label = score >= 90 ? 'Good' : score >= 50 ? 'Needs Work' : 'Poor';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90"><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#3a6b44" strokeWidth="8" strokeOpacity="0.06" /><motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} /></svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

const CWV = [
  { metric: 'LCP', label: 'Largest Contentful Paint', value: '1.8s', target: '< 2.5s', score: 92, icon: Clock, desc: 'How fast the main content loads' },
  { metric: 'INP', label: 'Interaction to Next Paint', value: '120ms', target: '< 200ms', score: 88, icon: Zap, desc: 'How fast the page responds to input' },
  { metric: 'CLS', label: 'Cumulative Layout Shift', value: '0.04', target: '< 0.1', score: 95, icon: Move, desc: 'How stable the layout is' },
];

const PAGE_SCORES = [
  { path: '/', name: 'Homepage', mobile: 92, desktop: 97 },
  { path: '/about', name: 'About', mobile: 88, desktop: 95 },
  { path: '/watch', name: 'Watch', mobile: 78, desktop: 90 },
  { path: '/parents', name: 'Families', mobile: 90, desktop: 96 },
  { path: '/blog', name: 'Blog', mobile: 85, desktop: 93 },
  { path: '/resources', name: 'Resources', mobile: 91, desktop: 97 },
  { path: '/donate', name: 'Donate', mobile: 93, desktop: 98 },
  { path: '/contact', name: 'Contact', mobile: 89, desktop: 94 },
];

const TIPS = [
  { icon: Image, title: 'Optimize Images', desc: 'Use next/image with WebP format. 3 images on Watch page could save ~340KB.', impact: 'High', color: '#ff5c00' },
  { icon: Type, title: 'Preload Fonts', desc: 'Add preload hints for Fredoka and Quicksand fonts to reduce FOIT.', impact: 'Medium', color: '#feb835' },
  { icon: Code, title: 'Reduce JS Bundle', desc: 'Code-split the Watch page video player for faster initial load.', impact: 'Medium', color: '#00BFFF' },
  { icon: Wifi, title: 'Enable CDN Caching', desc: 'Set Cache-Control headers for static assets to leverage Vercel Edge Network.', impact: 'Low', color: '#93d35c' },
];

export default function PerformanceMonitor() {
  const overallScore = 91;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Performance</h2>
          <p className="text-[12px] text-[#5a7d62]/50">Core Web Vitals & speed monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#93d35c]/10 text-[#3a6b44]">
          <CheckCircle2 size={14} className="text-[#93d35c]" />
          <span className="text-[12px] font-bold">All Core Web Vitals passed</span>
        </div>
      </div>

      {/* Overall Score + CWV */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overall Gauge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col items-center justify-center">
          <ScoreGauge score={overallScore} size={140} />
          <p className="text-[13px] font-semibold text-[#3a6b44] mt-4">Overall Score</p>
          <p className="text-[11px] text-[#5a7d62]/40">Lighthouse performance</p>
        </motion.div>

        {/* CWV Cards */}
        {CWV.map((item, i) => {
          const color = item.score >= 90 ? '#93d35c' : item.score >= 50 ? '#feb835' : '#ef4444';
          const StatusIcon = item.score >= 90 ? CheckCircle2 : item.score >= 50 ? AlertTriangle : XCircle;
          return (
            <motion.div key={item.metric} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}><item.icon size={20} style={{ color }} /></div>
                <div>
                  <p className="text-[15px] font-bold text-[#3a6b44]">{item.metric}</p>
                  <p className="text-[11px] text-[#5a7d62]/40">{item.label}</p>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{item.value}</span>
                <span className="text-[11px] font-medium text-[#5a7d62]/40 mb-1.5">target {item.target}</span>
              </div>
              <div className="flex items-center gap-1.5"><StatusIcon size={14} style={{ color }} /><span className="text-[12px] font-bold" style={{ color }}>{item.desc}</span></div>
            </motion.div>
          );
        })}
      </div>

      {/* Page-by-Page Scores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#3a6b44]/5">
          <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Page Speed Scores</h3>
        </div>
        <div className="divide-y divide-[#3a6b44]/5">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_100px_100px] gap-4 px-6 py-3 text-[11px] font-bold text-[#5a7d62]/40 uppercase tracking-wider">
            <span>Page</span><span className="text-center">📱 Mobile</span><span className="text-center">🖥️ Desktop</span>
          </div>
          {PAGE_SCORES.map(page => (
            <div key={page.path} className="grid grid-cols-[1fr_100px_100px] gap-4 px-6 py-3.5 hover:bg-[#3a6b44]/[0.02] transition-colors items-center">
              <div>
                <p className="text-[13px] font-semibold text-[#3a6b44]">{page.name}</p>
                <p className="text-[11px] text-[#5a7d62]/40 font-mono">{page.path}</p>
              </div>
              <div className="flex justify-center">
                <span className={`text-[13px] font-bold px-3 py-1 rounded-lg ${page.mobile >= 90 ? 'text-[#93d35c] bg-[#93d35c]/10' : page.mobile >= 50 ? 'text-[#feb835] bg-[#feb835]/10' : 'text-red-500 bg-red-500/10'}`}>{page.mobile}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[13px] font-bold px-3 py-1 rounded-lg ${page.desktop >= 90 ? 'text-[#93d35c] bg-[#93d35c]/10' : page.desktop >= 50 ? 'text-[#feb835] bg-[#feb835]/10' : 'text-red-500 bg-red-500/10'}`}>{page.desktop}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Optimization Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="text-[14px] font-bold text-[#3a6b44] mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>💡 Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIPS.map((tip, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm flex gap-4 group hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${tip.color}15` }}><tip.icon size={18} style={{ color: tip.color }} /></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-[13px] font-bold text-[#3a6b44]">{tip.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tip.impact === 'High' ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : tip.impact === 'Medium' ? 'bg-[#feb835]/10 text-[#feb835]' : 'bg-[#93d35c]/10 text-[#93d35c]'}`}>{tip.impact}</span>
                </div>
                <p className="text-[12px] text-[#5a7d62]/60 leading-relaxed">{tip.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
