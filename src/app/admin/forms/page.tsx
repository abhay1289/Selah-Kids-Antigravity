'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, GripVertical, Mail, MessageSquare } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';

interface FormField { id: string; labelEn: string; labelEs: string; type: 'text' | 'email' | 'textarea' | 'select' | 'phone'; required: boolean; placeholderEn: string; placeholderEs: string; }

interface FormConfig { id: string; name: string; recipientEmail: string; successMessageEn: string; successMessageEs: string; submitBtnEn: string; submitBtnEs: string; isActive: boolean; fields: FormField[]; }

const INITIAL_FORMS: FormConfig[] = [
  {
    id: '1', name: 'Contact Form', recipientEmail: 'info.selahkids@gmail.com',
    successMessageEn: 'Thank you! We\'ll get back to you soon.', successMessageEs: '¡Gracias! Te responderemos pronto.',
    submitBtnEn: 'Send Message', submitBtnEs: 'Enviar Mensaje', isActive: true,
    fields: [
      { id: 'f1', labelEn: 'Full Name', labelEs: 'Nombre Completo', type: 'text', required: true, placeholderEn: 'Your name', placeholderEs: 'Tu nombre' },
      { id: 'f2', labelEn: 'Email', labelEs: 'Correo Electrónico', type: 'email', required: true, placeholderEn: 'your@email.com', placeholderEs: 'tu@correo.com' },
      { id: 'f3', labelEn: 'Subject', labelEs: 'Asunto', type: 'select', required: true, placeholderEn: 'Select a topic', placeholderEs: 'Selecciona un tema' },
      { id: 'f4', labelEn: 'Message', labelEs: 'Mensaje', type: 'textarea', required: true, placeholderEn: 'Your message...', placeholderEs: 'Tu mensaje...' },
    ]
  },
  {
    id: '2', name: 'Newsletter Signup', recipientEmail: 'info.selahkids@gmail.com',
    successMessageEn: 'Welcome to the family! 🎉', successMessageEs: '¡Bienvenido a la familia! 🎉',
    submitBtnEn: 'JOIN', submitBtnEs: 'UNIRSE', isActive: true,
    fields: [
      { id: 'n1', labelEn: 'Email', labelEs: 'Correo', type: 'email', required: true, placeholderEn: 'Your email', placeholderEs: 'Tu correo' },
    ]
  },
];

export default function FormsManager() {
  const { items: forms, setItems: setForms, isSaving, save, error } = useCmsCollection<FormConfig>(
    'forms',
    INITIAL_FORMS,
  );
  const [selected, setSelected] = useState<string>(INITIAL_FORMS[0]?.id);

  const form = forms.find(f => f.id === selected);
  const updateForm = <K extends keyof FormConfig>(field: K, value: FormConfig[K]) => setForms(forms.map(f => f.id === selected ? { ...f, [field]: value } : f));
  const updateField = <K extends keyof FormField>(fieldId: string, key: K, value: FormField[K]) => { if (!form) return; const fields = form.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f); updateForm('fields', fields); };
  const addField = () => { if (!form) return; const f: FormField = { id: Date.now().toString(), labelEn: '', labelEs: '', type: 'text', required: false, placeholderEn: '', placeholderEs: '' }; updateForm('fields', [...form.fields, f]); };
  const removeField = (fieldId: string) => { if (!form) return; updateForm('fields', form.fields.filter(f => f.id !== fieldId)); };
  const handleSave = async () => { try { await save(); } catch { /* surfaced via hook */ } };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Forms</h2><p className="text-[12px] text-[#5a7d62]/50">Manage contact form and newsletter fields</p></div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Form Selector */}
        <div className="space-y-3">
          {forms.map(f => (
            <motion.button key={f.id} whileHover={{ x: 4 }} onClick={() => setSelected(f.id)} className={`w-full text-left p-4 rounded-2xl transition-all ${selected === f.id ? 'bg-white shadow-md border border-[#ff5c00]/20' : 'bg-white/50 border border-transparent hover:bg-white/80'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.name.includes('Newsletter') ? 'bg-[#feb835]/10' : 'bg-[#00BFFF]/10'}`}>{f.name.includes('Newsletter') ? <Mail size={18} className="text-[#feb835]" /> : <MessageSquare size={18} className="text-[#00BFFF]" />}</div>
                <div><p className="text-[13px] font-bold text-[#3a6b44]">{f.name}</p><p className="text-[11px] text-[#5a7d62]/40">{f.fields.length} fields</p></div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Form Editor */}
        {form && (
          <motion.div key={form.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* Settings */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
              <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>⚙️ Form Settings</h3>
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Recipient Email</label><input value={form.recipientEmail} onChange={e => updateForm('recipientEmail', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] outline-none transition-all" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Success Message (EN)</label><input value={form.successMessageEn} onChange={e => updateForm('successMessageEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] outline-none transition-all" /></div>
                <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Success Message (ES)</label><input value={form.successMessageEs} onChange={e => updateForm('successMessageEs', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] outline-none transition-all" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Submit Button (EN)</label><input value={form.submitBtnEn} onChange={e => updateForm('submitBtnEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] outline-none transition-all" /></div>
                <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Submit Button (ES)</label><input value={form.submitBtnEs} onChange={e => updateForm('submitBtnEs', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] outline-none transition-all" /></div>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between"><h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>📝 Form Fields</h3><motion.button whileTap={{ scale: 0.98 }} onClick={addField} className="flex items-center gap-1 text-[12px] font-bold text-[#ff5c00]"><Plus size={14} /> Add Field</motion.button></div>
              {form.fields.map((field, i) => (
                <div key={field.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-[#5a7d62]/20" />
                    <span className="text-[11px] font-bold text-[#5a7d62]/20">{i + 1}</span>
                    <span className="flex-1 text-[13px] font-bold text-[#3a6b44]">{field.labelEn || 'New Field'}</span>
                    <select value={field.type} onChange={e => updateField(field.id, 'type', e.target.value as FormField['type'])} className="h-[28px] px-2 rounded-lg bg-[#3a6b44]/[0.03] text-[11px] font-bold text-[#3a6b44] outline-none appearance-none cursor-pointer"><option value="text">Text</option><option value="email">Email</option><option value="phone">Phone</option><option value="textarea">Textarea</option><option value="select">Select</option></select>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateField(field.id, 'required', !field.required)} className={`px-2 py-1 rounded text-[10px] font-bold ${field.required ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-[#3a6b44]/5 text-[#5a7d62]/30'}`}>{field.required ? 'Required' : 'Optional'}</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeField(field.id)} className="p-1.5 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><Trash2 size={12} /></motion.button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={field.labelEn} onChange={e => updateField(field.id, 'labelEn', e.target.value)} placeholder="Label (EN)" className="h-[32px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] outline-none transition-all" />
                    <input value={field.labelEs} onChange={e => updateField(field.id, 'labelEs', e.target.value)} placeholder="Label (ES)" className="h-[32px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] outline-none transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
