'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageShell } from '@/components/design';
import type { BlogPost } from '@/data/blogPosts';

/**
 * Client half of the blog list route. Receives the posts array as a prop
 * so the parent Server Component owns the data fetch (offline fallback,
 * CMS read, or preview mode).
 */
export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('All Articles', 'Todos los Artículos') },
    { id: 'faith', label: t('Faith', 'Fe') },
    { id: 'family', label: t('Family', 'Familia') },
    { id: 'worship', label: t('Worship', 'Adoración') },
  ];

  const visible = activeCategory === 'all' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <BlogHero />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}>
        <BlogCategories
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
        <BlogGrid posts={visible} />
      </motion.div>
    </PageShell>
  );
}
