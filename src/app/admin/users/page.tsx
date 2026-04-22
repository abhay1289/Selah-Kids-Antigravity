'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Shield, Eye, PenLine, Settings, Trash2, Mail } from 'lucide-react';

interface User { id: string; name: string; email: string; role: 'admin' | 'editor' | 'viewer'; avatar: string; lastActive: string; status: 'active' | 'invited'; }

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Leah', email: 'leah@selahkids.com', role: 'admin', avatar: 'L', lastActive: '2 min ago', status: 'active' },
  { id: '2', name: 'Rey', email: 'rey@veyrastudios.com', role: 'editor', avatar: 'R', lastActive: '1h ago', status: 'active' },
  { id: '3', name: 'Carla', email: 'carla@selahkids.com', role: 'editor', avatar: 'C', lastActive: '3h ago', status: 'active' },
];

const ROLE_CONFIG = {
  admin: { label: 'Admin', icon: Shield, color: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/10', desc: 'Full access to all dashboard features, settings, and user management' },
  editor: { label: 'Editor', icon: PenLine, color: 'text-[#00BFFF]', bg: 'bg-[#00BFFF]/10', desc: 'Can edit pages, content, blog posts, and media. Cannot access settings or users' },
  viewer: { label: 'Viewer', icon: Eye, color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10', desc: 'Read-only access to view all content and analytics' },
};

const PERMISSIONS = [
  { label: 'Edit Pages', admin: true, editor: true, viewer: false },
  { label: 'Manage Content', admin: true, editor: true, viewer: false },
  { label: 'Upload Media', admin: true, editor: true, viewer: false },
  { label: 'Manage Blog', admin: true, editor: true, viewer: false },
  { label: 'View Analytics', admin: true, editor: true, viewer: true },
  { label: 'SEO Manager', admin: true, editor: true, viewer: false },
  { label: 'Manage Redirects', admin: true, editor: false, viewer: false },
  { label: 'Edit Settings', admin: true, editor: false, viewer: false },
  { label: 'Manage Users', admin: true, editor: false, viewer: false },
  { label: 'Theme & Design', admin: true, editor: false, viewer: false },
  { label: 'Custom Code', admin: true, editor: false, viewer: false },
  { label: 'Export/Backup', admin: true, editor: false, viewer: false },
];

export default function UserRoles() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [isSaving, setIsSaving] = useState(false);

  const updateRole = (id: string, role: string) => setUsers(users.map(u => u.id === id ? { ...u, role: role as User['role'] } : u));
  const removeUser = (id: string) => { if (confirm('Remove this user?')) setUsers(users.filter(u => u.id !== id)); };
  const inviteUser = () => { if (!inviteEmail) return; setUsers([...users, { id: Date.now().toString(), name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, avatar: inviteEmail.charAt(0).toUpperCase(), lastActive: 'Invited', status: 'invited' }]); setInviteEmail(''); setShowInvite(false); };
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Users & Roles</h2><p className="text-[12px] text-[#5a7d62]/50">{users.length} team members</p></div>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowInvite(!showInvite)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 border border-[#ff5c00]/20"><Plus size={14} /> Invite</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-[#ff5c00]/5 rounded-2xl p-5 border border-[#ff5c00]/10 flex flex-col md:flex-row items-end gap-3">
          <div className="flex-1 w-full"><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Email Address</label><input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="team@selahkids.com" className="w-full h-[40px] px-4 rounded-xl bg-white border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] outline-none transition-all" /></div>
          <div className="w-[140px]"><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Role</label><select value={inviteRole} onChange={e => setInviteRole(e.target.value as 'editor' | 'viewer')} className="w-full h-[40px] px-3 rounded-xl bg-white border-2 border-transparent text-[#3a6b44] text-[13px] outline-none appearance-none cursor-pointer"><option value="editor">Editor</option><option value="viewer">Viewer</option></select></div>
          <motion.button whileTap={{ scale: 0.98 }} onClick={inviteUser} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5c00] to-[#FF7B29] text-white text-[13px] font-bold flex items-center gap-2"><Mail size={14} /> Send Invite</motion.button>
        </motion.div>
      )}

      {/* User Cards */}
      <div className="space-y-3">
        {users.map((user) => {
          const roleConfig = ROLE_CONFIG[user.role];
          return (
            <motion.div key={user.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5c00] to-[#feb835] flex items-center justify-center text-white text-[16px] font-bold shadow-lg ${user.status === 'invited' ? 'opacity-50' : ''}`}>{user.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-[14px] font-bold text-[#3a6b44]">{user.name}</p>{user.status === 'invited' && <span className="text-[10px] font-bold text-[#feb835] bg-[#feb835]/10 px-2 py-0.5 rounded">Pending</span>}</div>
                <p className="text-[12px] text-[#5a7d62]/40">{user.email}</p>
              </div>
              <div className="text-right mr-2"><p className="text-[11px] text-[#5a7d62]/30">{user.lastActive}</p></div>
              <select value={user.role} onChange={e => updateRole(user.id, e.target.value)} disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1} className={`h-[36px] px-3 rounded-xl ${roleConfig.bg} ${roleConfig.color} text-[12px] font-bold outline-none appearance-none cursor-pointer border-2 border-transparent`}>
                <option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option>
              </select>
              {user.role !== 'admin' && <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeUser(user.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><Trash2 size={14} /></motion.button>}
            </motion.div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#3a6b44]/5"><h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>🔐 Permissions Matrix</h3></div>
        <div className="divide-y divide-[#3a6b44]/5">
          <div className="grid grid-cols-[1fr_80px_80px_80px] gap-2 px-6 py-3 text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider"><span>Permission</span><span className="text-center">Admin</span><span className="text-center">Editor</span><span className="text-center">Viewer</span></div>
          {PERMISSIONS.map((perm, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_80px_80px] gap-2 px-6 py-2.5 items-center hover:bg-[#3a6b44]/[0.02]">
              <span className="text-[13px] font-medium text-[#3a6b44]">{perm.label}</span>
              {(['admin', 'editor', 'viewer'] as const).map(role => (
                <span key={role} className="flex justify-center"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${perm[role] ? 'bg-[#93d35c]/10 text-[#93d35c]' : 'bg-red-500/5 text-red-400'}`}>{perm[role] ? '✓' : '✕'}</span></span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
