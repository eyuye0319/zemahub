// src/pages/MezmurView.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, Music2, RotateCcw, SlidersHorizontal, Sparkles, Layers, Check 
} from 'lucide-react';
import { Mezmur, CategoryInfo, SingerArtist, Language } from '../types';
import { translations } from '../i18n/translations';
import { matchMezmurSearch } from '../utils/searchHelper';
import MezmurCard from '../components/MezmurCard';
import EthiopianCross from '../components/EthiopianCross';

interface MezmurViewProps {
  currentLang: Language;
  mezmurs: Mezmur[];
  categories: CategoryInfo[];
  singers: SingerArtist[];
  favorites: string[];
  initialCategory?: string;
  onToggleFavorite: (id: string) => void;
  onPlayMezmur: (m: Mezmur) => void;
  onSelectMezmur: (m: Mezmur) => void;
}

export default function MezmurView({
  currentLang,
  mezmurs,
  categories,
  singers,
  favorites,
  initialCategory,
  onToggleFavorite,
  onPlayMezmur,
  onSelectMezmur
}: MezmurViewProps) {
  const t = translations[currentLang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSinger, setSelectedSinger] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'most_viewed' | 'oldest' | 'alphabetical'>('newest');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const mezmurCategories = categories.filter(c => c.type === 'mezmur' || c.type === 'both');

  const filteredMezmurs = useMemo(() => {
    return mezmurs.filter(m => {
      // Search
      if (searchQuery.trim() && !matchMezmurSearch(m, searchQuery)) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }

      // Language
      if (selectedLanguage !== 'all' && m.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
        return false;
      }

      // Year
      if (selectedYear !== 'all' && String(m.year) !== selectedYear) {
        return false;
      }

      // Singer
      if (selectedSinger !== 'all') {
        const sMatch = m.singerAmharic.includes(selectedSinger) || m.singerEnglish.includes(selectedSinger);
        if (!sMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'most_viewed') {
        return b.views - a.views;
      }
      if (sortBy === 'oldest') {
        return a.year - b.year;
      }
      if (sortBy === 'alphabetical') {
        const titleA = currentLang === 'am' ? a.titleAmharic : a.titleEnglish;
        const titleB = currentLang === 'am' ? b.titleAmharic : b.titleEnglish;
        return titleA.localeCompare(titleB);
      }
      return b.year - a.year || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [mezmurs, searchQuery, selectedCategory, selectedLanguage, selectedYear, selectedSinger, sortBy, currentLang]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedYear('all');
    setSelectedSinger('all');
    setSortBy('newest');
  };

  const isFiltered = searchQuery || selectedCategory !== 'all' || selectedLanguage !== 'all' || selectedYear !== 'all' || selectedSinger !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-burgundy-950 via-[#360914] to-burgundy-950 p-8 sm:p-10 rounded-3xl border border-gold-500/40 text-parchment-100 shadow-xl relative overflow-hidden">
        <div className="relative max-w-2xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-900/90 border border-gold-500/30 text-gold-300 text-xs font-serif font-bold">
            <EthiopianCross size={14} className="text-gold-400" />
            <span>{t.mezmurPageTitle}</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-parchment-50">
            {t.mezmurPageTitle}
          </h1>

          <p className="text-xs sm:text-sm text-parchment-200/90">
            {t.mezmurPageSubtitle}
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-parchment-300 shadow-xs space-y-5 text-left">
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchMezmurPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-parchment-100 border border-parchment-300 focus:border-gold-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all font-sans"
          />
          <Search className="w-5 h-5 text-gold-700 absolute left-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-xs text-charcoal-500 hover:text-charcoal-800 bg-parchment-200 px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Category */}
          <div>
            <label className="block text-[11px] font-serif font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.category}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:border-gold-500 focus:outline-none"
            >
              <option value="all">{t.allCategories}</option>
              {mezmurCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {currentLang === 'am' ? c.nameAmharic : c.nameEnglish}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] font-serif font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.language}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:border-gold-500 focus:outline-none"
            >
              <option value="all">{t.allLanguages}</option>
              <option value="Amharic">አማርኛ (Amharic)</option>
              <option value="English">English</option>
              <option value="Ge'ez">ግዕዝ (Ge'ez)</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-serif font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.year}
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:border-gold-500 focus:outline-none"
            >
              <option value="all">{t.allYears}</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2020">2020</option>
              <option value="2018">2018</option>
              <option value="2015">2015</option>
              <option value="2010">2010</option>
            </select>
          </div>

          {/* Singer */}
          <div>
            <label className="block text-[11px] font-serif font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.singer}
            </label>
            <select
              value={selectedSinger}
              onChange={(e) => setSelectedSinger(e.target.value)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:border-gold-500 focus:outline-none"
            >
              <option value="all">{t.allSingers}</option>
              {singers.map(s => (
                <option key={s.id} value={currentLang === 'am' ? s.nameAmharic : s.nameEnglish}>
                  {currentLang === 'am' ? s.nameAmharic : s.nameEnglish}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-serif font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.sortBy}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:border-gold-500 focus:outline-none"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="most_viewed">{t.sortViews}</option>
              <option value="oldest">{t.sortOldest}</option>
              <option value="alphabetical">{t.sortTitle}</option>
            </select>
          </div>

        </div>

        {/* Status Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-600 border-t border-parchment-200">
          <p>
            {currentLang === 'am' ? 'የተገኙ መዝሙራት፦' : 'Showing'} <strong className="text-burgundy-900 font-bold">{filteredMezmurs.length}</strong> {t.totalMezmurs}
          </p>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-gold-800 hover:text-gold-950 font-serif font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.clearFilters}</span>
            </button>
          )}
        </div>

      </div>

      {/* Mezmurs Grid */}
      {filteredMezmurs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMezmurs.map((m) => (
            <MezmurCard
              key={m.id}
              mezmur={m}
              currentLang={currentLang}
              onPlay={onPlayMezmur}
              onSelect={onSelectMezmur}
              isFavorite={favorites.includes(m.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-parchment-300 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-burgundy-900/10 text-burgundy-900 flex items-center justify-center mx-auto">
            <Music2 className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-lg text-burgundy-950">
            {t.noMezmurFound}
          </h3>
          <p className="text-xs text-charcoal-600">
            {currentLang === 'am'
              ? 'የተመረጡትን ማጣሪያዎች በመቀየር ወይም የተለየ ቃል በመፈለግ እንደገና ይሞክሩ።'
              : 'Try broadening your search term or clearing some category filters.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-burgundy-900 text-gold-300 font-serif font-bold text-xs hover:bg-burgundy-800 transition-all cursor-pointer"
          >
            {t.clearFilters}
          </button>
        </div>
      )}

    </div>
  );
}
