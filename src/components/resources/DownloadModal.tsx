"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, CheckCircle2, Lock, ArrowRight, Download, Heart, Shield, FileDown, Gift } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resourceTitle: string;
}

export const DownloadModal = ({ isOpen, onClose, onSuccess, resourceTitle }: DownloadModalProps) => {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(0); // 0 = preview, 1 = name, 2 = email

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setStep(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.setItem('selah_subscribed', 'true');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2200);
    }, 1800);
  };

  const canProceedToStep2 = firstName.trim().length > 0 && lastName.trim().length > 0;
  const isValidEmail = email.includes('@') && email.includes('.');

  if (!isOpen) return null;

  const steps = [
    { num: 1, label: t("Preview", "Vista"), icon: FileDown },
    { num: 2, label: t("Details", "Datos"), icon: User },
    { num: 3, label: t("Download", "Descargar"), icon: Download },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-selah-dark/60 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="relative w-full max-w-[480px] bg-white rounded-[2rem] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.3)] overflow-hidden z-10"
        >
          {/* ── Close Button ── */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-2 bg-selah-dark/5 hover:bg-selah-dark/10 rounded-xl text-selah-dark/50 hover:text-selah-dark transition-all duration-300 hover:rotate-90"
          >
            <X size={16} />
          </button>

          {/* ── Step Progress Bar ── */}
          <div className="px-8 pt-7 pb-0">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div 
                      animate={{ 
                        scale: step === i ? 1.1 : 1,
                        backgroundColor: step >= i ? '#FF5C00' : '#f3f0ec'
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500"
                    >
                      {step > i ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : (
                        <s.icon size={15} className={step >= i ? 'text-white' : 'text-selah-muted/40'} />
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${step >= i ? 'text-selah-orange' : 'text-selah-muted/30'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-3 mb-5">
                      <div className="h-[2px] bg-selah-dark/[0.06] rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: step > i ? '100%' : '0%' }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full bg-selah-orange rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-selah-dark/[0.06] mx-8 my-3" />

          {/* ── Body ── */}
          <div className="px-8 pb-8 pt-4">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* ── SUCCESS STATE ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="py-8 flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg shadow-green-500/25"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <motion.h4 
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="text-2xl font-black text-selah-dark mb-2 font-display tracking-tight"
                  >
                    {t(`Welcome, ${firstName}!`, `¡Bienvenido/a, ${firstName}!`)}
                  </motion.h4>
                  <motion.p 
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="text-selah-muted text-sm mb-6"
                  >
                    {t("Your download is starting now...", "Tu descarga comenzará ahora...")}
                  </motion.p>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-1.5 bg-gradient-to-r from-selah-orange to-selah-yellow rounded-full"
                  />
                </motion.div>
              ) : step === 0 ? (
                /* ── STEP 0: PREVIEW — What you're downloading ── */
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* What you're getting */}
                  <div className="bg-gradient-to-br from-selah-orange/[0.06] via-selah-yellow/[0.04] to-white rounded-2xl p-5 border border-selah-orange/10 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-selah-orange/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Gift size={22} className="text-selah-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-selah-orange uppercase tracking-widest mb-1">
                          {t("You're downloading", "Estás descargando")}
                        </p>
                        <h3 className="text-lg font-black font-display text-selah-dark tracking-tight leading-snug">
                          {resourceTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Benefits list */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: FileDown, text: t("High-quality printable PDF file", "Archivo PDF imprimible de alta calidad"), color: "text-selah-orange", bg: "bg-selah-orange/8" },
                      { icon: Heart, text: t("Join 1,000+ Selah Kids families", "Únete a más de 1,000 familias"), color: "text-[#FF69B4]", bg: "bg-[#FF69B4]/8" },
                      { icon: Mail, text: t("Get early access to new resources", "Obtén acceso anticipado a recursos"), color: "text-[#00BFFF]", bg: "bg-[#00BFFF]/8" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <item.icon size={14} className={item.color} />
                        </div>
                        <span className="text-selah-dark/70 text-sm font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="w-full py-4 bg-selah-orange hover:bg-[#e65300] text-white rounded-2xl font-bold text-sm font-display tracking-tight shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(255,92,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2.5"
                  >
                    {t("Continue to Download", "Continuar a Descarga")}
                    <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              ) : step === 1 ? (
                /* ── STEP 1: NAME ── */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                >
                  <h3 className="text-lg font-black font-display text-selah-dark tracking-tight mb-1">
                    {t("What's your name?", "¿Cómo te llamas?")}
                  </h3>
                  <p className="text-selah-muted/70 text-sm mb-5">
                    {t("We'll personalize your experience.", "Personalizaremos tu experiencia.")}
                  </p>

                  <div className="space-y-3.5">
                    {/* First Name */}
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-selah-orange/8 flex items-center justify-center group-focus-within:bg-selah-orange/15 transition-colors duration-300">
                        <User size={16} className="text-selah-orange" />
                      </div>
                      <input 
                        required autoFocus type="text" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-[3.5rem] pr-10 py-3.5 rounded-xl bg-selah-dark/[0.02] border-2 border-selah-dark/[0.06] focus:border-selah-orange/30 focus:ring-4 focus:ring-selah-orange/8 focus:bg-white transition-all outline-none text-selah-dark placeholder:text-selah-muted/30 text-sm font-medium"
                        placeholder={t("First name", "Nombre")}
                      />
                      {firstName && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-selah-orange/8 flex items-center justify-center group-focus-within:bg-selah-orange/15 transition-colors duration-300">
                        <User size={16} className="text-selah-orange" />
                      </div>
                      <input 
                        required type="text" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-[3.5rem] pr-10 py-3.5 rounded-xl bg-selah-dark/[0.02] border-2 border-selah-dark/[0.06] focus:border-selah-orange/30 focus:ring-4 focus:ring-selah-orange/8 focus:bg-white transition-all outline-none text-selah-dark placeholder:text-selah-muted/30 text-sm font-medium"
                        placeholder={t("Last name", "Apellido")}
                      />
                      {lastName && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setStep(0)}
                      className="px-5 py-3.5 rounded-xl border-2 border-selah-dark/[0.06] text-selah-muted text-sm font-bold hover:border-selah-dark/10 hover:text-selah-dark transition-all"
                    >
                      {t("Back", "Atrás")}
                    </button>
                    <motion.button
                      whileHover={{ scale: canProceedToStep2 ? 1.02 : 1 }}
                      whileTap={{ scale: canProceedToStep2 ? 0.98 : 1 }}
                      onClick={() => canProceedToStep2 && setStep(2)}
                      disabled={!canProceedToStep2}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm font-display tracking-tight flex items-center justify-center gap-2 transition-all duration-300 ${
                        canProceedToStep2
                          ? 'bg-selah-orange text-white shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(255,92,0,0.5)]'
                          : 'bg-selah-dark/[0.04] text-selah-muted/40 cursor-not-allowed'
                      }`}
                    >
                      {t("Next", "Siguiente")}
                      <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* ── STEP 2: EMAIL + SUBMIT ── */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Personalized greeting */}
                  <div className="flex items-center gap-3 p-3.5 bg-green-50 border border-green-100 rounded-xl mb-5">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart size={14} className="text-green-600" />
                    </div>
                    <p className="text-green-800/70 text-sm font-medium">
                      {t(
                        `Almost there, ${firstName}! Add your email to get your free resource.`,
                        `¡Casi listo, ${firstName}! Agrega tu correo para obtener tu recurso gratis.`
                      )}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="relative group mb-2">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-selah-orange/8 flex items-center justify-center group-focus-within:bg-selah-orange/15 transition-colors duration-300">
                        <Mail size={16} className="text-selah-orange" />
                      </div>
                      <input 
                        required autoFocus type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-[3.5rem] pr-10 py-3.5 rounded-xl bg-selah-dark/[0.02] border-2 border-selah-dark/[0.06] focus:border-selah-orange/30 focus:ring-4 focus:ring-selah-orange/8 focus:bg-white transition-all outline-none text-selah-dark placeholder:text-selah-muted/30 text-sm font-medium"
                        placeholder="hello@example.com"
                      />
                      {isValidEmail && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </motion.div>
                      )}
                    </div>

                    {/* Back link */}
                    <button 
                      type="button" onClick={() => setStep(1)} 
                      className="text-selah-muted/50 text-xs hover:text-selah-orange transition-colors mb-5 flex items-center gap-1 mt-1.5"
                    >
                      <ArrowRight size={10} className="rotate-180" />
                      {t("Edit name", "Editar nombre")}
                    </button>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
                      whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
                      disabled={isSubmitting || !isValidEmail}
                      className={`w-full py-4 rounded-2xl font-bold text-sm font-display tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 ${
                        isSubmitting || !isValidEmail
                          ? 'bg-selah-dark/[0.04] text-selah-muted/40 cursor-not-allowed'
                          : 'bg-selah-orange text-white shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_20px_40px_-8px_rgba(255,92,0,0.5)]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-selah-muted/20 border-t-selah-muted rounded-full animate-spin" />
                          <span>{t("Subscribing...", "Suscribiendo...")}</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          {t("Subscribe & Download", "Suscribirse y Descargar")}
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-5 mt-5">
                    {[
                      { icon: Shield, label: t("Secure", "Seguro") },
                      { icon: Lock, label: t("No Spam", "Sin Spam") },
                      { icon: Heart, label: t("100% Free", "100% Gratis") },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-selah-muted/40">
                        <item.icon size={11} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
