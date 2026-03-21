import React, { useState } from 'react';
import { BookOpen, Users, Clapperboard, Music, Smartphone, Mic } from 'lucide-react';
import { Button } from '../components/UI';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogCategories } from '../components/blog/BlogCategories';
import { BlogGrid } from '../components/blog/BlogGrid';

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
    title: "5 Ways to Make Family Worship Fun",
    excerpt: "Discover simple, engaging ways to bring worship into your home without it feeling like a chore.",
    category: "parenting",
    categoryLabel: "Parenting",
    date: "March 18, 2026",
    iconLarge: Users,
    gradient: "from-[#FF7F50] to-[#FF5C00]" // Coral
  },
  {
    id: 2,
    title: "Behind the Scenes: Creating The Good News",
    excerpt: "Take a peek into our animation studio and see how Andy, Libni, and Shiloh come to life.",
    category: "bts",
    categoryLabel: "Behind the Scenes",
    date: "March 10, 2026",
    iconLarge: Clapperboard,
    gradient: "from-[#00BFFF] to-[#87CEEB]" // Sky Blue
  },
  {
    id: 3,
    title: "Why Kids Need Worship Music",
    excerpt: "The developmental and spiritual benefits of exposing young children to faith-based songs.",
    category: "faith",
    categoryLabel: "Faith & Learning",
    date: "March 2, 2026",
    iconLarge: Music,
    gradient: "from-[#FFD700] to-[#FEB835]" // Gold
  },
  {
    id: 4,
    title: "A Parent's Guide to Screen Time & Faith",
    excerpt: "How to navigate the digital age while keeping your family grounded in biblical principles.",
    category: "parenting",
    categoryLabel: "Parenting",
    date: "February 25, 2026",
    iconLarge: Smartphone,
    gradient: "from-[#98FF98] to-[#93D35C]" // Mint
  },
  {
    id: 5,
    title: "Meet the Voices Behind Andy & Libni",
    excerpt: "An interview with the talented voice actors who bring our favorite characters to life.",
    category: "bts",
    categoryLabel: "Behind the Scenes",
    date: "February 18, 2026",
    iconLarge: Mic,
    gradient: "from-[#E6E6FA] to-[#D8BFD8]" // Lavender
  },
  {
    id: 6,
    title: "Teaching Kids About the Gospel",
    excerpt: "A simple, age-appropriate devotional guide for explaining the good news of Jesus to toddlers.",
    category: "devotional",
    categoryLabel: "Devotional",
    date: "February 10, 2026",
    iconLarge: BookOpen,
    gradient: "from-[#FFB6C1] to-[#FF69B4]" // Pink
  }
];

export const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = BLOG_POSTS.filter(post => 
    activeCategory === 'all' || post.category === activeCategory
  );

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Editorial Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#F3EFE6] to-transparent pointer-events-none" />

      <BlogHero />
      <BlogCategories categories={BLOG_CATEGORIES} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <BlogGrid posts={filteredPosts} activeCategory={activeCategory} />

      {/* Load More */}
      <div className="text-center px-6 relative z-10">
        <Button className="!bg-transparent hover:!bg-selah-dark !text-selah-dark hover:!text-white border border-selah-dark/20 shadow-none hover:shadow-xl px-16 py-5 text-lg font-sans tracking-widest uppercase transition-all duration-500">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};
