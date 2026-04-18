"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, CheckCircle2 } from 'lucide-react';
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Save subscription state so they aren't prompted again
      localStorage.setItem('selah_subscribed', 'true');

      // Trigger the download callback after showing success message
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-selah-dark/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header Graphic */}
          <div className="relative h-32 bg-gradient-to-br from-selah-orange to-selah-yellow flex items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 mix-blend-overlay pointer-events-none" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="relative z-10">
              <Mail className="w-10 h-10 text-white mx-auto mb-2 drop-shadow-sm" />
              <h3 className="text-xl font-bold font-display text-white tracking-tight drop-shadow-sm">
                {t("Unlock Your Download", "Desbloquea tu Descarga")}
              </h3>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <p className="text-selah-muted text-sm mb-6 text-center">
                    {t(
                      `Enter your details to join our mailing list and download "${resourceTitle}". You'll only have to do this once!`,
                      `Ingresa tus datos para unirte a nuestra lista de correo y descargar "${resourceTitle}". ¡Solo tendrás que hacerlo una vez!`
                    )}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-selah-dark uppercase tracking-wider ml-1">
                          {t("First Name", "Nombre")}
                        </label>
                        <div className="relative">
                          <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-selah-muted/60" />
                          <input 
                            required
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-selah-bg border border-selah-dark/10 focus:border-selah-orange focus:ring-2 focus:ring-selah-orange/20 transition-all outline-none text-selah-dark placeholder:text-selah-muted/50"
                            placeholder={t("John", "Juan")}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-selah-dark uppercase tracking-wider ml-1">
                          {t("Last Name", "Apellido")}
                        </label>
                        <div className="relative">
                          <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-selah-muted/60" />
                          <input 
                            required
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-selah-bg border border-selah-dark/10 focus:border-selah-orange focus:ring-2 focus:ring-selah-orange/20 transition-all outline-none text-selah-dark placeholder:text-selah-muted/50"
                            placeholder={t("Doe", "Pérez")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-selah-dark uppercase tracking-wider ml-1">
                        {t("Email Address", "Correo Electrónico")}
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-selah-muted/60" />
                        <input 
                          required
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-selah-bg border border-selah-dark/10 focus:border-selah-orange focus:ring-2 focus:ring-selah-orange/20 transition-all outline-none text-selah-dark placeholder:text-selah-muted/50"
                          placeholder="hello@example.com"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full mt-4 py-3.5 !rounded-xl relative overflow-hidden"
                      style={{ marginTop: '1.5rem' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{t("Subscribing...", "Suscribiendo...")}</span>
                        </div>
                      ) : (
                        <span>{t("Subscribe & Download", "Suscribirse y Descargar")}</span>
                      )}
                    </Button>
                    
                    <p className="text-[11px] text-selah-muted/60 text-center mt-4">
                      {t("By subscribing, you agree to receive updates from Selah Kids. You can unsubscribe at any time.", "Al suscribirse, acepta recibir actualizaciones de Selah Kids. Puede darse de baja en cualquier momento.")}
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                    className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h4 className="text-xl font-bold text-selah-dark mb-2">
                    {t("You're all set!", "¡Todo listo!")}
                  </h4>
                  <p className="text-selah-muted text-sm">
                    {t("Your download is starting now...", "Tu descarga comenzará ahora...")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
