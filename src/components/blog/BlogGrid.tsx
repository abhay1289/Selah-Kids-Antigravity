import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <section className="max-w-[1400px] mx-auto px-6 mb-32 relative z-10">
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={post.id}
              className={`group cursor-pointer flex flex-col ${index === 0 && activeCategory === 'all' ? 'md:col-span-2 lg:col-span-3 lg:flex-row gap-12 items-center mb-12' : ''}`}
            >
              {/* Thumbnail Area */}
              <div className={`relative ${index === 0 && activeCategory === 'all' ? 'w-full lg:w-3/5 h-[400px] lg:h-[600px]' : 'w-full h-80'} rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-90 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center text-white"
                >
                  <post.iconLarge size={index === 0 && activeCategory === 'all' ? 140 : 80} className="drop-shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
                
                {/* Category Badge overlay */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-xl rounded-full text-xs font-bold text-selah-dark font-sans tracking-widest uppercase shadow-lg">
                    {post.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className={`flex flex-col flex-grow ${index === 0 && activeCategory === 'all' ? 'w-full lg:w-2/5 py-8' : 'pt-8'}`}>
                <div className="flex items-center gap-3 text-selah-muted text-sm font-sans font-semibold tracking-widest uppercase mb-6">
                  <Calendar size={16} />
                  {post.date}
                </div>
                
                <h3 className={`${index === 0 && activeCategory === 'all' ? 'text-5xl lg:text-7xl' : 'text-3xl'} font-display text-selah-dark mb-6 leading-[1.1] group-hover:text-selah-orange transition-colors duration-300`}>
                  {post.title}
                </h3>
                
                <p className={`${index === 0 && activeCategory === 'all' ? 'text-2xl' : 'text-xl'} text-selah-muted font-serif italic mb-10 flex-grow leading-relaxed line-clamp-3`}>
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-3 text-selah-dark font-sans font-bold text-sm tracking-widest uppercase group-hover:text-selah-orange transition-colors duration-300">
                  <span className="relative overflow-hidden">
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">Read Article</span>
                    <span className="inline-block absolute left-0 top-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">Read Article</span>
                  </span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
