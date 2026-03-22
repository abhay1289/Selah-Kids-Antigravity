import React from 'react';
import { Badge } from '../UI';

export const ResourcesHero = () => {
  return (
    <section className="text-center px-6 mb-20 relative z-10">
      <Badge color="orange" className="mb-6 shadow-md">FREE DOWNLOADS</Badge>
      <h1 className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        Resources for Families
      </h1>
      <p className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        Download lyrics, coloring pages, and guides to help your kids learn and grow in faith.
      </p>
    </section>
  );
};
