'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogHero } from '../../components/blog/BlogHero';
import { BlogGrid } from '../../components/blog/BlogGrid';
import { BLOG_POSTS } from '../../data/blogPosts';

export default function BlogPage() {
  return (
    <div className="bg-gradient-to-b from-[#FFF8EE] via-[#FDFBF7] to-[#F5FBF0] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
      {/* Editorial Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FFF0E0] to-transparent pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <BlogHero />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
        <BlogGrid posts={BLOG_POSTS} />
      </motion.div>
    </div>
  );
}
