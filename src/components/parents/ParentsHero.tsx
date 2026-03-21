import React from 'react';
import { Shield, Heart, BookOpen, Smile } from 'lucide-react';
import { Badge } from '../UI';

export const ParentsHero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 text-left">
          <Badge color="yellow" className="mb-6 shadow-sm">PEACE OF MIND</Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-selah-dark mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
            Built for Kids.<br/>
            <span className="text-selah-muted">Trusted by Parents.</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-selah-muted font-sans font-medium max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
            We created Selah Kids because we're parents too. We know how hard it is to find high-quality, safe, and faith-filled media for little ones.
          </p>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-selah-yellow/20 to-selah-orange/20 rounded-[3rem] blur-3xl transform -rotate-6 scale-105" />
          <div className="relative bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5 transform rotate-3 hover:rotate-0 transition-transform duration-700">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-selah-blue/10 rounded-3xl p-6 aspect-square flex items-center justify-center">
                  <Shield size={48} className="text-selah-blue" />
                </div>
                <div className="bg-selah-pink/10 rounded-3xl p-6 aspect-square flex items-center justify-center">
                  <Heart size={48} className="text-selah-pink" />
                </div>
              </div>
              <div className="space-y-6 mt-12">
                <div className="bg-selah-yellow/10 rounded-3xl p-6 aspect-square flex items-center justify-center">
                  <BookOpen size={48} className="text-selah-yellow" />
                </div>
                <div className="bg-[#98FF98]/20 rounded-3xl p-6 aspect-square flex items-center justify-center">
                  <Smile size={48} className="text-[#93D35C]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
