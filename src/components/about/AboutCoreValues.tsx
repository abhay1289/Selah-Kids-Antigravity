"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Smile, BookOpen, Globe } from 'lucide-react';
import { Badge } from '../UI';
import { staggerContainer, zoomInUp } from '../../utils/animations';

const CORE_VALUES = [
  {
    icon: Heart,
    title: "All About Jesus",
    desc: "Jesus is at the center of every story, teaching kids about God's love and grace through fun faith-based videos.",
    color: "bg-selah-orange",
  },
  {
    icon: Smile,
    title: "Made for Kids",
    desc: "Our Christian cartoons are safe, engaging, and perfect for children to watch, learn, and enjoy.",
    color: "bg-selah-yellow",
  },
  {
    icon: BookOpen,
    title: "True to the Bible",
    desc: "Every song and story is carefully checked to make sure it teaches true and helpful biblical lessons.",
    color: "bg-selah-light",
  },
  {
    icon: Globe,
    title: "For Everyone",
    desc: "We celebrate the beautiful diversity of God's entire creation in all our kids worship videos.",
    color: "bg-[#FF7F50]",
  }
];

export const AboutCoreValues = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-28 relative z-10">
      <div className="text-center mb-20">
        <Badge color="yellow" className="mb-6">OUR VALUES</Badge>
        <h2 className="content-h2 leading-[1.1] tracking-tight">
          What Guides Us
        </h2>
      </div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {CORE_VALUES.map((value, i) => (
          <motion.div
            key={i}
            variants={zoomInUp}
            className="bg-white/80 backdrop-blur-lg rounded-[3rem] p-10 border border-white/80 shadow-sm flex flex-col items-start group hover:bg-selah-orange transition-colors duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity duration-500" />
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 ${value.color} text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out relative z-10 shadow-lg`}>
              <value.icon size={36} strokeWidth={1.5} />
            </div>
            <h3 className="content-h3-playful mb-4 leading-none group-hover:text-white transition-colors duration-500 relative z-10">{value.title}</h3>
            <p className="body-text leading-relaxed group-hover:text-white/70 transition-colors duration-500 relative z-10">
              {value.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
