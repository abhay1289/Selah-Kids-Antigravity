import React from 'react';
import { motion } from 'motion/react';
import { Heart, Smile, BookOpen, Globe } from 'lucide-react';
import { Badge } from '../UI';

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
    <section className="max-w-[1400px] mx-auto px-6 py-20 relative z-10">
      <div className="text-center mb-20">
        <Badge color="yellow" className="mb-6">OUR VALUES</Badge>
        <h2 className="text-5xl md:text-6xl font-display text-selah-dark leading-[1.1] tracking-tight">
          What Guides Us
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CORE_VALUES.map((value, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/80 backdrop-blur-lg rounded-[3rem] p-10 border border-white/80 shadow-sm flex flex-col items-start group hover:bg-selah-dark transition-colors duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity duration-500" />
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 ${value.color} text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out relative z-10 shadow-lg`}>
              <value.icon size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-display text-selah-dark mb-4 leading-none group-hover:text-white transition-colors duration-500 relative z-10">{value.title}</h3>
            <p className="text-lg text-selah-muted font-sans font-medium leading-relaxed group-hover:text-white/70 transition-colors duration-500 relative z-10">
              {value.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
