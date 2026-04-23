'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: any) => void;
  }
}

interface SpotifyEmbedProps {
  uri?: string;
  theme?: 'light' | 'dark';
  height?: number;
  className?: string;
}

export default function SpotifyEmbed({
  uri = 'spotify:artist:6lShgHNhA1vXSZ6f4UXMa4',
  theme = 'light',
  height = 380,
  className = ''
}: SpotifyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playback, setPlayback] = useState<{
    isPlaying: boolean;
    position: number;
    duration: number;
    title?: string;
  }>({
    isPlaying: false,
    position: 0,
    duration: 0
  });

  useEffect(() => {
    let isMounted = true;

    const initSpotify = (IFrameAPI: any) => {
      if (!isMounted || !containerRef.current) return;
      
      const options = {
        uri,
        theme,
        width: '100%',
        height
      };

      IFrameAPI.createController(containerRef.current, options, (controller: any) => {
        controllerRef.current = controller;
        setIsLoaded(true);

        controller.addListener('playback_update', (e: any) => {
          if (!isMounted || !e.data) return;
          setPlayback({
            isPlaying: !e.data.isPaused,
            position: e.data.position,
            duration: e.data.duration,
            title: e.data.track?.name
          });
        });
      });
    };

    if (document.getElementById('spotify-iframe-api')) {
      // Script is already loaded
    }

    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      initSpotify(IFrameAPI);
    };

    if (!document.getElementById('spotify-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'spotify-iframe-api';
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (controllerRef.current) {
        try {
          controllerRef.current.destroy();
        } catch (err) {}
      }
    };
  }, [uri, theme, height]);

  return (
    <div className={`relative w-full ${className}`}>
      {!isLoaded && (
        <div
          className="absolute inset-0 w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl"
          style={{ height }}
        />
      )}
      <div ref={containerRef} className="relative z-10 w-full" />

      {isLoaded && playback.title && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0">
              {playback.isPlaying ? (
                <Pause className="w-4 h-4 text-[#1DB954]" />
              ) : (
                <Play className="w-4 h-4 text-neutral-400" />
              )}
            </div>
            <span className="font-medium truncate max-w-[200px] md:max-w-xs">
              {playback.title}
            </span>
          </div>
          {playback.duration > 0 && (
            <div className="text-xs text-neutral-500 flex-shrink-0 ml-4 font-mono">
              {Math.floor(playback.position / 1000 / 60)}:
              {Math.floor((playback.position / 1000) % 60).toString().padStart(2, '0')} 
              <span className="mx-1 opacity-50">/</span>
              {Math.floor(playback.duration / 1000 / 60)}:
              {Math.floor((playback.duration / 1000) % 60).toString().padStart(2, '0')}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
