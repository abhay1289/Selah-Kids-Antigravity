'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../components/UI';

const CHARACTERS = [
  {
    id: 'andy',
    name: 'Andy',
    role: 'The Worship Leader',
    bio: "Andy is full of energy and loves to lead his friends in worship! He's always ready with a song and a smile, teaching kids that praising God is the most fun you can have. He plays the guitar and loves to jump around.",
    favorites: ['Playing his acoustic guitar', 'Building epic pillow forts', 'Singing as loud as he can'],
    color: 'orange',
    gradient: 'from-[#FF7F50]/20 to-[#FF5C00]/5',
    blobColor: 'bg-[#FF7F50]',
    image: '/TGN_SingleFrames+28229.jpg',
    imageAlt: 'Andy 3D Character'
  },
  {
    id: 'libni',
    name: 'Libni',
    role: 'The Joyful Dancer',
    bio: "Libni expresses her love for Jesus through movement and dance! She's creative, kind-hearted, and always encourages others to join in. She teaches kids that worship isn't just about singing, but about expressing joy with your whole body.",
    favorites: ['Choreographing new dances', 'Painting colorful pictures', 'Helping her friends'],
    color: 'blue',
    gradient: 'from-[#00BFFF]/20 to-[#87CEEB]/5',
    blobColor: 'bg-[#00BFFF]',
    image: '/TGN_SingleFrames+28329.jpg',
    imageAlt: 'Libni 3D Character'
  },
  {
    id: 'shiloh',
    name: 'Shiloh',
    role: 'The Faithful Friend',
    bio: "Shiloh is Andy's loyal pet sheep. He might not say much, but he's always there to lend a listening ear or a fluffy hug. Shiloh reminds us that God is our Good Shepherd who always watches over us.",
    favorites: ['Eating fresh green grass', 'Taking long naps in the sun', 'Following Andy everywhere'],
    color: 'yellow',
    gradient: 'from-[#FFD700]/20 to-[#FEB835]/5',
    blobColor: 'bg-[#FFD700]',
    image: '/TGN_SingleFrames+28729.jpg',
    imageAlt: 'Shiloh 3D Character'
  }
];

export default function CharactersPage() {
  return (
    <div className="bg-selah-bg min-h-screen pt-36 md:pt-44 pb-0 overflow-hidden">
      {/* Hero Section */}
      <section className="text-center px-6 mb-16 md:mb-20 relative z-10">
        <Badge color="orange" className="mb-6 shadow-md">MEET THE CREW</Badge>
        <h1 className="hero-headline text-selah-dark mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
          Our Characters
        </h1>
        <p className="text-selah-muted body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
          Get to know the friends who make learning about Jesus so much fun!
        </p>
      </section>

      {/* Character Sections */}
      <div className="flex flex-col relative z-20">
        {CHARACTERS.map((char, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={char.id} className={`relative min-h-screen flex items-center py-24 overflow-hidden bg-gradient-to-b ${char.gradient}`}>
              {/* Massive Background Text */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.05, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
              >
                <span className="text-[20vw] hero-headline text-black whitespace-nowrap tracking-tighter leading-none select-none">
                  {char.name.toUpperCase()}
                </span>
              </motion.div>

              <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
                  
                  {/* Image Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -100 : 100, rotateY: isEven ? -15 : 15 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                    className="w-full lg:w-1/2 relative flex justify-center perspective-1000"
                  >
                    {/* Soft Gradient Blob Background */}
                    <div className={`absolute inset-0 ${char.blobColor} opacity-30 blur-[120px] rounded-full scale-150 animate-pulse`} />
                    
                    <motion.div 
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 w-full max-w-[500px] aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-8 border-white/40 transform transition-transform duration-700 hover:scale-105 hover:rotate-2"
                    >
                      <img 
                        src={char.image} 
                        alt={char.imageAlt}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    </motion.div>
                  </motion.div>

                  {/* Text Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 100 : -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                    className="w-full lg:w-1/2 space-y-10"
                  >
                    <div>
                      <Badge color={char.color as any} className="mb-6 shadow-md text-sm px-6 py-2">{char.role}</Badge>
                      <h2 className="hero-headline text-selah-dark tracking-tighter leading-[0.85] drop-shadow-sm">
                        {char.name}
                      </h2>
                    </div>
                    
                    <p className="text-selah-muted body-text leading-relaxed max-w-xl">
                      {char.bio}
                    </p>

                    <motion.div 
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-xl transition-all duration-500 max-w-xl relative overflow-hidden group"
                    >
                      <div className={`absolute inset-0 ${char.blobColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      <h3 className="ui-label text-selah-dark mb-6 flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${char.blobColor} shadow-sm`} />
                        Favorite Things
                      </h3>
                      <ul className="space-y-4">
                        {char.favorites.map((fav, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 text-selah-muted body-text hover:text-selah-dark transition-colors cursor-default"
                          >
                            <span className="text-2xl opacity-40">0{i + 1}</span>
                            {fav}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>

                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
