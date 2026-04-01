'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clapperboard, Music, Smartphone, Mic, ChevronDown } from 'lucide-react';
import { BlogHero } from '../../components/blog/BlogHero';
import { BlogCategories } from '../../components/blog/BlogCategories';
import { BlogGrid } from '../../components/blog/BlogGrid';

const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Posts' },
  { id: 'parenting', label: 'Parenting' },
  { id: 'bts', label: 'Behind the Scenes' },
  { id: 'faith', label: 'Faith & Learning' },
  { id: 'devotional', label: 'Devotional' }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "5 Ways to Make Family Worship Engaging",
    excerpt: "Discover simple, engaging ways to bring worship into your home without it feeling like a chore.",
    category: "parenting",
    categoryLabel: "Parenting",
    date: "March 18, 2026",
    iconLarge: Users,
    gradient: "from-[#FF7F50] to-[#FF5C00]"
  },
  {
    id: 2,
    title: "Behind the Scenes: Creating The Good News",
    excerpt: "Take a peek into our animation studio and see how Andy, Libni, and Shiloh come to life.",
    category: "bts",
    categoryLabel: "Behind the Scenes",
    date: "March 10, 2026",
    iconLarge: Clapperboard,
    gradient: "from-[#00BFFF] to-[#87CEEB]"
  },
  {
    id: 3,
    title: "Why Kids Need Worship Music",
    excerpt: "The developmental and spiritual benefits of exposing young children to faith-based songs.",
    category: "faith",
    categoryLabel: "Faith & Learning",
    date: "March 2, 2026",
    iconLarge: Music,
    gradient: "from-[#FFD700] to-[#FEB835]"
  },
  {
    id: 4,
    title: "A Parent's Guide to Screen Time & Faith",
    excerpt: "How to navigate the digital age while keeping your family grounded in biblical principles.",
    category: "parenting",
    categoryLabel: "Parenting",
    date: "February 25, 2026",
    iconLarge: Smartphone,
    gradient: "from-[#98FF98] to-[#93D35C]"
  },
  {
    id: 5,
    title: "Meet the Voices Behind Andy & Libni",
    excerpt: "An interview with the talented voice actors who bring our favorite characters to life.",
    category: "bts",
    categoryLabel: "Behind the Scenes",
    date: "February 18, 2026",
    iconLarge: Mic,
    gradient: "from-[#E6E6FA] to-[#D8BFD8]"
  },
  {
    id: 6,
    title: "Teaching Kids About the Gospel",
    excerpt: "A simple, age-appropriate devotional guide for explaining the good news of Jesus to toddlers.",
    category: "devotional",
    categoryLabel: "Devotional",
    date: "February 10, 2026",
    iconLarge: BookOpen,
    gradient: "from-[#FFB6C1] to-[#FF69B4]"
  }
];

const POSTS_PER_PAGE = 2;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = BLOG_POSTS.filter(post => 
    activeCategory === 'all' || post.category === activeCategory
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + POSTS_PER_PAGE);
  };

  // Reset visible count when category changes
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(POSTS_PER_PAGE);
  };

  return (
    <div className="bg-gradient-to-b from-[#FFF8EE] via-[#FDFBF7] to-[#F5FBF0] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
      {/* Editorial Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FFF0E0] to-transparent pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <BlogHero />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
        <BlogCategories categories={BLOG_CATEGORIES} activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <BlogGrid posts={visiblePosts} activeCategory={activeCategory} />
      </motion.div>

      {/* Load More Button — centered and functional */}
      {hasMore && (
        <div className="flex justify-center px-6 pb-8 relative z-10">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-10 py-4 rounded-full text-selah-orange border border-selah-orange/20 bg-transparent hover:bg-selah-orange hover:text-white ui-button uppercase transition-all duration-500 hover:shadow-xl hover:shadow-selah-orange/20"
          >
            Load More Posts
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
