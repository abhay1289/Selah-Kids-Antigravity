"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            key={post.id}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-[2.5rem] border border-selah-dark/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              {/* Blog Image */}
              <div className="relative w-full aspect-[16/10] bg-[#FFF8EE] overflow-hidden">
                <Image
                  src={post.img}
                  alt={language === 'EN' ? post.titleEn : post.titleEs}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                {/* Date */}
                <div className="flex items-center gap-2 text-selah-orange ui-caption font-bold tracking-widest uppercase mb-4">
                  <Calendar size={14} />
                  {language === 'EN' ? post.dateEn : post.dateEs}
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-display font-black text-selah-dark leading-tight group-hover:text-selah-orange transition-colors duration-300 mb-6">
                  {language === 'EN' ? post.titleEn : post.titleEs}
                </h2>

                {/* Read More */}
                <div className="mt-auto flex items-center gap-2 text-selah-orange ui-button group-hover:gap-4 transition-all duration-300">
                  {t("Read Article", "Leer Artículo")}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
