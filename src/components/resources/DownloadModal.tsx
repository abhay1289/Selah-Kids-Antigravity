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
    { num: 1, label: t("Preview", "Vista") },
    { num: 2, label: t("About You", "Sobre ti") },
    { num: 3, label: t("Download", "Descarga") },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Cinematic Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-selah-dark/40 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="relative w-full max-w-[480px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white/60 overflow-hidden z-10"
        >
          {/* Ambient Glow Inside Modal */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-selah-orange/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-selah-yellow/10 rounded-full blur-[80px] pointer-events-none" />

          {/* ── Close Button ── */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-2.5 bg-selah-dark/[0.03] hover:bg-selah-dark/[0.08] rounded-full text-selah-dark/40 hover:text-selah-dark transition-all duration-300 hover:rotate-90"
          >
            <X size={18} />
          </button>

          {/* ── Premium Step Progress Bar ── */}
          <div className="px-8 pt-8 pb-2 relative z-10">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s, i) => (
                <div key={s.num} className="flex flex-col items-center flex-1 relative">
                  {/* Connecting Line */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-3 left-[60%] w-full h-[2px] bg-selah-dark/[0.04]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: step > i ? '100%' : '0%' }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-selah-orange"
                      />
                    </div>
                  )}
                  {/* Step Dot */}
                  <motion.div 
                    animate={{ 
                      scale: step === i ? 1 : 0.8,
                      backgroundColor: step > i ? '#FF5C00' : step === i ? '#FF5C00' : '#f3f0ec',
                      borderColor: step === i ? 'rgba(255,92,0,0.2)' : 'transparent'
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 border-[4px] bg-clip-padding transition-colors duration-500`}
                  >
                    {step > i && <CheckCircle2 size={12} className="text-white" />}
                    {step === i && <div className="w-2 h-2 bg-white rounded-full" />}
                  </motion.div>
                  <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${step >= i ? 'text-selah-dark' : 'text-selah-muted/40'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-selah-dark/[0.06] to-transparent mx-8 my-2" />

          {/* ── Body ── */}
          <div className="px-8 pb-10 pt-4 relative z-10">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* ── SUCCESS STATE ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="py-10 flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                    className="w-24 h-24 bg-gradient-to-br from-[#4ade80] to-[#22c55e] text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-green-500/20"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <motion.h4 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="text-3xl font-black text-selah-dark mb-3 font-display tracking-tight"
                  >
                    {t(`Done, ${firstName}!`, `¡Listo, ${firstName}!`)}
                  </motion.h4>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="text-selah-muted text-[15px] mb-8"
                  >
                    {t("Your download is starting immediately.", "Tu descarga está comenzando de inmediato.")}
                  </motion.p>
                  <div className="w-full h-1.5 bg-selah-dark/[0.04] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-selah-orange to-selah-yellow"
                    />
                  </div>
                </motion.div>
              ) : step === 0 ? (
                /* ── STEP 0: PREVIEW ── */
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-b from-[#FDFBF7] to-white rounded-[1.5rem] p-6 border border-selah-dark/[0.04] mb-6 shadow-sm">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-selah-orange/10 to-selah-orange/5 rounded-2xl flex items-center justify-center flex-shrink-0 border border-selah-orange/10">
                        <Gift size={24} className="text-selah-orange" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-[10px] font-bold text-selah-orange uppercase tracking-widest mb-1">
                          {t("You're getting", "Estás obteniendo")}
                        </p>
                        <h3 className="text-xl font-black font-display text-selah-dark tracking-tight leading-tight">
                          {resourceTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 px-2">
                    {[
                      { icon: FileDown, text: t("High-quality printable format", "Formato imprimible de alta calidad") },
                      { icon: Shield, text: t("100% safe & trusted by families", "100% seguro y confiable para familias") },
                      { icon: Mail, text: t("Exclusive early access to new resources", "Acceso anticipado a nuevos recursos") },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.15 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-6 h-6 rounded-full bg-selah-dark/[0.03] flex items-center justify-center flex-shrink-0">
                          <item.icon size={12} className="text-selah-dark/60" />
                        </div>
                        <span className="text-selah-dark/80 text-[15px] font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setStep(1)}
                    className="w-full h-[56px] bg-selah-dark text-white hover:bg-black rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md"
                  >
                    <span>{t("Continue", "Continuar")}</span>
                    <ArrowRight size={16} className="text-white/70" />
                  </motion.button>
                </motion.div>
              ) : step === 1 ? (
                /* ── STEP 1: NAME ── */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black font-display text-selah-dark tracking-tight mb-2">
                      {t("Who is this for?", "¿Para quién es esto?")}
                    </h3>
                    <p className="text-selah-muted text-[15px]">
                      {t("We like to make our emails personal.", "Personalizaremos tu experiencia.")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-selah-muted/40 group-focus-within:text-selah-orange transition-colors" />
                      </div>
                      <input 
                        required autoFocus type="text" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-[56px] pl-[3rem] pr-10 rounded-2xl bg-selah-dark/[0.02] hover:bg-selah-dark/[0.03] border-2 border-transparent focus:border-selah-orange/30 focus:bg-white text-selah-dark placeholder:text-selah-muted/40 text-[15px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.08)]"
                        placeholder={t("First Name", "Nombre")}
                      />
                      {firstName && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={18} className="text-[#22c55e]" /></motion.div>
                        </div>
                      )}
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-selah-muted/40 group-focus-within:text-selah-orange transition-colors" />
                      </div>
                      <input 
                        required type="text" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-[56px] pl-[3rem] pr-10 rounded-2xl bg-selah-dark/[0.02] hover:bg-selah-dark/[0.03] border-2 border-transparent focus:border-selah-orange/30 focus:bg-white text-selah-dark placeholder:text-selah-muted/40 text-[15px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.08)]"
                        placeholder={t("Last Name", "Apellido")}
                      />
                       {lastName && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={18} className="text-[#22c55e]" /></motion.div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setStep(0)}
                      className="px-6 h-[56px] rounded-2xl bg-white border border-selah-dark/[0.08] text-selah-dark hover:bg-selah-dark/[0.02] text-[15px] font-bold transition-all"
                    >
                      {t("Back", "Atrás")}
                    </button>
                    <motion.button
                      whileHover={{ scale: canProceedToStep2 ? 1.01 : 1, y: canProceedToStep2 ? -1 : 0 }}
                      whileTap={{ scale: canProceedToStep2 ? 0.99 : 1 }}
                      onClick={() => canProceedToStep2 && setStep(2)}
                      disabled={!canProceedToStep2}
                      className={`flex-1 h-[56px] rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2 transition-all duration-300 ${
                        canProceedToStep2
                          ? 'bg-selah-orange text-white shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_16px_40px_-8px_rgba(255,92,0,0.5)] cursor-pointer'
                          : 'bg-selah-dark/[0.03] text-selah-muted/40 cursor-not-allowed'
                      }`}
                    >
                      {t("Next Step", "Siguiente")}
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* ── STEP 2: EMAIL + SUBMIT ── */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black font-display text-selah-dark tracking-tight mb-2">
                      {t("Where to send it?", "¿A dónde lo enviamos?")}
                    </h3>
                    <p className="text-selah-muted text-[15px]">
                      {t(
                        `Almost there, ${firstName}! Enter your email.`,
                        `¡Casi listo, ${firstName}! Ingresa tu correo.`
                      )}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="relative group mb-5">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-selah-muted/40 group-focus-within:text-selah-orange transition-colors" />
                      </div>
                      <input 
                        required autoFocus type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[56px] pl-[3rem] pr-10 rounded-2xl bg-selah-dark/[0.02] hover:bg-selah-dark/[0.03] border-2 border-transparent focus:border-selah-orange/30 focus:bg-white text-selah-dark placeholder:text-selah-muted/40 text-[15px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.08)]"
                        placeholder="you@email.com"
                      />
                      {isValidEmail && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={18} className="text-[#22c55e]" /></motion.div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mb-6">
                       <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 h-[56px] rounded-2xl bg-white border border-selah-dark/[0.08] text-selah-dark hover:bg-selah-dark/[0.02] text-[15px] font-bold transition-all"
                      >
                        {t("Back", "Atrás")}
                      </button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: !isSubmitting && isValidEmail ? 1.01 : 1, y: !isSubmitting && isValidEmail ? -1 : 0 }}
                        whileTap={{ scale: !isSubmitting && isValidEmail ? 0.99 : 1 }}
                        disabled={isSubmitting || !isValidEmail}
                        className={`flex-1 h-[56px] rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 ${
                          isSubmitting || !isValidEmail
                            ? 'bg-selah-dark/[0.03] text-selah-muted/40 cursor-not-allowed'
                            : 'bg-gradient-to-r from-selah-orange to-[#FF7B29] text-white shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_16px_40px_-8px_rgba(255,92,0,0.5)]'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>{t("Processing...", "Procesando...")}</span>
                          </>
                        ) : (
                          <>
                            <Download size={18} />
                            {t("Download Free", "Descargar Gratis")}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-6 pt-2 border-t border-selah-dark/[0.04]">
                    {[
                      { icon: Shield, label: t("Secure", "Seguro") },
                      { icon: Lock, label: t("No Spam", "Sin Spam") },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-selah-muted/50">
                        <item.icon size={13} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
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
