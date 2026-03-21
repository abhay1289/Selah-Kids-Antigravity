import React from 'react';
import { Badge } from '../UI';

export const DonateHero = () => {
  return (
    <section className="text-center px-6 mb-20 relative z-10">
      <Badge color="orange" className="mb-8 shadow-sm bg-white border border-selah-orange/20">MAKE A DIFFERENCE</Badge>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-selah-dark mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        Support<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-selah-orange to-selah-pink">Selah Kids</span>
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl text-selah-muted font-sans font-medium max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.
      </p>
    </section>
  );
};
