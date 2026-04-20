"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, User, Mail, FileText, PenLine, Send, CheckCircle2 } from 'lucide-react';
import { slideInLeft } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

type FormValues = { name: string; email: string; subject: string; message: string };

interface FloatingFieldProps {
  id: keyof FormValues;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  isTextarea?: boolean;
  value: string;
  focusedField: string | null;
  setFocusedField: (id: string | null) => void;
  updateField: (field: keyof FormValues, value: string) => void;
}

function FloatingField({
  id, icon: Icon, placeholder, type = "text", isTextarea = false,
  value, focusedField, setFocusedField, updateField,
}: FloatingFieldProps) {
  const isFocused = focusedField === id;
  const hasValue = value.length > 0;

  return (
      <motion.div 
        className="relative group"
        animate={{ y: isFocused ? -1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Focus glow ring */}
        <motion.div
          className="absolute -inset-1 rounded-[1.25rem] pointer-events-none"
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.98 }}
          transition={{ duration: 0.3 }}
          style={{ background: 'radial-gradient(circle at center, rgba(255,92,0,0.04), transparent 70%)' }}
        />

        <div className="relative">
          {/* Leading Icon */}
          <motion.div 
            className="absolute top-0 left-0 pl-5 pt-[18px] pointer-events-none"
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? '#FF5C00' : hasValue ? '#FF5C00' : 'rgba(0,0,0,0.2)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Icon size={18} />
          </motion.div>

          {/* Floating Label */}
          <motion.label
            className="absolute left-[3.25rem] pointer-events-none font-medium text-selah-muted/40 origin-left z-10"
            animate={{
              y: isFocused || hasValue ? 6 : 18,
              scale: isFocused || hasValue ? 0.72 : 1,
              color: isFocused ? '#FF5C00' : 'rgba(0,0,0,0.25)',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {placeholder}
          </motion.label>

          {isTextarea ? (
            <textarea
              id={id}
              rows={4}
              value={value}
              onChange={(e) => updateField(id, e.target.value)}
              onFocus={() => setFocusedField(id)}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-[3.25rem] pr-12 pt-7 pb-4 rounded-2xl bg-selah-dark/[0.015] hover:bg-selah-dark/[0.025] border-2 border-transparent focus:border-selah-orange/25 focus:bg-white text-selah-dark text-[15px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.05)] resize-none"
            />
          ) : (
            <input
              id={id}
              type={type}
              value={value}
              onChange={(e) => updateField(id, e.target.value)}
              onFocus={() => setFocusedField(id)}
              onBlur={() => setFocusedField(null)}
              className="w-full h-[60px] pl-[3.25rem] pr-12 rounded-2xl bg-selah-dark/[0.015] hover:bg-selah-dark/[0.025] border-2 border-transparent focus:border-selah-orange/25 focus:bg-white text-selah-dark text-[15px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.05)]"
            />
          )}

          {/* Trailing check */}
          <AnimatePresence>
            {hasValue && (
              <motion.div 
                className={`absolute right-4 ${isTextarea ? 'top-[18px]' : 'top-1/2 -translate-y-1/2'}`}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <CheckCircle2 size={17} className="text-[#22c55e]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom highlight line */}
          <motion.div
            className="absolute bottom-0 left-[10%] right-[10%] h-[2px] rounded-full bg-selah-orange"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
  );
}

export const ContactForm = () => {
  const { t } = useLanguage();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    }, 1500);
  };

  return (
    <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="lg:col-span-7 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden">
      
      {/* Inner Island */}
      <div className="bg-gradient-to-b from-[#FDFBF7] to-white rounded-[2rem] p-6 md:p-10 lg:p-14 border border-black/[0.02] relative overflow-hidden">
        
        {/* Ambient internal glows */}
        <motion.div 
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-48 h-48 bg-selah-orange/[0.06] rounded-full blur-[60px] pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -10, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFFF]/[0.04] rounded-full blur-[60px] pointer-events-none" 
        />

        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="content-h2 mb-10"
          >
            {t("Send a Message", "Envía un Mensaje")}
          </motion.h2>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#4ade80] to-[#22c55e] text-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-2xl font-black font-display text-selah-dark tracking-tight mb-2">
                  {t("Message Sent!", "¡Mensaje Enviado!")}
                </h3>
                <p className="text-selah-muted text-[15px]">
                  {t("We'll get back to you soon.", "Nos pondremos en contacto pronto.")}
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FloatingField id="name" icon={User} placeholder={t("Your Name", "Tu Nombre")} value={values.name} focusedField={focusedField} setFocusedField={setFocusedField} updateField={updateField} />
                  <FloatingField id="email" icon={Mail} placeholder={t("Email Address", "Correo Electrónico")} type="email" value={values.email} focusedField={focusedField} setFocusedField={setFocusedField} updateField={updateField} />
                </div>
                <FloatingField id="subject" icon={FileText} placeholder={t("Subject", "Asunto")} value={values.subject} focusedField={focusedField} setFocusedField={setFocusedField} updateField={updateField} />
                <FloatingField id="message" icon={PenLine} placeholder={t("Your Message", "Tu Mensaje")} isTextarea value={values.message} focusedField={focusedField} setFocusedField={setFocusedField} updateField={updateField} />

                <motion.button 
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: !isSubmitting ? 1.02 : 1, y: !isSubmitting ? -2 : 0 }}
                  whileTap={{ scale: !isSubmitting ? 0.97 : 1 }}
                  className="w-full md:w-auto h-[56px] px-10 bg-selah-orange hover:bg-[#e65300] text-white rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2.5 shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_20px_50px_-8px_rgba(255,92,0,0.5)] transition-all duration-300 mt-8 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  {isSubmitting ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full relative z-10" 
                      />
                      <span className="relative z-10">{t("Sending...", "Enviando...")}</span>
                    </>
                  ) : (
                    <>
                      <Send size={17} className="relative z-10" />
                      <span className="relative z-10">{t("Send Message", "Enviar Mensaje")}</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
