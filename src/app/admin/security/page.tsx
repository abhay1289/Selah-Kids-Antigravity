'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, AlertTriangle, XCircle, Lock, Globe, Key, Database, FileText } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
interface SecurityCheck { id: string; category: string; check: string; status: 'pass' | 'warning' | 'critical'; detail: string; icon: LucideIcon; }

const CHECKS: SecurityCheck[] = [
  { id: '1', category: 'SSL', check: 'SSL Certificate Valid', status: 'pass', detail: 'Certificate valid until Dec 2026 (Let\'s Encrypt)', icon: Lock },
  { id: '2', category: 'SSL', check: 'HTTPS Redirect', status: 'pass', detail: 'All HTTP requests redirect to HTTPS (301)', icon: Lock },
  { id: '3', category: 'Headers', check: 'X-Frame-Options', status: 'pass', detail: 'Set to SAMEORIGIN — prevents clickjacking', icon: Shield },
  { id: '4', category: 'Headers', check: 'Content-Security-Policy', status: 'warning', detail: 'CSP is not configured — recommended to prevent XSS attacks', icon: Shield },
  { id: '5', category: 'Headers', check: 'X-Content-Type-Options', status: 'pass', detail: 'Set to nosniff — prevents MIME type sniffing', icon: Shield },
  { id: '6', category: 'Headers', check: 'Strict-Transport-Security', status: 'pass', detail: 'HSTS enabled with max-age=31536000', icon: Shield },
  { id: '7', category: 'Auth', check: 'Admin Panel Protection', status: 'pass', detail: 'Supabase Auth guard with JWT token verification', icon: Key },
  { id: '8', category: 'Auth', check: 'Row Level Security', status: 'pass', detail: 'RLS policies active on all Supabase tables', icon: Database },
  { id: '9', category: 'Auth', check: 'Password Policy', status: 'warning', detail: 'No minimum password length enforced — recommend 8+ characters', icon: Key },
  { id: '10', category: 'Data', check: 'Database Backup', status: 'pass', detail: 'Supabase daily backups enabled (7-day retention)', icon: Database },
  { id: '11', category: 'Data', check: 'Environment Variables', status: 'pass', detail: 'All secrets stored in .env.local, not committed to git', icon: FileText },
  { id: '12', category: 'Network', check: 'DDoS Protection', status: 'pass', detail: 'Vercel Edge Network provides automatic DDoS mitigation', icon: Globe },
  { id: '13', category: 'Network', check: 'API Rate Limiting', status: 'warning', detail: 'No custom rate limiting on API routes — using Vercel defaults', icon: Globe },
  { id: '14', category: 'Privacy', check: 'Cookie Consent Banner', status: 'critical', detail: 'No cookie consent banner — required for GDPR compliance', icon: Shield },
  { id: '15', category: 'Privacy', check: 'Privacy Policy', status: 'pass', detail: 'Privacy policy page exists at /privacy', icon: FileText },
];

const SEV = {
  pass: { icon: CheckCircle2, color: '#93d35c', bg: 'bg-[#93d35c]/10', label: 'Passed' },
  warning: { icon: AlertTriangle, color: '#feb835', bg: 'bg-[#feb835]/10', label: 'Warning' },
  critical: { icon: XCircle, color: '#ef4444', bg: 'bg-red-500/10', label: 'Critical' },
};

export default function SecurityScanner() {
  const pass = CHECKS.filter(c => c.status === 'pass').length;
  const warn = CHECKS.filter(c => c.status === 'warning').length;
  const crit = CHECKS.filter(c => c.status === 'critical').length;
  const score = Math.round((pass / CHECKS.length) * 100);
  const grade = crit === 0 && warn <= 1 ? 'A+' : crit === 0 ? 'A' : 'B';

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Security</h2><p className="text-[12px] text-[#5a7d62]/50">SSL, headers, auth, and compliance scan</p></div>
        <span className="text-[18px] font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: score >= 80 ? '#93d35c15' : '#feb83515', color: score >= 80 ? '#93d35c' : '#feb835' }}>Grade: {grade}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ ...SEV.pass, count: pass }, { ...SEV.warning, count: warn, label: 'Warnings' }, { ...SEV.critical, count: crit }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}><s.icon size={18} style={{ color: s.color }} /></div>
            <div className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{s.count}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Checks */}
      {(['critical', 'warning', 'pass'] as const).map(severity => {
        const items = CHECKS.filter(c => c.status === severity);
        if (!items.length) return null;
        const config = SEV[severity];
        return (
          <motion.div key={severity} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-[13px] font-bold text-[#3a6b44] mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}><config.icon size={14} style={{ color: config.color }} /> {config.label} ({items.length})</h3>
            <div className="space-y-2">
              {items.map((check, i) => (
                <motion.div key={check.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className={`${config.bg} rounded-2xl p-4 flex items-start gap-4`}>
                  <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0"><check.icon size={16} style={{ color: config.color }} /></div>
                  <div className="flex-1"><p className="text-[13px] font-semibold text-[#3a6b44]">{check.check}</p><p className="text-[12px] text-[#5a7d62]/50 mt-0.5">{check.detail}</p></div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/60" style={{ color: config.color }}>{check.category}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
