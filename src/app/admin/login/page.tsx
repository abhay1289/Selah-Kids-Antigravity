'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signIn } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e7] via-[#e8f5d8] to-[#fff9f0] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-gradient-to-bl from-[#ff5c00]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gradient-to-tr from-[#93d35c]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vh] bg-[#feb835]/8 rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white/60">
          <div className="bg-gradient-to-b from-[#FDFCF8] to-white rounded-[2rem] p-8 md:p-10 border border-black/[0.03]">
            
            {/* Logo */}
            <motion.div
              className="flex flex-col items-center mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#ff5c00] to-[#feb835] flex items-center justify-center shadow-xl shadow-[#ff5c00]/20 mb-4"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="text-white" size={28} />
              </motion.div>
              <h1
                className="text-2xl font-bold text-[#3a6b44] tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), "Fredoka", sans-serif' }}
              >
                Selah Kids
              </h1>
              <p className="text-[13px] text-[#5a7d62]/60 font-medium mt-1">Content Dashboard</p>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-[13px] font-medium"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#5a7d62]/30 group-focus-within:text-[#ff5c00] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] pl-12 pr-4 rounded-2xl bg-[#3a6b44]/[0.03] border-2 border-transparent focus:border-[#ff5c00]/25 focus:bg-white text-[#3a6b44] text-[14px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.05)] placeholder:text-[#5a7d62]/30"
                  style={{ fontFamily: 'var(--font-quicksand), "Quicksand", sans-serif' }}
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#5a7d62]/30 group-focus-within:text-[#ff5c00] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] pl-12 pr-12 rounded-2xl bg-[#3a6b44]/[0.03] border-2 border-transparent focus:border-[#ff5c00]/25 focus:bg-white text-[#3a6b44] text-[14px] font-medium transition-all outline-none focus:shadow-[0_0_0_4px_rgba(255,92,0,0.05)] placeholder:text-[#5a7d62]/30"
                  style={{ fontFamily: 'var(--font-quicksand), "Quicksand", sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5a7d62]/30 hover:text-[#3a6b44] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full h-[52px] bg-gradient-to-r from-[#ff5c00] to-[#FF7B29] text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-xl shadow-[#ff5c00]/20 hover:shadow-2xl hover:shadow-[#ff5c00]/30 transition-all mt-6 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{ fontFamily: 'var(--font-fredoka), "Fredoka", sans-serif' }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full relative z-10"
                    />
                    <span className="relative z-10">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
                    <ArrowRight size={18} className="relative z-10" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#5a7d62]/40 mt-6 font-medium">
          Powered by Engaze Digital
        </p>
      </motion.div>
    </div>
  );
}
