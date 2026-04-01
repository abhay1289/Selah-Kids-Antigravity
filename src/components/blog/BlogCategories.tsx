import React from 'react';

interface BlogCategoriesProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export const BlogCategories: React.FC<BlogCategoriesProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="sticky top-20 z-40 bg-[#FDFBF7]/90 backdrop-blur-xl py-6 mb-12 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-8 py-3 rounded-full ui-label whitespace-nowrap transition-all duration-500 ${ activeCategory === cat.id ? 'bg-selah-orange text-white shadow-[0_8px_20px_rgba(255,92,0,0.3)] scale-105' : 'bg-transparent text-selah-muted border border-selah-border/30 hover:border-selah-orange/50 hover:text-selah-dark' }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
