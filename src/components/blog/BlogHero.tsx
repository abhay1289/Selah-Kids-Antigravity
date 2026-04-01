import React from 'react';
import { Badge } from '../UI';

export const BlogHero = () => {
  return (
    <section className="text-center px-6 mb-12 relative z-10">
      <Badge color="light" className="mb-8 shadow-sm bg-white border border-black/5 font-serif italic tracking-widest">READ & GROW</Badge>
      <h1 className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        The Journal
      </h1>
      <p className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        Articles, devotionals, and behind-the-scenes stories to encourage your family's faith journey.
      </p>
    </section>
  );
};
