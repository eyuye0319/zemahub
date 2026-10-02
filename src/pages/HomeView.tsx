// src/pages/HomeView.tsx
import React, { useState } from 'react';
import { 
  Music2, Film, Sparkles, ArrowRight, Eye, Play, Star, BookOpen, Compass, Award 
} from 'lucide-react';
import { Mezmur, SpiritualFilm, CategoryInfo, Language, PlatformStats } from '../types';
import { translations } from '../i18n/translations';
import Hero from '../components/Hero';
import MezmurCard from '../components/MezmurCard';
import FilmCard from '../components/FilmCard';
import EthiopianCross from '../components/EthiopianCross';

interface HomeViewProps {
  currentLang: Language;
  stats: PlatformStats;
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  categories: CategoryInfo[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPlayMezmur: (m: Mezmur) => void;
  onPlayFilm: (f: SpiritualFilm) => void;
  onSelectMezmur: (m: Mezmur) => void;
  onSelectFilm: (f: SpiritualFilm) => void;
  onNavigate: (tab: string, param?: string) => void;
}

export default function HomeView({
  currentLang,
  stats,
  mezmurs,
  films,
  categories,
  favorites,
  onToggleFavorite,
  onPlayMezmur,
  onPlayFilm,
  onSelectMezmur,
  onSelectFilm,
  onNavigate
}: HomeViewProps) {
  const t = translations[currentLang];
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  const featuredMezmurs = mezmurs.filter(m => m.featured).slice(0, 4);
  const popularMezmurs = [...mezmurs].sort((a, b) => b.views - a.views).slice(0, 6);
  const featuredFilms = [...films.filter(f => f.featured), ...films.filter(f => !f.featured)].slice(0, 4);

  const filteredPopularMezmurs = selectedCategoryTab === 'all'
    ? popularMezmurs
    : mezmurs.filter(m => m.category === selectedCategoryTab).slice(0, 6);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <Hero
        currentLang={currentLang}
        stats={stats}
        mezmurs={mezmurs}
        films={films}
        onExploreMezmur={() => onNavigate('mezmur')}
        onExploreFilms={() => onNavigate('films')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 2. Quick Category Browsing Pills */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-burgundy-900 text-gold-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-burgundy-950">
                {currentLang === 'am' ? 'በምድቦች ያስሱ' : 'Browse by Category'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('mezmur')}
              className="text-xs sm:text-sm font-serif font-bold text-gold-700 hover:text-gold-900 flex items-center gap-1 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('mezmur', cat.id)}
                className="group p-4 rounded-2xl bg-white hover:bg-burgundy-950 border border-parchment-300 hover:border-gold-500 shadow-xs hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-32 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-parchment-100 group-hover:bg-burgundy-900 text-burgundy-900 group-hover:text-gold-400 flex items-center justify-center transition-colors">
                  <EthiopianCross size={18} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-burgundy-950 group-hover:text-gold-300 line-clamp-2 transition-colors">
                    {currentLang === 'am' ? cat.nameAmharic : cat.nameEnglish}
                  </h4>
                  <p className="text-[10px] text-charcoal-500 group-hover:text-parchment-300 transition-colors mt-0.5">
                    {cat.type === 'film' ? (currentLang === 'am' ? 'ፊልሞች' : 'Films') : (currentLang === 'am' ? 'መዝሙራት' : 'Mezmurs')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Featured Mezmurs Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-parchment-300 pb-4">
            <div>
              <div className="flex items-center gap-2 text-gold-700 text-xs font-serif font-bold uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{t.featuredMezmurBadge}</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-burgundy-950">
                {t.featuredMezmurTitle}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('mezmur')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-burgundy-900 hover:text-gold-700 transition-colors cursor-pointer"
            >
              <span>{t.viewAll} {t.navMezmur}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMezmurs.map((m) => (
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
        </section>

        {/* 4. Popular Hymns / Discovery Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-burgundy-950">
                {t.popularMezmurTitle}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                {currentLang === 'am' ? 'በምዕመናን ዘንድ ተወዳጅ የሆኑ ምስጋናዎችና ማኅሌቶች' : 'Most cherished hymns and spiritual songs'}
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryTab('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-serif font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryTab === 'all'
                    ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                    : 'bg-parchment-200/80 text-charcoal-700 hover:bg-parchment-300'
                }`}
              >
                {t.allCategories}
              </button>
              {categories.filter(c => c.type === 'mezmur').slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryTab(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-serif font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryTab === c.id
                      ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                      : 'bg-parchment-200/80 text-charcoal-700 hover:bg-parchment-300'
                  }`}
                >
                  {currentLang === 'am' ? c.nameAmharic : c.nameEnglish}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPopularMezmurs.map((m) => (
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
        </section>

        {/* 5. Liturgical Feast Traditions Spotlight */}
        <section className="rounded-3xl bg-gradient-to-br from-[#24060C] via-[#350912] to-[#1A0307] border border-gold-500/40 p-8 sm:p-12 text-parchment-100 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy-900/90 border border-gold-500/40 text-gold-300 text-xs font-serif font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{currentLang === 'am' ? 'የዓመቱ በዓላትና አጽዋማት ማኅሌት' : 'Annual Feast Hymns & Liturgical Seasons'}</span>
            </div>

            <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-parchment-50 leading-tight">
              {currentLang === 'am'
                ? 'በበዓላት፣ በአጽዋማትና በሰንበታት የሚዘመሩ መንፈሳዊ ማኅሌቶች'
                : 'Experience the Timeless Depth of Orthodox Season & Feast Hymns'}
            </h3>

            <p className="text-xs sm:text-sm text-parchment-200/90 leading-relaxed">
              {currentLang === 'am'
                ? 'የዘመነ ጽጌ፣ የዐቢይ ጾምና የትንሣኤ (ፋሲካ)፣ የበዓለ መስቀል እንዲሁም የበዓለ ጥምቀትና ኤጲፋንያ ምስጋናዎችን በልዩ ምድብ ተደራጅተው ያግኙ።'
                : 'Discover curated chants for Zemene Tsige (Season of Flowers), Great Lent & Holy Pascha, Meskel (The True Cross), and Epiphany (Timket).'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('mezmur', 'mariam')}
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-serif font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Music2 className="w-4 h-4" />
                <span>{currentLang === 'am' ? 'የእመቤታችን መዝሙራትን ያዳምጡ' : 'Explore Marian Hymns'}</span>
              </button>

              <button
                onClick={() => onNavigate('mezmur')}
                className="px-6 py-3 rounded-xl bg-burgundy-900/80 hover:bg-burgundy-800 text-parchment-100 border border-gold-500/40 font-serif font-medium text-xs sm:text-sm transition-all cursor-pointer"
              >
                {t.viewAll} {t.navMezmur}
              </button>
            </div>
          </div>
        </section>

        {/* 6. Spiritual Films Showcase Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-parchment-300 pb-4">
            <div>
              <div className="flex items-center gap-2 text-gold-700 text-xs font-serif font-bold uppercase tracking-wider mb-1">
                <Film className="w-3.5 h-3.5" />
                <span>{t.featuredFilmsBadge}</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-burgundy-950">
                {t.featuredFilmsTitle}
              </h2>
            </div>

            <button
              onClick={() => onNavigate('films')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-burgundy-900 hover:text-gold-700 transition-colors cursor-pointer"
            >
              <span>{t.viewAll} {t.navFilms}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFilms.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                currentLang={currentLang}
                onPlay={onPlayFilm}
                onSelect={onSelectFilm}
                isFavorite={favorites.includes(film.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
