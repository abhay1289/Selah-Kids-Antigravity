'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Check } from 'lucide-react';
import { Episode } from '../../data/catalog';

interface QueueRailProps {
  queue: Episode[];
  nowPlayingId: string | null;
  onSelect: (episode: Episode) => void;
  className?: string;
}

function formatDuration(seconds: number) {
  return Math.floor(seconds / 60) + ':' + (seconds % 60).toString().padStart(2, '0');
}

export default function QueueRail({ queue, nowPlayingId, onSelect, className = '' }: QueueRailProps) {
  return (
    <div className={`sticky top-0 max-h-[70vh] overflow-y-auto flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-2 px-2">
        <h3 className="font-bold text-selah-dark text-lg">Up Next</h3>
        <span className="bg-black/10 text-selah-dark px-2 py-0.5 rounded-full text-xs font-medium">
          {queue.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {queue.map((episode) => {
          const isPlaying = episode.id === nowPlayingId;
          return (
            <motion.button
              key={episode.id}
              onClick={() => onSelect(episode)}
              whileHover={{ y: -2 }}
              className={`flex items-start text-left gap-3 p-2 rounded-xl transition-colors ${
                isPlaying ? 'ring-2 ring-selah-orange bg-selah-orange/5' : 'hover:bg-black/5'
              }`}
            >
              <div className="relative shrink-0 w-[96px] h-[54px] rounded-lg overflow-hidden bg-black/10">
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                    <motion.div
                      className="w-1 h-3 bg-white rounded-full"
                      animate={{ height: ['12px', '6px', '16px', '12px'] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="w-1 h-4 bg-white rounded-full"
                      animate={{ height: ['16px', '8px', '20px', '16px'] }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.1 }}
                    />
                    <motion.div
                      className="w-1 h-2 bg-white rounded-full"
                      animate={{ height: ['8px', '14px', '6px', '8px'] }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut', delay: 0.2 }}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-selah-dark font-semibold text-sm truncate">{episode.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-black/5 text-selah-dark/70 text-[10px] px-1.5 py-0.5 rounded font-medium">
                    {formatDuration(episode.durationSec)}
                  </span>
                  {episode.language && (
                    <span
                      className="bg-selah-blue/10 text-selah-blue text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                    >
                      {episode.language}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}