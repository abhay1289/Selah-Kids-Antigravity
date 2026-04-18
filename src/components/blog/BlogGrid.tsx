"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import type { BlogPost } from '../../data/blogPosts';

interface BlogGridProps {
  posts: BlogPost[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
  const { language, t } = useLanguage();

  return (
    <section className="max-w-5xl mx-auto px-6 mb-12 relative z-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <motion.article
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            key={post.id}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-3 border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_-20px_rgba(255,92,0,0.15)] transition-all duration-700 overflow-hidden"
            >
              {/* ─── Image Island Container ─── */}
              <div className="relative w-full aspect-[16/11] rounded-[2rem] overflow-hidden flex-shrink-0 shadow-inner">
                {/* Fallback & Loading Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5EE] to-[#FFF0E0] opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                
                {/* Inner Shadow for Depth */}
                <div className="absolute inset-0 shadow-[inset_0_4px_30px_rgba(0,0,0,0.06)] pointer-events-none z-[2]" />

                {/* The Image */}
                <motion.div
                  className="absolute inset-0 z-[3]"
                >
                  <Image
                    src={post.img}
                    alt={language === 'EN' ? post.titleEn : post.titleEs}
                    fill
                    className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>

                {/* Sleek Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-selah-dark/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[4] flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, y: 10 }}
                    whileHover={{ scale: 1, y: 0 }}
                    className="px-6 py-3 bg-white/95 backdrop-blur-xl rounded-full shadow-[0_16px_40px_-8px_rgba(0,0,0,0.3)] text-selah-dark font-bold text-[13px] font-display tracking-tight flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                  >
                    {t("Read Article", "Leer Artículo")}
                    <ArrowUpRight size={15} className="text-selah-orange" strokeWidth={2.5} />
                  </motion.div>
                </div>
              </div>

              {/* ─── Clean Content Section ─── */}
              <div className="relative z-10 px-5 pt-6 pb-4 flex flex-col flex-grow">
                
                <div className="flex-grow">
                  {/* Category / Date Pill */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-selah-orange/[0.08] text-selah-orange rounded border border-selah-orange/10 text-[10px] uppercase font-black tracking-[0.15em] shrink-0">
                      <Calendar size={11} strokeWidth={2.5} />
                      {language === 'EN' ? post.dateEn : post.dateEs}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-[24px] font-display font-black text-selah-dark leading-snug tracking-tight group-hover:text-selah-orange transition-colors duration-400 mb-3 line-clamp-3 pr-2">
                    {language === 'EN' ? post.titleEn : post.titleEs}
                  </h2>
                </div>

                {/* Read More Bottom Row */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-selah-dark/[0.04]">
                  <span className="flex items-center gap-1.5 text-selah-dark/60 font-bold text-[14px] font-display tracking-tight group-hover:text-selah-orange transition-colors duration-300">
                    {t("Read Article", "Leer Artículo")}
                  </span>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-selah-dark/[0.03] group-hover:bg-selah-orange text-selah-dark/40 group-hover:text-white transition-all duration-500 transform group-hover:rotate-4">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
