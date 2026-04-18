"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, CheckCircle2, Lock, Sparkles, ArrowRight, Download, Heart } from 'lucide-react';
import { Button } from '../UI';
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
  const [step, setStep] = useState(1); // Multi-step guidance

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
      setStep(1);
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
      }, 2000);
    }, 1800);
  };

  const canProceedToStep2 = firstName.trim().length > 0 && lastName.trim().length > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-selah-dark/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden z-10"
        >
          {/* Header with animated gradient */}
          <div className="relative h-44 bg-gradient-to-br from-selah-orange via-[#FF7F50] to-selah-yellow flex items-end p-8 overflow-hidden">
            {/* Animated orbs */}
            <motion.div 
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" 
            />
            <motion.div 
              animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" 
            />
            
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl text-white transition-all duration-300 hover:rotate-90"
            >
              <X size={18} />
            </button>

            {/* Header content */}
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <Download size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-0.5">
                    {t("Free Download", "Descarga Gratuita")}
                  </p>
                  <p className="text-white font-bold text-base truncate font-display">
                    {resourceTitle}
                  </p>
                </div>
              </div>
              
              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <motion.div 
                      animate={{ scale: step === s ? 1.1 : 1 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        step > s 
                          ? 'bg-white text-selah-orange' 
                          : step === s 
                          ? 'bg-white text-selah-orange shadow-lg shadow-white/30' 
                          : 'bg-white/20 text-white/60'
                      }`}
                    >
                      {step > s ? <CheckCircle2 size={14} /> : s}
                    </motion.div>
                    <span className={`text-xs font-semibold hidden sm:inline ${step >= s ? 'text-white' : 'text-white/40'}`}>
                      {s === 1 ? t("Your Info", "Tu Info") : t("Email", "Correo")}
                    </span>
                    {s < 2 && <div className={`w-8 h-0.5 rounded-full transition-colors duration-500 ${step > 1 ? 'bg-white' : 'bg-white/20'}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-7 md:p-8">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Guidance text */}
                        <div className="flex items-start gap-3 p-4 bg-selah-orange/5 border border-selah-orange/10 rounded-2xl mb-6">
                          <Sparkles size={18} className="text-selah-orange mt-0.5 flex-shrink-0" />
                          <p className="text-selah-dark/70 text-sm leading-relaxed">
                            {t(
                              "Join 1,000+ families! Enter your name to unlock this free resource. You'll only need to do this once.",
                              "¡Únete a más de 1,000 familias! Ingresa tu nombre para desbloquear este recurso gratuito. Solo tendrás que hacerlo una vez."
                            )}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-selah-dark/80 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                              <User size={12} className="text-selah-orange" />
                              {t("First Name", "Nombre")}
                            </label>
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-selah-orange/10 flex items-center justify-center group-focus-within:bg-selah-orange/20 transition-colors">
                                <User size={16} className="text-selah-orange" />
                              </div>
                              <input 
                                required
                                autoFocus
                                type="text" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-selah-bg/50 border-2 border-selah-dark/[0.06] focus:border-selah-orange/40 focus:ring-4 focus:ring-selah-orange/10 focus:bg-white transition-all outline-none text-selah-dark placeholder:text-selah-muted/40 text-sm font-medium"
                                placeholder={t("e.g. Sarah", "ej. María")}
                              />
                              {firstName && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 size={18} className="text-green-500" />
                                </motion.div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-selah-dark/80 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                              <User size={12} className="text-selah-orange" />
                              {t("Last Name", "Apellido")}
                            </label>
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-selah-orange/10 flex items-center justify-center group-focus-within:bg-selah-orange/20 transition-colors">
                                <User size={16} className="text-selah-orange" />
                              </div>
                              <input 
                                required
                                type="text" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-selah-bg/50 border-2 border-selah-dark/[0.06] focus:border-selah-orange/40 focus:ring-4 focus:ring-selah-orange/10 focus:bg-white transition-all outline-none text-selah-dark placeholder:text-selah-muted/40 text-sm font-medium"
                                placeholder={t("e.g. Johnson", "ej. García")}
                              />
                              {lastName && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 size={18} className="text-green-500" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button 
                          type="button"
                          variant="primary" 
                          className="w-full mt-6 py-4 !rounded-2xl"
                          disabled={!canProceedToStep2}
                          onClick={() => setStep(2)}
                        >
                          <span className="flex items-center gap-2">
                            {t("Continue", "Continuar")}
                            <ArrowRight size={18} />
                          </span>
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Personalized greeting */}
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl mb-6">
                          <Heart size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-selah-dark/70 text-sm leading-relaxed">
                            {t(
                              `Almost there, ${firstName}! Just add your email to join our family and start your download.`,
                              `¡Casi listo, ${firstName}! Solo agrega tu correo para unirte a nuestra familia e iniciar tu descarga.`
                            )}
                          </p>
                        </div>

                        <div className="space-y-2 mb-2">
                          <label className="text-xs font-bold text-selah-dark/80 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                            <Mail size={12} className="text-selah-orange" />
                            {t("Email Address", "Correo Electrónico")}
                          </label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-selah-orange/10 flex items-center justify-center group-focus-within:bg-selah-orange/20 transition-colors">
                              <Mail size={16} className="text-selah-orange" />
                            </div>
                            <input 
                              required
                              autoFocus
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-selah-bg/50 border-2 border-selah-dark/[0.06] focus:border-selah-orange/40 focus:ring-4 focus:ring-selah-orange/10 focus:bg-white transition-all outline-none text-selah-dark placeholder:text-selah-muted/40 text-sm font-medium"
                              placeholder="hello@example.com"
                            />
                            {email.includes('@') && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                                <CheckCircle2 size={18} className="text-green-500" />
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Back link */}
                        <button 
                          type="button" 
                          onClick={() => setStep(1)} 
                          className="text-selah-muted text-xs hover:text-selah-orange transition-colors mb-5 flex items-center gap-1 mt-2"
                        >
                          <ArrowRight size={12} className="rotate-180" />
                          {t("Back to edit name", "Volver a editar nombre")}
                        </button>

                        <Button 
                          type="submit" 
                          variant="primary" 
                          className="w-full py-4 !rounded-2xl"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{t("Subscribing...", "Suscribiendo...")}</span>
                            </div>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Download size={18} />
                              {t("Subscribe & Download", "Suscribirse y Descargar")}
                            </span>
                          )}
                        </Button>

                        {/* Trust indicators */}
                        <div className="flex items-center justify-center gap-4 mt-5">
                          <div className="flex items-center gap-1.5 text-selah-muted/50">
                            <Lock size={11} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">{t("Secure", "Seguro")}</span>
                          </div>
                          <div className="w-px h-3 bg-selah-dark/10" />
                          <div className="flex items-center gap-1.5 text-selah-muted/50">
                            <Mail size={11} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">{t("No Spam", "Sin Spam")}</span>
                          </div>
                          <div className="w-px h-3 bg-selah-dark/10" />
                          <div className="flex items-center gap-1.5 text-selah-muted/50">
                            <Heart size={11} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">{t("Free", "Gratis")}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="py-10 text-center flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <motion.h4 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-selah-dark mb-2 font-display"
                  >
                    {t(`Welcome, ${firstName}!`, `¡Bienvenido/a, ${firstName}!`)}
                  </motion.h4>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-selah-muted text-sm mb-4"
                  >
                    {t("Your download is starting now...", "Tu descarga comenzará ahora...")}
                  </motion.p>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-1.5 bg-gradient-to-r from-selah-orange to-selah-yellow rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
