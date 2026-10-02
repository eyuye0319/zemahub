// src/components/FavoritesDrawer.tsx
import React from 'react';
import { X, Heart, Trash2, Play, Music2, Film } from 'lucide-react';
import { Mezmur, SpiritualFilm, Language } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  allMezmurs: Mezmur[];
  allFilms: SpiritualFilm[];
  currentLang: Language;
  onPlayMezmur: (mezmur: Mezmur) => void;
  onPlayFilm: (film: SpiritualFilm) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  allMezmurs,
  allFilms,
  currentLang,
  onPlayMezmur,
  onPlayFilm,
  onRemoveFavorite,
  onClearAll
}: FavoritesDrawerProps) {
  if (!isOpen) return null;

  const t = translations[currentLang];

  const favoriteMezmurs = allMezmurs.filter(m => favorites.includes(m.id));
  const favoriteFilms = allFilms.filter(f => favorites.includes(f.id));
  const totalCount = favoriteMezmurs.length + favoriteFilms.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1C050B] text-parchment-100 border-l border-gold-500/40 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-burgundy-950/90 border-b border-gold-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-gold-300">
                  {t.navFavorites} ({totalCount})
                </h3>
                <p className="text-[11px] text-parchment-400">
                  {currentLang === 'am' ? 'የተቀመጡ ተወዳጅ መዝሙራትና ፊልሞች' : 'Saved spiritual media library'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-parchment-400 hover:text-white hover:bg-burgundy-900/60 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {totalCount === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-burgundy-950 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-500/50">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-base text-gold-400">
                  {currentLang === 'am' ? 'ምንም የተወደደ ይዘት የለም' : 'No favorites saved yet'}
                </h4>
                <p className="text-xs text-parchment-400 max-w-xs mx-auto">
                  {currentLang === 'am'
                    ? 'በመዝሙር ወይም በፊልሞች ካርድ ላይ ያለውን የልብ ምልክት በመንካት ወደዚህ ማከማቸት ይችላሉ።'
                    : 'Click the heart icon on any mezmur or film card to add it to your sacred library.'}
                </p>
              </div>
            ) : (
              <>
                {/* Mezmurs Section */}
                {favoriteMezmurs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-serif font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Music2 className="w-3.5 h-3.5" />
                      <span>{t.navMezmur} ({favoriteMezmurs.length})</span>
                    </h4>

                    <div className="space-y-2">
                      {favoriteMezmurs.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 p-2.5 bg-burgundy-950/70 hover:bg-burgundy-900/80 border border-gold-500/20 rounded-xl transition-all group"
                        >
                          <img
                            src={m.thumbnailUrl}
                            alt={m.title}
                            className="w-14 h-10 object-cover rounded-lg border border-gold-500/30"
                          />
                          <div className="flex-1 overflow-hidden text-left">
                            <p className="font-serif font-bold text-xs text-parchment-100 truncate group-hover:text-gold-300">
                              {currentLang === 'am' ? m.titleAmharic : m.titleEnglish}
                            </p>
                            <p className="text-[11px] text-parchment-400 truncate">
                              {currentLang === 'am' ? m.singerAmharic : m.singerEnglish}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onPlayMezmur(m);
                                onClose();
                              }}
                              className="p-1.5 rounded-lg bg-gold-500 text-burgundy-950 hover:bg-gold-400 transition-all cursor-pointer"
                              title={t.playNow}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>

                            <button
                              onClick={() => onRemoveFavorite(m.id)}
                              className="p-1.5 rounded-lg text-parchment-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                              title={t.removeFromFavorites}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Films Section */}
                {favoriteFilms.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-serif font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" />
                      <span>{t.navFilms} ({favoriteFilms.length})</span>
                    </h4>

                    <div className="space-y-2">
                      {favoriteFilms.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center gap-3 p-2.5 bg-burgundy-950/70 hover:bg-burgundy-900/80 border border-gold-500/20 rounded-xl transition-all group"
                        >
                          <img
                            src={f.thumbnailUrl}
                            alt={f.title}
                            className="w-14 h-10 object-cover rounded-lg border border-gold-500/30"
                          />
                          <div className="flex-1 overflow-hidden text-left">
                            <p className="font-serif font-bold text-xs text-parchment-100 truncate group-hover:text-gold-300">
                              {currentLang === 'am' ? f.titleAmharic : f.titleEnglish}
                            </p>
                            <p className="text-[11px] text-parchment-400 truncate">
                              {currentLang === 'am' ? f.directorAmharic : f.directorEnglish} • {f.duration}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onPlayFilm(f);
                                onClose();
                              }}
                              className="p-1.5 rounded-lg bg-gold-500 text-burgundy-950 hover:bg-gold-400 transition-all cursor-pointer"
                              title={t.watchNow}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>

                            <button
                              onClick={() => onRemoveFavorite(f.id)}
                              className="p-1.5 rounded-lg text-parchment-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                              title={t.removeFromFavorites}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer Actions */}
          {totalCount > 0 && (
            <div className="p-4 bg-burgundy-950/90 border-t border-gold-500/30 flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'am' ? 'ሁሉንም አጽዳ' : 'Clear All'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-serif font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
