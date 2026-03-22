"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string;
  categoryLabel: string;
  language: string;
  gradient: string;
  img: string;
}

interface WatchGridProps {
  filteredVideos: Video[];
}

export const WatchGrid = ({ filteredVideos }: WatchGridProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-20 md:mb-28 relative z-10">
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              key={video.id}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient} opacity-80 mix-blend-multiply z-10`} />
                <img src={video.img} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 shimmer-effect" />
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-500">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out">
                    <Play className="text-selah-dark ml-1" size={24} fill="currentColor" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 z-30">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full ui-label text-selah-dark">
                    {video.language}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 z-30">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full ui-label text-white">
                    {video.categoryLabel}
                  </span>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col mt-2">
                <h3 className="content-h3 text-selah-dark mb-3 group-hover:text-selah-orange transition-colors drop-shadow-sm">
                  {video.title}
                </h3>
                <div className="ui-label text-selah-muted/60 mb-4">
                  {video.date}
                </div>
                <p className="text-selah-muted body-text line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
