import React from 'react';
import { Badge } from '../UI';

export const ResourcesHero = () => {
  return (
    <section className="text-center px-6 mb-16 relative z-10">
      <Badge color="orange" className="mb-6 shadow-md">FREE DOWNLOADS</Badge>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-selah-dark mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        Resources for Families
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl text-selah-muted font-sans font-medium max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        Download lyrics, coloring pages, and guides to help your kids learn and grow in faith.
      </p>
    </section>
  );
};
