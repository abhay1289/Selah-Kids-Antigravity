"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X, Mail, User, CheckCircle2, Lock, ArrowRight, Download, Shield, FileDown, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resourceTitle: string;
}

interface FloatingInputProps {
  id: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoFocus?: boolean;
  focusedField: string | null;
  setFocusedField: (id: string | null) => void;
}

function FloatingInput({
  id, icon: Icon, value, onChange, placeholder, type = "text", autoFocus = false,
  focusedField, setFocusedField,
}: FloatingInputProps) {
  const isFocused = focusedField === id;
  const hasValue = value.length > 0;
  const isValid = type === 'email' ? value.includes('@') && value.includes('.') : hasValue;

  return (
    <motion.div
      className="relative"
      animate={{ y: isFocused ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="absolute -inset-1 rounded-[1.25rem] pointer-events-none"
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.98
        }}
        transition={{ duration: 0.3 }}
        style={{ background: 'radial-gradient(circle at center, rgba(255,92,0,0.06), transparent 70%)' }}
      />

      <div className="relative">
        <motion.div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          animate={{
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? '#FF5C00' : hasValue ? '#FF5C00' : 'rgba(0,0,0,0.25)'
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon size={18} />
        </motion.div>

        <motion.label
          className="absolute left-[3rem] pointer-events-none font-medium text-selah-muted/50 origin-left"
          animate={{
            y: isFocused || hasValue ? -24 : 0,
            scale: isFocused || hasValue ? 0.75 : 1,
            color: isFocused ? '#FF5C00' : 'rgba(0,0,0,0.3)',
            opacity: isFocused || hasValue ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {placeholder}
        </motion.label>

        <input
          required
          autoFocus={autoFocus}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          className="w-full h-[56px] pl-[3rem] pr-12 rounded-2xl bg-selah-dark/[0.02] hover:bg-selah-dark/[0.03] border-2 border-transparent focus:border-selah-orange/30 focus:bg-white text-selah-dark placeholder:text-selah-muted/35 text-[15px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.06)]"
          placeholder={isFocused ? '' : placeholder}
        />

        <AnimatePresence>
          {isValid && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <CheckCircle2 size={18} className="text-[#22c55e]" />
            </motion.div>
          )}
        </AnimatePresence>

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

export const DownloadModal = ({ isOpen, onClose, onSuccess, resourceTitle }: DownloadModalProps) => {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const submitTimers = useRef<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      submitTimers.current.forEach((id) => window.clearTimeout(id));
      submitTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setStep(0);
      setFocusedField(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const first = window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.setItem('selah_subscribed', 'true');
      const second = window.setTimeout(() => {
        onSuccess();
        onClose();
      }, 2200);
      submitTimers.current.push(second);
    }, 1800);
    submitTimers.current.push(first);
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
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="relative w-full max-w-[480px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white/60 overflow-hidden z-10"
        >
          {/* Ambient Glow Inside Modal */}
          <motion.div 
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 bg-selah-orange/10 rounded-full blur-[80px] pointer-events-none" 
          />
          <motion.div 
            animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-selah-yellow/10 rounded-full blur-[80px] pointer-events-none" 
          />

          {/* ── Close Button ── */}
          <motion.button 
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute top-5 right-5 z-50 p-2.5 bg-selah-dark/[0.03] hover:bg-selah-dark/[0.08] rounded-full text-selah-dark/40 hover:text-selah-dark transition-colors duration-300"
          >
            <X size={18} />
          </motion.button>

          {/* ── Premium Step Progress Bar ── */}
          <div className="px-8 pt-8 pb-2 relative z-10">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s, i) => (
                <div key={s.num} className="flex flex-col items-center flex-1 relative">
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
                  <motion.div 
                    animate={{ 
                      scale: step === i ? 1.15 : step > i ? 1 : 0.8,
                      backgroundColor: step >= i ? '#FF5C00' : '#f3f0ec',
                      borderColor: step === i ? 'rgba(255,92,0,0.25)' : 'transparent'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-6 h-6 rounded-full flex items-center justify-center relative z-10 border-[4px] bg-clip-padding"
                  >
                    {step > i && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
                        <CheckCircle2 size={12} className="text-white" />
                      </motion.div>
                    )}
                    {step === i && (
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 bg-white rounded-full" 
                      />
                    )}
                  </motion.div>
                  <motion.span 
                    animate={{ color: step >= i ? '#1a1a1a' : 'rgba(0,0,0,0.25)' }}
                    className="mt-2 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {s.label}
                  </motion.span>
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="py-10 flex flex-col items-center text-center"
                >
                  {/* Confetti-like floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0, x: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        y: [-20, -80 - Math.random() * 40],
                        x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 160],
                        scale: [0.5, 1, 0.3]
                      }}
                      transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      className="absolute top-[40%] left-1/2 pointer-events-none"
                    >
                      <Sparkles size={12} className={i % 2 === 0 ? "text-selah-orange" : "text-selah-yellow"} />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
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
                  <motion.div 
                    className="bg-gradient-to-b from-[#FDFBF7] to-white rounded-[1.5rem] p-6 border border-selah-dark/[0.04] mb-6 shadow-sm"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start gap-5">
                      <motion.div 
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-14 h-14 bg-gradient-to-br from-selah-orange/10 to-selah-orange/5 rounded-2xl flex items-center justify-center flex-shrink-0 border border-selah-orange/10"
                      >
                        <Gift size={24} className="text-selah-orange" />
                      </motion.div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-[10px] font-bold text-selah-orange uppercase tracking-widest mb-1">
                          {t("You're getting", "Estás obteniendo")}
                        </p>
                        <h3 className="text-xl font-black font-display text-selah-dark tracking-tight leading-tight">
                          {resourceTitle}
                        </h3>
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-4 mb-8 px-2">
                    {[
                      { icon: FileDown, text: t("High-quality printable format", "Formato imprimible de alta calidad"), color: "#FF5C00" },
                      { icon: Shield, text: t("100% safe & trusted by families", "100% seguro y confiable para familias"), color: "#22c55e" },
                      { icon: Mail, text: t("Exclusive early access to new resources", "Acceso anticipado a nuevos recursos"), color: "#00BFFF" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 + 0.15, type: "spring", stiffness: 200 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 cursor-default"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${item.color}10` }}
                        >
                          <item.icon size={13} style={{ color: item.color }} />
                        </motion.div>
                        <span className="text-selah-dark/80 text-[15px] font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(1)}
                    className="w-full h-[56px] bg-selah-dark text-white hover:bg-black rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md relative overflow-hidden group"
                  >
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10">{t("Continue", "Continuar")}</span>
                    <motion.span 
                      className="relative z-10"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={16} className="text-white/70" />
                    </motion.span>
                  </motion.button>
                </motion.div>
              ) : step === 1 ? (
                /* ── STEP 1: NAME ── */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-center mb-6">
                    <motion.h3 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-black font-display text-selah-dark tracking-tight mb-2"
                    >
                      {t("Who is this for?", "¿Para quién es esto?")}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-selah-muted text-[15px]"
                    >
                      {t("We like to make our emails personal.", "Personalizaremos tu experiencia.")}
                    </motion.p>
                  </div>

                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <FloatingInput
                      id="firstName"
                      icon={User}
                      value={firstName}
                      onChange={setFirstName}
                      placeholder={t("First Name", "Nombre")}
                      autoFocus
                      focusedField={focusedField}
                      setFocusedField={setFocusedField}
                    />
                    <FloatingInput
                      id="lastName"
                      icon={User}
                      value={lastName}
                      onChange={setLastName}
                      placeholder={t("Last Name", "Apellido")}
                      focusedField={focusedField}
                      setFocusedField={setFocusedField}
                    />
                  </motion.div>

                  <motion.div 
                    className="flex gap-3 mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep(0)}
                      className="px-6 h-[56px] rounded-2xl bg-white border border-selah-dark/[0.08] text-selah-dark hover:bg-selah-dark/[0.02] text-[15px] font-bold transition-all"
                    >
                      {t("Back", "Atrás")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: canProceedToStep2 ? 1.02 : 1, y: canProceedToStep2 ? -2 : 0 }}
                      whileTap={{ scale: canProceedToStep2 ? 0.97 : 1 }}
                      onClick={() => canProceedToStep2 && setStep(2)}
                      disabled={!canProceedToStep2}
                      className={`flex-1 h-[56px] rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden ${
                        canProceedToStep2
                          ? 'bg-selah-orange text-white shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)] cursor-pointer'
                          : 'bg-selah-dark/[0.03] text-selah-muted/40 cursor-not-allowed'
                      }`}
                    >
                      {canProceedToStep2 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      )}
                      <span className="relative z-10">{t("Next Step", "Siguiente")}</span>
                      <motion.span 
                        className="relative z-10"
                        animate={{ x: canProceedToStep2 ? [0, 3, 0] : 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight size={16} />
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                /* ── STEP 2: EMAIL + SUBMIT ── */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-center mb-6">
                    <motion.h3 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-black font-display text-selah-dark tracking-tight mb-2"
                    >
                      {t("Where to send it?", "¿A dónde lo enviamos?")}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-selah-muted text-[15px]"
                    >
                      {t(
                        `Almost there, ${firstName}! Enter your email.`,
                        `¡Casi listo, ${firstName}! Ingresa tu correo.`
                      )}
                    </motion.p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-5"
                    >
                      <FloatingInput
                        id="email"
                        icon={Mail}
                        value={email}
                        onChange={setEmail}
                        placeholder="you@email.com"
                        type="email"
                        autoFocus
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                      />
                    </motion.div>

                    <motion.div 
                      className="flex gap-3 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                       <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep(1)}
                        className="px-6 h-[56px] rounded-2xl bg-white border border-selah-dark/[0.08] text-selah-dark hover:bg-selah-dark/[0.02] text-[15px] font-bold transition-all"
                      >
                        {t("Back", "Atrás")}
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: !isSubmitting && isValidEmail ? 1.02 : 1, y: !isSubmitting && isValidEmail ? -2 : 0 }}
                        whileTap={{ scale: !isSubmitting && isValidEmail ? 0.97 : 1 }}
                        disabled={isSubmitting || !isValidEmail}
                        className={`flex-1 h-[56px] rounded-2xl font-bold text-[15px] font-display tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 relative overflow-hidden ${
                          isSubmitting || !isValidEmail
                            ? 'bg-selah-dark/[0.03] text-selah-muted/40 cursor-not-allowed'
                            : 'bg-gradient-to-r from-selah-orange to-[#FF7B29] text-white shadow-[0_12px_30px_-8px_rgba(255,92,0,0.4)]'
                        }`}
                      >
                        {/* Shimmer */}
                        {!isSubmitting && isValidEmail && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                        )}
                        {isSubmitting ? (
                          <>
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" 
                            />
                            <span className="relative z-10">{t("Processing...", "Procesando...")}</span>
                          </>
                        ) : (
                          <>
                            <Download size={18} className="relative z-10" />
                            <span className="relative z-10">{t("Download Free", "Descargar Gratis")}</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>

                  {/* Trust row */}
                  <motion.div 
                    className="flex items-center justify-center gap-6 pt-4 border-t border-selah-dark/[0.04]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[
                      { icon: Shield, label: t("Secure", "Seguro") },
                      { icon: Lock, label: t("No Spam", "Sin Spam") },
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-1.5 text-selah-muted/50"
                        whileHover={{ scale: 1.05, color: '#FF5C00' }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <item.icon size={13} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
