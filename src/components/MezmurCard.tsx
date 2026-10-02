// src/components/MezmurCard.tsx
import React from 'react';
import { Play, Heart, Music2, Eye, ExternalLink } from 'lucide-react';
import { Mezmur, Language } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';

interface MezmurCardProps {
  key?: React.Key;
  mezmur: Mezmur;
  currentLang: Language;
  onPlay: (mezmur: Mezmur) => void;
  onSelect: (mezmur: Mezmur) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function MezmurCard({
  mezmur,
  currentLang,
  onPlay,
  onSelect,
  isFavorite,
  onToggleFavorite
}: MezmurCardProps) {
  const t = translations[currentLang];

  const displayTitle = currentLang === 'am' ? mezmur.titleAmharic : mezmur.titleEnglish;
  const secondaryTitle = currentLang === 'am' ? mezmur.titleEnglish : mezmur.titleAmharic;
  const displaySinger = currentLang === 'am' ? mezmur.singerAmharic : mezmur.singerEnglish;
  const displayCategory = currentLang === 'am' ? mezmur.categoryAmharic : mezmur.categoryEnglish;

  return (
    <div className="group bg-white rounded-2xl border border-parchment-300 hover:border-gold-500/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-[#1A050A] overflow-hidden">
        <img
          src={mezmur.thumbnailUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Top Badges: Category & Favorite */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-burgundy-950/80 backdrop-blur-xs text-[10px] font-medium text-gold-300 border border-gold-500/40 pointer-events-auto flex items-center gap-1">
            <EthiopianCross size={10} className="text-gold-400" />
            <span className="truncate max-w-[120px]">{displayCategory}</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(mezmur.id);
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

        {/* Play Overlay Button */}
        <div 
          onClick={() => onPlay(mezmur)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gold-500/90 group-hover:bg-gold-400 text-burgundy-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Bottom meta stats */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-parchment-200 font-medium pointer-events-none">
          <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
            {mezmur.duration || '5:00'}
          </span>
          <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <Eye className="w-3 h-3 text-gold-400" />
            {mezmur.views ? mezmur.views.toLocaleString() : '10K+'} {t.views}
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Main Title */}
          <h3 
            onClick={() => onSelect(mezmur)}
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

          {/* Singer */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-charcoal-700 font-medium">
            <Music2 className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
            <span className="truncate">{displaySinger}</span>
          </div>
        </div>

        {/* Card Footer Info */}
        <div className="pt-3 border-t border-parchment-200 flex items-center justify-between text-[11px] text-charcoal-600">
          <span className="font-semibold text-burgundy-800 bg-parchment-100 px-2 py-0.5 rounded">
            {mezmur.year} • {mezmur.language}
          </span>

          <button
            onClick={() => onSelect(mezmur)}
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
