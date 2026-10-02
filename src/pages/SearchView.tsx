// src/pages/SearchView.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Music2, Film, RotateCcw, Sparkles } from 'lucide-react';
import { Mezmur, SpiritualFilm, CategoryInfo, Language } from '../types';
import { translations } from '../i18n/translations';
import { matchMezmurSearch, matchFilmSearch } from '../utils/searchHelper';
import MezmurCard from '../components/MezmurCard';
import FilmCard from '../components/FilmCard';
import EthiopianCross from '../components/EthiopianCross';

interface SearchViewProps {
  currentLang: Language;
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  categories: CategoryInfo[];
  favorites: string[];
  initialQuery?: string;
  onToggleFavorite: (id: string) => void;
  onPlayMezmur: (m: Mezmur) => void;
  onPlayFilm: (f: SpiritualFilm) => void;
  onSelectMezmur: (m: Mezmur) => void;
  onSelectFilm: (f: SpiritualFilm) => void;
}

export default function SearchView({
  currentLang,
  mezmurs,
  films,
  categories,
  favorites,
  initialQuery = '',
  onToggleFavorite,
  onPlayMezmur,
  onPlayFilm,
  onSelectMezmur,
  onSelectFilm
}: SearchViewProps) {
  const t = translations[currentLang];

  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | 'mezmur' | 'film'>('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const { matchedMezmurs, matchedFilms } = useMemo(() => {
    let mList = mezmurs.filter(m => {
      if (languageFilter !== 'all' && m.language.toLowerCase() !== languageFilter.toLowerCase()) {
        return false;
      }
      return matchMezmurSearch(m, query);
    });

    let fList = films.filter(f => {
      if (languageFilter !== 'all' && f.language.toLowerCase() !== languageFilter.toLowerCase()) {
        return false;
      }
      return matchFilmSearch(f, query);
    });

    return { matchedMezmurs: mList, matchedFilms: fList };
  }, [query, languageFilter, mezmurs, films]);

  const showMezmurs = typeFilter === 'all' || typeFilter === 'mezmur';
  const showFilms = typeFilter === 'all' || typeFilter === 'film';
  const totalMatches = (showMezmurs ? matchedMezmurs.length : 0) + (showFilms ? matchedFilms.length : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24 text-left">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-950 via-[#360914] to-burgundy-950 p-8 sm:p-10 rounded-3xl border border-gold-500/40 text-parchment-100 shadow-xl relative overflow-hidden">
        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-900/90 border border-gold-500/30 text-gold-300 text-xs font-serif font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>{t.navSearch}</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-parchment-50">
            {t.searchTitle}
          </h1>

          <p className="text-xs sm:text-sm text-parchment-200/90">
            {t.searchSubtitle}
          </p>
        </div>
      </div>

      {/* Search Input and Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-parchment-300 shadow-xs space-y-5">
        
        {/* Main Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-parchment-100 border border-parchment-300 focus:border-gold-500 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all font-sans"
            autoFocus
          />
          <Search className="w-5 h-5 text-gold-700 absolute left-3.5 top-4 pointer-events-none" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-xs text-charcoal-500 hover:text-charcoal-800 bg-parchment-200 px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Type Selection Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                  : 'bg-parchment-100 text-charcoal-700 hover:bg-parchment-200'
              }`}
            >
              {t.allMedia} ({matchedMezmurs.length + matchedFilms.length})
            </button>

            <button
              onClick={() => setTypeFilter('mezmur')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                typeFilter === 'mezmur'
                  ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                  : 'bg-parchment-100 text-charcoal-700 hover:bg-parchment-200'
              }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>{t.navMezmur} ({matchedMezmurs.length})</span>
            </button>

            <button
              onClick={() => setTypeFilter('film')}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                typeFilter === 'film'
                  ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                  : 'bg-parchment-100 text-charcoal-700 hover:bg-parchment-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>{t.navFilms} ({matchedFilms.length})</span>
            </button>
          </div>

          {/* Language filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-serif font-bold text-charcoal-700">{t.language}:</span>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="bg-parchment-100 border border-parchment-300 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-800"
            >
              <option value="all">{t.allLanguages}</option>
              <option value="Amharic">Amharic</option>
              <option value="English">English</option>
              <option value="Ge'ez">Ge'ez</option>
            </select>
          </div>
        </div>

      </div>

      {/* Search Results Display */}
      {totalMatches > 0 ? (
        <div className="space-y-12">
          
          {/* Mezmur Results */}
          {showMezmurs && matchedMezmurs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-parchment-300 pb-2">
                <h3 className="font-serif font-bold text-lg text-burgundy-950 flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-gold-700" />
                  <span>{t.navMezmur} ({matchedMezmurs.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matchedMezmurs.map((m) => (
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
          )}

          {/* Film Results */}
          {showFilms && matchedFilms.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-parchment-300 pb-2">
                <h3 className="font-serif font-bold text-lg text-burgundy-950 flex items-center gap-2">
                  <Film className="w-4 h-4 text-gold-700" />
                  <span>{t.navFilms} ({matchedFilms.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matchedFilms.map((f) => (
                  <FilmCard
                    key={f.id}
                    film={f}
                    currentLang={currentLang}
                    onPlay={onPlayFilm}
                    onSelect={onSelectFilm}
                    isFavorite={favorites.includes(f.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-parchment-300 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-burgundy-900/10 text-burgundy-900 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-lg text-burgundy-950">
            {t.noSearchResults}
          </h3>
          <p className="text-xs text-charcoal-600">
            {currentLang === 'am'
              ? 'ለተሰጠው ቃል ምንም መዝሙር ወይም ፊልም አልተገኘም። እባክዎ ፊደሎችን ወይም ቃላትን ቀይረው ይሞክሩ።'
              : 'No hymns or films matched your keyword. Try checking the spelling or using broader search terms.'}
          </p>
        </div>
      )}

    </div>
  );
}
