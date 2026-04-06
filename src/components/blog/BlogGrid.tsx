"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
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
  const { language } = useLanguage();
  return (
    <section className="max-w-4xl mx-auto px-6 mb-12 relative z-10 w-full">
      <div className="flex flex-col gap-16">
        {posts.map((post, index) => (
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            key={post.id}
            className="flex flex-col bg-white rounded-[3rem] border border-selah-dark/5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Banner Image */}
            <div className={`relative w-full h-64 md:h-[400px] bg-[#FFF8EE]`}>
              <Image 
                src={post.img} 
                alt={language === 'EN' ? post.titleEn : post.titleEs} 
                fill 
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col p-8 md:p-14">
              <div className="flex items-center gap-2 text-selah-orange ui-caption font-bold tracking-widest uppercase mb-4">
                <Calendar size={14} />
                {language === 'EN' ? post.dateEn : post.dateEs}
              </div>
              
              <h2 className="text-3xl md:text-5xl font-display font-black text-selah-dark mb-8 leading-tight">
                {language === 'EN' ? post.titleEn : post.titleEs}
              </h2>
              
              <div className="flex flex-col gap-5 text-selah-dark/80 text-lg md:text-xl leading-relaxed">
                {(language === 'EN' ? post.contentEn : post.contentEs).map((paragraph, i) => (
                  <p key={i} className="font-medium" dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
