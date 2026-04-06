"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';

export interface BlogPost {
  id: number;
  titleEn: string;
  titleEs: string;
  img: string;
  contentEn: string[];
  contentEs: string[];
  dateEn: string;
  dateEs: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
  const { language, t } = useLanguage();
  const [openPost, setOpenPost] = useState<number | null>(null);

  const togglePost = (id: number) => {
    setOpenPost(openPost === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 mb-12 relative z-10 w-full">
      <div className="flex flex-col gap-8">
        {posts.map((post, index) => (
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            key={post.id}
            className="flex flex-col bg-white rounded-3xl border border-selah-dark/5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Minimal Header (Always visible) */}
            <button 
              onClick={() => togglePost(post.id)}
              className="w-full text-left flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8 cursor-pointer focus:outline-none group hover:bg-black/[0.02] transition-colors"
            >
              <div className="relative shrink-0 w-full md:w-48 h-48 md:h-32 bg-[#FFF8EE] rounded-xl overflow-hidden shadow-sm">
                <Image 
                  src={post.img} 
                  alt={language === 'EN' ? post.titleEn : post.titleEs} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-selah-orange ui-caption font-bold tracking-widest uppercase mb-2">
                  <Calendar size={14} />
                  {language === 'EN' ? post.dateEn : post.dateEs}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-selah-dark leading-tight group-hover:text-selah-orange transition-colors">
                  {language === 'EN' ? post.titleEn : post.titleEs}
                </h2>
              </div>

              <div className={`w-12 h-12 rounded-full hidden md:flex items-center justify-center shrink-0 transition-transform duration-500 ${openPost === post.id ? 'bg-selah-orange/10 rotate-180' : 'bg-selah-bg group-hover:bg-white group-hover:shadow-sm'}`}>
                <ChevronDown size={24} className={`transition-colors duration-300 ${openPost === post.id ? 'text-selah-orange' : 'text-selah-muted group-hover:text-selah-dark'}`} />
              </div>
            </button>

            {/* Accordion Content */}
            <AnimatePresence>
              {openPost === post.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-8 pt-4 border-t border-black/5 mt-2">
                    
                    {/* Full uncropped image visible when expanded */}
                    <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-8 bg-[#FFF8EE] shadow-sm">
                      <Image 
                        src={post.img} 
                        alt={language === 'EN' ? post.titleEn : post.titleEs} 
                        fill 
                        className="object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-4 text-selah-dark/80 text-lg leading-relaxed max-w-3xl mx-auto">
                      {(language === 'EN' ? post.contentEn : post.contentEs).map((paragraph, i) => (
                        <p key={i} className="font-medium" dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ))}
                    </div>
                    {/* Extra toggle button at the bottom for convenience */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); togglePost(post.id); }}
                      className="mt-8 text-selah-orange font-bold ui-button hover:text-selah-dark transition-colors flex items-center gap-2"
                    >
                      {t("Read Less", "Leer Menos")}
                      <ChevronDown size={16} className="rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
