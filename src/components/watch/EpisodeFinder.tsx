'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';
import { EPISODES, Episode, EpisodeCategory, EpisodeLanguage } from '../../data/catalog';
import { useLanguage } from '../../contexts/LanguageContext';

interface EpisodeFinderProps {
  onResultsChange: (filtered: Episode[]) => void;
  className?: string;
}

type FilterChip = 'under5' | 'under10' | 'en' | 'es' | 'sensory' | 'music-video' | 'sing-along';

export function EpisodeFinder({ onResultsChange, className = '' }: EpisodeFinderProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterChip[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleFilter = (filter: FilterChip) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setDebouncedQuery('');
    setActiveFilters([]);
  };

  const filteredEpisodes = useMemo(() => {
    let result = EPISODES;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          (ep.titleEs && ep.titleEs.toLowerCase().includes(q)) ||
          ep.description.toLowerCase().includes(q) ||
          ep.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (activeFilters.includes('under5')) {
      result = result.filter((ep) => ep.durationSec < 300);
    } else if (activeFilters.includes('under10')) {
      result = result.filter((ep) => ep.durationSec < 600);
    }

    const hasEn = activeFilters.includes('en');
    const hasEs = activeFilters.includes('es');
    if (hasEn && !hasEs) {
      result = result.filter((ep) => ep.language === 'EN');
    } else if (hasEs && !hasEn) {
      result = result.filter((ep) => ep.language === 'ES');
    }

    const categoryFilters = activeFilters.filter((f) => ['sensory', 'music-video', 'sing-along'].includes(f));
    if (categoryFilters.length > 0) {
      result = result.filter((ep) => categoryFilters.includes(ep.category as FilterChip));
    }

    return result;
  }, [debouncedQuery, activeFilters]);

  useEffect(() => {
    onResultsChange(filteredEpisodes);
  }, [filteredEpisodes, onResultsChange]);

  const resultCountText = language === 'ES' ? `${filteredEpisodes.length} episodios` : `${filteredEpisodes.length} episodes`;

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === 'ES' ? 'Buscar episodios...' : 'Search episodes...'}
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full py-4 pl-12 pr-12 text-lg text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
        {(query || activeFilters.length > 0) && (
          <button
            onClick={clearFilters}
            className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip
          active={activeFilters.includes('under5')}
          onClick={() => toggleFilter('under5')}
          icon={<Clock size={14} />}
          label={language === 'ES' ? 'Menos de 5 min' : 'Under 5 min'}
        />
        <Chip
          active={activeFilters.includes('under10')}
          onClick={() => toggleFilter('under10')}
          icon={<Clock size={14} />}
          label={language === 'ES' ? 'Menos de 10 min' : 'Under 10 min'}
        />
        <Chip
          active={activeFilters.includes('en')}
          onClick={() => toggleFilter('en')}
          label="English"
        />
        <Chip
          active={activeFilters.includes('es')}
          onClick={() => toggleFilter('es')}
          label="Spanish"
        />
        <Chip
          active={activeFilters.includes('sensory')}
          onClick={() => toggleFilter('sensory')}
          label={language === 'ES' ? 'Sensorial' : 'Sensory'}
        />
        <Chip
          active={activeFilters.includes('music-video')}
          onClick={() => toggleFilter('music-video')}
          label={language === 'ES' ? 'Video Musical' : 'Music Video'}
        />
        <Chip
          active={activeFilters.includes('sing-along')}
          onClick={() => toggleFilter('sing-along')}
          label="Sing-Along"
        />
      </div>

      <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 px-1">
        {resultCountText}
      </div>
    </div>
  );
}

function Chip({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon?: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
