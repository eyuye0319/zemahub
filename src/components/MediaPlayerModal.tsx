// src/components/MediaPlayerModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, Heart, BookOpen, Layers, Play, AlertCircle, RefreshCw, MessageSquare
} from 'lucide-react';
import { Mezmur, SpiritualFilm, Language } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';
import ShareMenu from './ShareMenu';
import CommentsSection from './CommentsSection';

interface MediaPlayerModalProps {
  media: Mezmur | SpiritualFilm | null;
  type: 'mezmur' | 'film';
  currentLang: Language;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  relatedItems?: (Mezmur | SpiritualFilm)[];
  onSelectRelated?: (item: Mezmur | SpiritualFilm) => void;
}

export default function MediaPlayerModal({
  media,
  type,
  currentLang,
  onClose,
  isFavorite,
  onToggleFavorite,
  relatedItems = [],
  onSelectRelated
}: MediaPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'lyrics' | 'related' | 'comments'>('info');
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [embedError, setEmbedError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Reset tab and error states whenever media changes
  useEffect(() => {
    if (media) {
      setEmbedError(false);
      setActiveTab('info');
      setCommentCount(null);
      setIframeKey((prev) => prev + 1);
    }
  }, [media?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!media) return null;

  const t = translations[currentLang];
  const isMezmur = type === 'mezmur';
  const mezmur = isMezmur ? (media as Mezmur) : null;
  const film = !isMezmur ? (media as SpiritualFilm) : null;

  const title = currentLang === 'am' ? media.titleAmharic : media.titleEnglish;
  const secondaryTitle = currentLang === 'am' ? media.titleEnglish : media.titleAmharic;
  const creator = isMezmur
    ? (currentLang === 'am' ? mezmur?.singerAmharic : mezmur?.singerEnglish)
    : (currentLang === 'am' ? film?.directorAmharic : film?.directorEnglish);
  const category = currentLang === 'am' ? media.categoryAmharic : media.categoryEnglish;
  const description = currentLang === 'am' ? media.descriptionAmharic : media.descriptionEnglish;

  // Clean and validate the video ID
  const videoId = (media.youtubeVideoId || '').trim();
  const directYoutubeUrl = media.youtubeUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com');
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : '';

  const handleReloadIframe = () => {
    setEmbedError(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-[#180408] text-parchment-100 rounded-2xl border border-gold-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 bg-burgundy-950/95 border-b border-gold-500/30 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 overflow-hidden">
            <EthiopianCross size={20} className="text-gold-400 flex-shrink-0" />
            <div className="truncate text-left">
              <h3 className="font-serif font-bold text-sm sm:text-base text-gold-300 truncate">
                {title}
              </h3>
              <p className="text-[11px] text-parchment-300/80 truncate">
                {creator} • {media.year} • {category}
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => onToggleFavorite(media.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-burgundy-900/60 text-parchment-200 border-gold-500/30 hover:text-gold-300'
              }`}
              title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <ShareMenu media={media} type={type} currentLang={currentLang} />

            {/* Prominent Direct YouTube External Link Button */}
            <a
              href={directYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#CC0000] hover:bg-[#E60000] text-white border border-red-500/50 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title={t.watchOnYoutube}
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
              <span>YouTube ↗</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-burgundy-900/60 text-parchment-300 hover:text-rose-400 border border-gold-500/30 transition-all cursor-pointer"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Media Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {embedError || !videoId ? (
            /* Fallback State UI */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#130206] text-parchment-100">
              
              {/* Optional Background Backdrop Image */}
              {media.thumbnailUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 blur-md pointer-events-none"
                  style={{ backgroundImage: `url(${media.thumbnailUrl})` }}
                />
              )}

              <div className="relative z-10 max-w-md space-y-3.5 bg-burgundy-950/90 p-6 rounded-2xl border border-gold-500/40 shadow-2xl backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-gold-400 flex items-center justify-center border border-gold-500/40">
                  <AlertCircle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-gold-300">
                    {t.videoUnavailable}
                  </h4>
                  <p className="text-xs text-parchment-300/90 leading-relaxed">
                    {t.videoUnavailableDesc}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={directYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#CC0000] hover:bg-[#E60000] text-white font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.watchOnYoutube}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleReloadIframe}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy-900/80 hover:bg-burgundy-800 text-parchment-200 border border-gold-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t.tryReloadPlayer}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active YouTube Iframe */
            <div className="relative w-full h-full">
              <iframe
                key={`${media.id}-${iframeKey}`}
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setEmbedError(true)}
              ></iframe>

              {/* Discreet Fallback Toggle Helper */}
              <div className="absolute bottom-2 right-2 z-20">
                <button
                  type="button"
                  onClick={() => setEmbedError(true)}
                  className="px-2.5 py-1 rounded-md bg-black/80 hover:bg-black text-[11px] text-parchment-300 border border-gold-500/30 backdrop-blur-xs transition-opacity opacity-75 hover:opacity-100 flex items-center gap-1"
                  title="If the video does not play inside the embed, click here for direct YouTube link"
                >
                  <AlertCircle className="w-3 h-3 text-gold-400" />
                  <span>{currentLang === 'am' ? 'ችግር አጋጠመዎ?' : 'Playback Issue?'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Tabs: Overview / Lyrics / Related */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-gold-500/20 bg-burgundy-950/80 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'info'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-parchment-400 hover:text-parchment-200'
            }`}
          >
            {currentLang === 'am' ? 'ማብራሪያና ዝርዝር' : 'Overview & Details'}
          </button>

          {isMezmur && mezmur?.lyrics && (
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'lyrics'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-parchment-400 hover:text-parchment-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.lyrics}</span>
            </button>
          )}

          {relatedItems.length > 0 && (
            <button
              onClick={() => setActiveTab('related')}
              className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'related'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-parchment-400 hover:text-parchment-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isMezmur ? t.relatedMezmur : t.relatedFilms} ({relatedItems.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-parchment-400 hover:text-parchment-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.commentsTitle}{commentCount !== null ? ` (${commentCount})` : ''}</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-60 sm:max-h-72 text-left space-y-4 bg-burgundy-950/40">
          
          {/* 1. Overview Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs sm:text-sm text-parchment-200/90 leading-relaxed">
              {secondaryTitle && secondaryTitle !== title && (
                <p className="text-xs text-gold-400/90 italic font-serif">
                  {secondaryTitle}
                </p>
              )}

              <p className="whitespace-pre-line">
                {description || (currentLang === 'am' ? 'የተሟላ ማብራሪያ አልተካተተም።' : 'No extended description available.')}
              </p>

              {film && film.actors && film.actors.length > 0 && (
                <div className="p-3 bg-burgundy-950/80 rounded-xl border border-gold-500/20 space-y-1">
                  <span className="font-bold text-gold-400">{t.actors}:</span>
                  <p className="text-xs text-parchment-300">{film.actors.join(', ')}</p>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-parchment-300">
                <span className="bg-burgundy-900/80 px-2.5 py-1 rounded-lg border border-gold-500/20">
                  {t.year}: <strong className="text-parchment-100">{media.year}</strong>
                </span>
                <span className="bg-burgundy-900/80 px-2.5 py-1 rounded-lg border border-gold-500/20">
                  {t.language}: <strong className="text-parchment-100">{media.language}</strong>
                </span>
                <span className="bg-burgundy-900/80 px-2.5 py-1 rounded-lg border border-gold-500/20">
                  {t.views}: <strong className="text-parchment-100">{media.views?.toLocaleString()}</strong>
                </span>
                {media.sourceChannel && (
                  <span className="bg-burgundy-900/80 px-2.5 py-1 rounded-lg border border-gold-500/20">
                    {t.sourceChannel}: <strong className="text-parchment-100">{media.sourceChannel}</strong>
                  </span>
                )}
                <a
                  href={directYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-950/60 hover:bg-red-900/80 px-2.5 py-1 rounded-lg border border-red-500/40 text-red-200 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-red-400" />
                  <span>{t.watchOnYoutubeDirect}</span>
                </a>
              </div>
            </div>
          )}

          {/* 2. Lyrics Tab */}
          {activeTab === 'lyrics' && mezmur?.lyrics && (
            <div className="space-y-3">
              <div className="p-4 bg-burgundy-950/90 rounded-xl border border-gold-500/30 text-parchment-100 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {mezmur.lyrics}
              </div>
            </div>
          )}

          {/* Comments Tab (kept mounted so the count stays accurate) */}
          <div className={activeTab === 'comments' ? '' : 'hidden'}>
            <CommentsSection
              mediaType={type}
              mediaId={media.id}
              currentLang={currentLang}
              onCountChange={setCommentCount}
            />
          </div>

          {/* 3. Related Items Tab */}
          {activeTab === 'related' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectRelated && onSelectRelated(item)}
                  className="flex items-center gap-3 p-2.5 bg-burgundy-950/80 hover:bg-burgundy-900/90 border border-gold-500/30 rounded-xl transition-all cursor-pointer group"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-16 h-12 object-cover rounded-lg border border-gold-500/30 flex-shrink-0"
                  />
                  <div className="overflow-hidden flex-1 text-left">
                    <p className="font-serif font-bold text-xs text-parchment-100 group-hover:text-gold-300 truncate">
                      {currentLang === 'am' ? item.titleAmharic : item.titleEnglish}
                    </p>
                    <p className="text-[11px] text-gold-400/90 truncate">
                      {isMezmur ? (item as Mezmur).singer : (item as SpiritualFilm).director}
                    </p>
                  </div>
                  <Play className="w-4 h-4 text-gold-400 opacity-70 group-hover:opacity-100 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
