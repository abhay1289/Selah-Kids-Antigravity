import React from 'react';
import { Badge } from '../UI';

export const WatchHero = () => {
  return (
    <section className="text-center px-6 mb-16 relative z-10">
      <Badge color="light" className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md">WATCH & LISTEN</Badge>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        Discover Our Videos
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl text-white/70 font-sans font-medium max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos.
      </p>
    </section>
  );
};
