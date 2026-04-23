'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Gauge, Captions, Minimize2, X, Moon, ChevronDown } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpeedChange: (speed: number) => void;
  onCaptionsToggle: () => void;
  onBedtimeSet: (minutes: number | null) => void;
  onMinimize: () => void;
  onClose: () => void;
  currentSpeed: number;
  captionsOn: boolean;
  bedtimeMinutes: number | null;
}

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSpeedChange,
  onCaptionsToggle,
  onBedtimeSet,
  onMinimize,
  onClose,
  currentSpeed,
  captionsOn,
  bedtimeMinutes,
}: PlayerControlsProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showBedtimeMenu, setShowBedtimeMenu] = useState(false);
  
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const bedtimeOptions = [
    { label: 'Off', value: null },
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
  ];

  return (
    <div className="flex flex-row items-center bg-white/10 backdrop-blur-xl rounded-2xl p-3 gap-2 text-white relative">
      <button 
        onClick={onPrevious} 
        title="Previous"
        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors"
      >
        <SkipBack size={20} strokeWidth={1.75} />
      </button>

      <button 
        onClick={onPlayPause} 
        title={isPlaying ? "Pause" : "Play"}
        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors"
      >
        {isPlaying ? <Pause size={20} strokeWidth={1.75} /> : <Play size={20} strokeWidth={1.75} />}
      </button>

      <button 
        onClick={onNext} 
        title="Next"
        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors"
      >
        <SkipForward size={20} strokeWidth={1.75} />
      </button>

      <div className="w-px h-6 bg-white/20 mx-1"></div>

      <div className="relative flex items-center">
        <button 
          onClick={() => {
            setShowSpeedMenu(!showSpeedMenu);
            setShowBedtimeMenu(false);
          }} 
          title="Playback Speed"
          className={`flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors ${currentSpeed !== 1 ? 'ring-2 ring-selah-orange' : ''}`}
        >
          <Gauge size={20} strokeWidth={1.75} />
        </button>
        <AnimatePresence>
          {showSpeedMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-xl rounded-xl p-2 flex flex-col gap-1 min-w-[100px]"
            >
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onSpeedChange(s);
                    setShowSpeedMenu(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm text-left hover:bg-white/10 transition-colors ${currentSpeed === s ? 'text-selah-orange font-medium' : 'text-white'}`}
                >
                  {s}x
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex items-center">
        <button 
          onClick={() => {
            setShowBedtimeMenu(!showBedtimeMenu);
            setShowSpeedMenu(false);
          }} 
          title="Bedtime Timer"
          className={`flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors ${bedtimeMinutes !== null ? 'ring-2 ring-selah-orange' : ''}`}
        >
          <Moon size={20} strokeWidth={1.75} />
        </button>
        <AnimatePresence>
          {showBedtimeMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-xl rounded-xl p-2 flex flex-col gap-1 min-w-[120px]"
            >
              {bedtimeOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    onBedtimeSet(opt.value);
                    setShowBedtimeMenu(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm text-left hover:bg-white/10 transition-colors ${bedtimeMinutes === opt.value ? 'text-selah-orange font-medium' : 'text-white'}`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={onCaptionsToggle} 
        title="Toggle Captions"
        className={`flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors ${captionsOn ? 'ring-2 ring-selah-orange' : ''}`}
      >
        <Captions size={20} strokeWidth={1.75} />
      </button>

      <div className="w-px h-6 bg-white/20 mx-1 flex-shrink-0"></div>

      <button 
        onClick={onMinimize} 
        title="Minimize Player"
        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-colors ml-auto"
      >
        <Minimize2 size={20} strokeWidth={1.75} />
      </button>

      <button 
        onClick={onClose} 
        title="Close Player"
        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
      >
        <X size={20} strokeWidth={1.75} />
      </button>
    </div>
  );
}
