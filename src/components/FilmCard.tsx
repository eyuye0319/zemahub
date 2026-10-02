// src/components/FilmCard.tsx
import React from 'react';
import { Play, Heart, Film, Eye, Clapperboard, ExternalLink } from 'lucide-react';
import { SpiritualFilm, Language } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';

interface FilmCardProps {
  key?: React.Key;
  film: SpiritualFilm;
  currentLang: Language;
  onPlay: (film: SpiritualFilm) => void;
  onSelect: (film: SpiritualFilm) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function FilmCard({
  film,
  currentLang,
  onPlay,
  onSelect,
  isFavorite,
  onToggleFavorite
}: FilmCardProps) {
  const t = translations[currentLang];

  const displayTitle = currentLang === 'am' ? film.titleAmharic : film.titleEnglish;
  const secondaryTitle = currentLang === 'am' ? film.titleEnglish : film.titleAmharic;
  const displayDirector = currentLang === 'am' ? film.directorAmharic : film.directorEnglish;
  const displayCategory = currentLang === 'am' ? film.categoryAmharic : film.categoryEnglish;

  return (
    <div className="group bg-white rounded-2xl border border-parchment-300 hover:border-gold-500/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left">
      
      {/* Poster Image Container */}
      <div className="relative aspect-video w-full bg-[#120205] overflow-hidden">
        <img
          src={film.thumbnailUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-burgundy-950/85 backdrop-blur-xs text-[10px] font-medium text-gold-300 border border-gold-500/40 pointer-events-auto flex items-center gap-1">
            <Film className="w-3 h-3 text-gold-400" />
            <span className="truncate max-w-[130px]">{displayCategory}</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(film.id);
            }}
            className={`p-2 rounded-full backdrop-blur-xs transition-all pointer-events-auto cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-black/60 text-parchment-200 hover:text-rose-400 hover:bg-black/80'
            }`}
            title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Play Overlay */}
        <div 
          onClick={() => onPlay(film)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gold-500/90 group-hover:bg-gold-400 text-burgundy-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration & Views bar */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-parchment-200 font-medium pointer-events-none">
          <span className="bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
            {film.duration}
          </span>
          <span className="bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <Eye className="w-3 h-3 text-gold-400" />
            {film.views ? film.views.toLocaleString() : '50K+'} {t.views}
          </span>
        </div>
      </div>

      {/* Film Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Main Title */}
          <h3 
            onClick={() => onSelect(film)}
            className="font-serif font-bold text-base text-burgundy-950 group-hover:text-burgundy-700 transition-colors line-clamp-1 cursor-pointer"
            title={displayTitle}
          >
            {displayTitle}
          </h3>

          {/* Secondary Title */}
          {secondaryTitle && secondaryTitle !== displayTitle && (
            <p className="text-[11px] text-charcoal-600 font-sans line-clamp-1 italic mt-0.5">
              {secondaryTitle}
            </p>
          )}

          {/* Director & Cast */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-charcoal-700 font-medium">
            <Clapperboard className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
            <span className="truncate">{displayDirector}</span>
          </div>

          {film.actors && film.actors.length > 0 && (
            <p className="text-[11px] text-charcoal-500 font-sans truncate mt-1">
              <span className="font-medium text-charcoal-700">{t.actors}:</span> {film.actors.join(', ')}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-parchment-200 flex items-center justify-between text-[11px] text-charcoal-600">
          <span className="font-semibold text-burgundy-800 bg-parchment-100 px-2 py-0.5 rounded">
            {film.year} • {film.language}
          </span>

          <button
            onClick={() => onSelect(film)}
            className="text-gold-700 hover:text-gold-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{currentLang === 'am' ? 'ዝርዝር' : 'Details'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
}
