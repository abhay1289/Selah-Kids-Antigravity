'use client';
import SensoryHero from '@/components/sensory/SensoryHero';
import SensoryPlayer from '@/components/sensory/SensoryPlayer';

export default function SensoryPage() {
  return (
    <div className="bg-gradient-to-b from-[#0B1020] via-[#1A1612] to-[#0B1020] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden text-white">
      {/* very subtle starfield */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-2 h-2 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-[30%] left-[20%] w-1 h-1 bg-white/60 rounded-full" />
        <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-[20%] right-[15%] w-1 h-1 bg-white/50 rounded-full" />
        <div className="absolute top-[80%] left-[40%] w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
      </div>
      <SensoryHero />
      <SensoryPlayer />
    </div>
  );
}
