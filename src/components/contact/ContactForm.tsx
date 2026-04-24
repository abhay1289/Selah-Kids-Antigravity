"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { slideInLeft } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';
import { track, trackContactSubmit } from '../../lib/analytics';

/**
 * Contact page centerpiece — a real message form on top, with an
 * email-fallback panel below so visitors who prefer raw mailto links
 * still have them.
 *
 * Form posts to /api/contact which validates and logs the submission.
 * Delivery wiring (Resend / Postmark / Notion intake) is a TODO in the
 * route handler — this component is complete on its own.
 */

const INTEREST_OPTIONS: Array<{ value: 'parent' | 'educator' | 'partner' | 'press' | 'other'; en: string; es: string }> = [
  { value: 'parent', en: 'Parent', es: 'Padre/Madre' },
  { value: 'educator', en: 'Educator', es: 'Educador' },
  { value: 'partner', en: 'Partner', es: 'Colaborador' },
  { value: 'press', en: 'Press', es: 'Prensa' },
  { value: 'other', en: 'Other', es: 'Otro' },
];

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export const ContactForm = () => {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [interest, setInterest] = useState<typeof INTEREST_OPTIONS[number]['value']>('parent');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<SubmitState>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const locale: 'en' | 'es' = language === 'ES' ? 'es' : 'en';

  const emailContacts: Array<{ label: string; href: string; email: string }> = [
    {
      label: t('General Inquiries', 'Consultas Generales'),
      href: 'mailto:info.selahkids@gmail.com',
      email: 'info.selahkids@gmail.com',
    },
    {
      label: t('Partnerships & Ministry', 'Colaboración y Ministerio'),
      href: 'mailto:partners@selahkids.com',
      email: 'partners@selahkids.com',
    },
    {
      label: t('Press & Media', 'Prensa y Medios'),
      href: 'mailto:press@selahkids.com',
      email: 'press@selahkids.com',
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'submitting') return;

    // Honeypot read directly from the DOM — if a bot filled it, silently
    // fake success without POSTing. Real users never interact with it.
    const formEl = e.currentTarget;
    const honeypot = (formEl.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
    if (honeypot.length > 0) {
      setState('success');
      return;
    }

    setFieldErrors({});
    setState('submitting');
    trackContactSubmit(interest);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, interest, consent, locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body && typeof body === 'object' && body.errors && typeof body.errors === 'object') {
          setFieldErrors(body.errors as Record<string, string>);
        }
        track('contact_submit_error', { interest });
        setState('error');
        return;
      }
      track('contact_submit_success', { interest });
      setState('success');
    } catch {
      track('contact_submit_error', { interest });
      setState('error');
    }
  }

  const labelClass = 'block text-[13px] font-semibold tracking-[0.02em] text-selah-muted mb-2';
  const inputClass =
    'w-full rounded-xl border border-black/10 bg-white/95 px-4 py-3 text-[15px] text-selah-dark placeholder-selah-muted/50 focus:border-selah-orange focus:outline-none focus:ring-2 focus:ring-selah-orange/25 transition';
  const errorClass = 'mt-1 text-[12px] font-medium text-red-600';

  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="lg:col-span-7 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden"
    >
      <div className="bg-gradient-to-b from-[#FDFBF7] to-white rounded-[2rem] p-6 md:p-10 lg:p-14 border border-black/[0.02] relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-48 h-48 bg-selah-orange/[0.06] rounded-full blur-[60px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -10, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFFF]/[0.04] rounded-full blur-[60px] pointer-events-none"
        />

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="content-h2 mb-8"
          >
            {t('Send a Message', 'Envía un mensaje')}
          </motion.h2>

          {state === 'success' ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-green-600/20 bg-green-50/80 px-5 py-6 text-[15px] text-selah-dark"
            >
              <p className="font-semibold mb-1">
                {t("Thanks — we'll reply within 48h", 'Gracias — responderemos en 48h')}
              </p>
              <p className="text-selah-muted text-[14px]">
                {t(
                  'Check your inbox (and spam folder) for our reply.',
                  'Revisa tu bandeja de entrada (y spam) para nuestra respuesta.',
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Honeypot — invisible to humans, tempting for bots. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="contact-name">
                    {t('Name', 'Nombre')} *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    disabled={state === 'submitting'}
                  />
                  {fieldErrors.name && (
                    <p className={errorClass}>{t('Please enter your name.', 'Por favor ingresa tu nombre.')}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="contact-email">
                    {t('Email', 'Correo')} *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    disabled={state === 'submitting'}
                  />
                  {fieldErrors.email && (
                    <p className={errorClass}>{t('Please enter a valid email.', 'Por favor ingresa un correo válido.')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="contact-subject">
                  {t('Subject', 'Asunto')} *
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                  disabled={state === 'submitting'}
                />
                {fieldErrors.subject && (
                  <p className={errorClass}>{t('Please enter a subject.', 'Por favor ingresa un asunto.')}</p>
                )}
              </div>

              <div>
                <span className={labelClass}>{t("I'm a…", 'Soy…')}</span>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                        interest === opt.value
                          ? 'border-selah-orange bg-selah-orange/10 text-selah-dark'
                          : 'border-black/10 bg-white text-selah-muted hover:border-selah-orange/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={opt.value}
                        checked={interest === opt.value}
                        onChange={() => setInterest(opt.value)}
                        className="sr-only"
                        disabled={state === 'submitting'}
                      />
                      {t(opt.en, opt.es)}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="contact-message">
                  {t('Message', 'Mensaje')} *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClass} resize-y min-h-[120px]`}
                  disabled={state === 'submitting'}
                />
                {fieldErrors.message && (
                  <p className={errorClass}>
                    {t('Please write a little more (10+ characters).', 'Por favor escribe un poco más (10+ caracteres).')}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 text-[13px] text-selah-muted">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-[3px] w-4 h-4 accent-selah-orange"
                  disabled={state === 'submitting'}
                />
                <span>
                  {t(
                    'Yes, send me occasional updates about new songs and episodes.',
                    'Sí, envíame actualizaciones ocasionales sobre nuevas canciones y episodios.',
                  )}
                </span>
              </label>

              {state === 'error' && (
                <div role="alert" aria-live="polite" className="rounded-2xl border border-red-600/20 bg-red-50/80 px-5 py-4 text-[14px] text-red-700">
                  {t(
                    'Something went wrong. Please check the fields above and try again.',
                    'Algo salió mal. Revisa los campos de arriba e inténtalo de nuevo.',
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="inline-flex items-center justify-center rounded-full bg-selah-orange px-7 py-3 text-[14px] font-semibold tracking-[0.02em] text-white shadow-[0_16px_32px_-18px_rgba(255,92,0,0.7)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'submitting'
                  ? t('Sending…', 'Enviando…')
                  : t('Send Message', 'Enviar mensaje')}
              </button>
            </form>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="relative mt-12 rounded-[1.75rem] md:rounded-[2rem] border border-black/5 bg-white/90 p-6 md:p-8 shadow-[0_24px_50px_-22px_rgba(0,0,0,0.16)]"
          >
            <p className="text-[13px] md:text-[14px] font-semibold tracking-[0.02em] text-selah-muted mb-5">
              {t('Prefer email?', '¿Prefieres email?')}
            </p>

            <div className="flex flex-col gap-4">
              {emailContacts.map((contact) => (
                <motion.a
                  key={contact.email}
                  href={contact.href}
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                  className="group rounded-2xl border border-black/[0.06] bg-gradient-to-br from-white to-[#fff7f2] px-5 py-4 hover:border-selah-orange/30 hover:shadow-[0_16px_32px_-22px_rgba(255,92,0,0.5)] transition-all"
                >
                  <p className="text-[13px] md:text-[14px] font-semibold text-selah-muted group-hover:text-selah-dark transition-colors">
                    {contact.label}
                  </p>
                  <p className="text-[15px] md:text-[16px] font-black font-display tracking-tight text-selah-dark group-hover:text-selah-orange break-all transition-colors">
                    {contact.email}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
