"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  date: string;
  iconLarge: any;
  gradient: string;
}

interface BlogGridProps {
  posts: BlogPost[];
  activeCategory: string;
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts, activeCategory }) => {
  return (
    <section className="max-w-3xl mx-auto px-6 mb-12 relative z-10">
      <motion.div layout className="flex flex-col gap-8">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.article
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              key={post.id}
              className="group cursor-pointer flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border border-black/5 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-selah-orange/10 transition-all duration-500"
            >
              {/* Thumbnail */}
              <div className={`relative shrink-0 w-full sm:w-44 h-36 sm:h-36 rounded-xl overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-90`} />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <post.iconLarge size={40} className="drop-shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full ui-label text-selah-dark">
                    {post.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center flex-grow min-w-0 py-1">
                <div className="flex items-center gap-2 text-selah-muted ui-caption tracking-wide mb-2">
                  <Calendar size={12} />
                  {post.date}
                </div>
                
                <h3 className="content-h3 text-selah-dark mb-2 leading-snug group-hover:text-selah-orange transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="body-text !max-w-none leading-relaxed line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-selah-dark ui-label group-hover:text-selah-orange transition-colors duration-300">
                  Read Article
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
