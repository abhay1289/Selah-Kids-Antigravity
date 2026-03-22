'use client';

import React, { useState } from 'react';
import { WatchHero } from '../../components/watch/WatchHero';
import { WatchCategories } from '../../components/watch/WatchCategories';
import { WatchGrid } from '../../components/watch/WatchGrid';
import { WatchCTA } from '../../components/watch/WatchCTA';

const VIDEOS = [
  {
    id: 1,
    title: "Jesus Loves Me",
    date: "March 15, 2026",
    description: "A fun, upbeat version of the classic hymn that kids will love to sing along to.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]", // Coral
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 2,
    title: "Jesús Me Ama",
    date: "March 12, 2026",
    description: "The Spanish version of our beloved 'Jesus Loves Me' music video.",
    category: "music",
    categoryLabel: "Music Video",
    language: "ES",
    gradient: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    img: "/TGN_SingleFrames+28329.jpg"
  },
  {
    id: 3,
    title: "The Fruit of the Spirit",
    date: "March 10, 2026",
    description: "Learn about love, joy, peace, and more in this catchy song based on Galatians 5:22-23.",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#FFD700] to-[#FEB835]", // Gold
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 4,
    title: "Calm & Peaceful Garden",
    date: "March 8, 2026",
    description: "A relaxing sensory video featuring soft music and gentle animations for quiet time.",
    category: "sensory",
    categoryLabel: "Sensory",
    language: "EN",
    gradient: "from-[#98FF98] to-[#93D35C]", // Mint
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 5,
    title: "He's Got the Whole World",
    date: "March 5, 2026",
    description: "A beautiful reminder of God's care for all of creation in this classic worship song.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]", // Coral
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 6,
    title: "This Little Light of Mine",
    date: "March 1, 2026",
    description: "Encouraging children to let their light shine for Jesus every day through music.",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#FFD700] to-[#FEB835]", // Gold
    img: "/TGN_SingleFrames+28329.jpg"
  }
];

export default function WatchPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredVideos = VIDEOS.filter(video => 
    activeCategory === 'all' || video.category === activeCategory
  );

  return (
    <div className="bg-gradient-to-b from-selah-bg via-white to-selah-light/10 min-h-screen pt-36 md:pt-44 pb-20 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-selah-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-selah-yellow/10 rounded-full blur-[100px] pointer-events-none" />

      <WatchHero />
      
      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-selah-bg/90 backdrop-blur-xl py-4 mb-20 border-b border-selah-border/20">
        <WatchCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      <WatchGrid filteredVideos={filteredVideos} />
      <WatchCTA />
    </div>
  );
}
