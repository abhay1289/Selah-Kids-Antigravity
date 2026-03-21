import React from 'react';

interface BlogCategoriesProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export const BlogCategories: React.FC<BlogCategoriesProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="sticky top-20 z-40 bg-[#FDFBF7]/90 backdrop-blur-xl py-6 mb-16 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-8 py-3 rounded-full font-sans font-semibold text-sm tracking-widest uppercase whitespace-nowrap transition-all duration-500 ${
              activeCategory === cat.id
                ? 'bg-selah-dark text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] scale-105'
                : 'bg-transparent text-selah-muted border border-black/10 hover:border-selah-dark/50 hover:text-selah-dark'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
