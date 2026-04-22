'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Image as ImageIcon, Heading, Link, Palette, FormInput, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface A11yIssue { id: string; severity: 'pass' | 'warning' | 'error'; category: string; message: string; page: string; element?: string; }

const ISSUES: A11yIssue[] = [
  // Passes
  { id: 'p1', severity: 'pass', category: 'Headings', message: 'All pages have a single H1 element', page: 'All Pages' },
  { id: 'p2', severity: 'pass', category: 'Language', message: 'HTML lang attribute is set correctly for EN/ES', page: 'All Pages' },
  { id: 'p3', severity: 'pass', category: 'Links', message: 'All navigation links have descriptive text', page: 'Navbar' },
  { id: 'p4', severity: 'pass', category: 'Color', message: 'Primary text contrast ratio meets WCAG AA (7.2:1)', page: 'All Pages' },
  { id: 'p5', severity: 'pass', category: 'Forms', message: 'Newsletter email input has placeholder and label', page: 'Homepage' },
  { id: 'p6', severity: 'pass', category: 'Buttons', message: 'All interactive buttons have accessible names', page: 'All Pages' },
  { id: 'p7', severity: 'pass', category: 'Images', message: 'Team member photos have descriptive alt text', page: 'About' },
  { id: 'p8', severity: 'pass', category: 'ARIA', message: 'Mobile menu toggle has aria-label', page: 'Navbar' },
  // Warnings
  { id: 'w1', severity: 'warning', category: 'Images', message: 'Blog featured images could have more descriptive alt text', page: 'Blog', element: '<img alt="blog-armored-door">' },
  { id: 'w2', severity: 'warning', category: 'Color', message: 'Orange badge text on white background has 3.8:1 contrast (AA target: 4.5:1)', page: 'Homepage', element: '<Badge color="orange">' },
  { id: 'w3', severity: 'warning', category: 'Links', message: 'Social media icon links have no visible text label', page: 'Footer', element: '<a href="instagram...">' },
  { id: 'w4', severity: 'warning', category: 'Animation', message: 'Some animations may affect users with vestibular disorders — consider prefers-reduced-motion', page: 'Homepage' },
  // Errors
  { id: 'e1', severity: 'error', category: 'Images', message: 'Subscriber avatar images use placeholder alt text "Subscriber"', page: 'Homepage', element: '<img alt="Subscriber">' },
  { id: 'e2', severity: 'error', category: 'Forms', message: 'Contact form textarea is missing a visible label element', page: 'Contact', element: '<textarea placeholder="Your message...">' },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Images: ImageIcon, Headings: Heading, Links: Link, Color: Palette, Forms: FormInput,
  Buttons: Eye, Language: Eye, ARIA: Eye, Animation: Eye,
};

const SEV_CONFIG = {
  pass: { icon: CheckCircle2, color: '#93d35c', bg: 'bg-[#93d35c]/10', label: 'Pass' },
  warning: { icon: AlertTriangle, color: '#feb835', bg: 'bg-[#feb835]/10', label: 'Warning' },
  error: { icon: XCircle, color: '#ef4444', bg: 'bg-red-500/10', label: 'Error' },
};

export default function AccessibilityChecker() {
  const passes = ISSUES.filter(i => i.severity === 'pass').length;
  const warnings = ISSUES.filter(i => i.severity === 'warning').length;
  const errors = ISSUES.filter(i => i.severity === 'error').length;
  const total = ISSUES.length;
  const grade = errors === 0 && warnings <= 2 ? 'AA' : errors === 0 ? 'A' : 'Needs Work';
  const gradeColor = grade === 'AA' ? '#93d35c' : grade === 'A' ? '#feb835' : '#ef4444';

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Accessibility</h2>
          <p className="text-[12px] text-[#5a7d62]/50">WCAG 2.1 compliance checker</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: `${gradeColor}15`, color: gradeColor }}>Grade: {grade}</span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Passed', count: passes, color: '#93d35c', icon: CheckCircle2 },
          { label: 'Warnings', count: warnings, color: '#feb835', icon: AlertTriangle },
          { label: 'Errors', count: errors, color: '#ef4444', icon: XCircle },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}><stat.icon size={20} style={{ color: stat.color }} /></div>
            <div className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{stat.count}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-[#3a6b44]">Compliance Progress</span>
          <span className="text-[13px] font-bold text-[#93d35c]">{Math.round((passes / total) * 100)}%</span>
        </div>
        <div className="h-3 bg-[#3a6b44]/5 rounded-full overflow-hidden flex">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(passes / total) * 100}%` }} transition={{ duration: 1 }} className="h-full bg-[#93d35c] rounded-full" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${(warnings / total) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-[#feb835]" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${(errors / total) * 100}%` }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-red-500" />
        </div>
      </motion.div>

      {/* Issues by Severity */}
      {(['error', 'warning', 'pass'] as const).map(severity => {
        const items = ISSUES.filter(i => i.severity === severity);
        const config = SEV_CONFIG[severity];
        if (items.length === 0) return null;
        return (
          <motion.div key={severity} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-[13px] font-bold text-[#3a6b44] mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
              <config.icon size={14} style={{ color: config.color }} /> {config.label}s ({items.length})
            </h3>
            <div className="space-y-2">
              {items.map((issue, i) => {
                const CatIcon = CATEGORY_ICONS[issue.category] || Eye;
                return (
                  <motion.div key={issue.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className={`${config.bg} rounded-2xl p-4 flex items-start gap-4`}>
                    <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><CatIcon size={16} style={{ color: config.color }} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#3a6b44]">{issue.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#5a7d62]/40">{issue.page}</span>
                        {issue.element && <code className="text-[10px] bg-white/60 px-2 py-0.5 rounded font-mono text-[#5a7d62]/50">{issue.element}</code>}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/60" style={{ color: config.color }}>{issue.category}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
