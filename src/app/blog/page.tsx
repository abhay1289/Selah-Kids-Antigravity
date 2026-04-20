'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogHero } from '../../components/blog/BlogHero';
import { BlogCategories } from '../../components/blog/BlogCategories';
import { BlogGrid } from '../../components/blog/BlogGrid';
import { BLOG_POSTS } from '../../data/blogPosts';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BlogPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('All Articles', 'Todos los Artículos') },
    { id: 'faith', label: t('Faith', 'Fe') },
    { id: 'family', label: t('Family', 'Familia') },
    { id: 'worship', label: t('Worship', 'Adoración') },
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 right-0 w-[55vw] h-[45vh] bg-gradient-to-bl from-[#FF7F50]/10 via-[#FF5C00]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[45vh] bg-gradient-to-tr from-[#93D35C]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[5%] w-[40vw] h-[35vh] bg-[#FEB835]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[30vh] bg-[#00BFFF]/6 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <BlogHero />
      </motion.div>

      <BlogCategories
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
        <BlogGrid posts={BLOG_POSTS} />
      </motion.div>
    </div>
  );
}
