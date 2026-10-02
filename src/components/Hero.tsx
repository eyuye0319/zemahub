// src/components/Hero.tsx
import React from 'react';
import { Music2, Film, Sparkles, ArrowRight } from 'lucide-react';
import { Language, PlatformStats, Mezmur, SpiritualFilm } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';

interface HeroProps {
  currentLang: Language;
  stats: PlatformStats;
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  onExploreMezmur: () => void;
  onExploreFilms: () => void;
}

export default function Hero({ 
  currentLang, 
  stats, 
  mezmurs,
  films,
  onExploreMezmur, 
  onExploreFilms 
}: HeroProps) {
  const t = translations[currentLang];

  // Interleave featured mezmurs and films, then split them into drifting rows.
  const byFeatured = <T extends { featured?: boolean }>(items: T[]) =>
    [...items.filter(i => i.featured), ...items.filter(i => !i.featured)];
  const m = byFeatured(mezmurs);
  const f = byFeatured(films);
  const tiles: { id: string; videoId: string; isFilm: boolean }[] = [];
  for (let i = 0; i < Math.max(m.length, f.length); i++) {
    if (m[i]) tiles.push({ id: m[i].id, videoId: m[i].youtubeVideoId, isFilm: false });
    if (f[i]) tiles.push({ id: f[i].id, videoId: f[i].youtubeVideoId, isFilm: true });
  }
  const ROW_COUNT = 5;
  const rowSize = Math.ceil(tiles.length / ROW_COUNT);
  const rows = Array.from({ length: ROW_COUNT }, (_, r) => r).map(r => tiles.slice(r * rowSize, (r + 1) * rowSize)).filter(r => r.length > 0);

  return (
    <section className="relative bg-[#20050B] text-parchment-100 overflow-hidden border-b border-gold-500/30">
      {/* Drifting wall of real mezmur & film thumbnails */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute -inset-x-24 -top-16 flex flex-col gap-3 sm:gap-4 -rotate-6 opacity-75">
          {/* Rows repeat so the wall also fills the taller mobile hero; extras are clipped on desktop */}
          {[...rows, ...[...rows].reverse()].map((row, r) => (
            <div key={r} className="flex overflow-hidden">
              <div
                className={`hero-marquee flex gap-3 sm:gap-4 pr-3 sm:pr-4 shrink-0 ${r % 2 ? 'hero-marquee-reverse' : ''}`}
                style={{ ['--marquee-duration' as string]: `${110 + r * 25}s` }}
              >
                {[...row, ...row].map((tile, i) => (
                  <div
                    key={`${tile.id}-${i}`}
                    className="relative w-40 sm:w-64 aspect-video shrink-0 rounded-xl overflow-hidden border border-gold-500/25 bg-burgundy-950"
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${tile.videoId}/mqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 p-1 rounded-md bg-black/60 text-gold-300">
                      {tile.isFilm ? <Film className="w-3 h-3" /> : <Music2 className="w-3 h-3" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Burgundy veil + vignette keeps the headline readable */}
        <div className="absolute inset-0 bg-[#20050B]/65"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(32,5,11,0.9)_0%,rgba(32,5,11,0.5)_60%,rgba(32,5,11,0.15)_100%)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#20050B] to-transparent"></div>

        {/* Faint processional cross watermark */}
        <EthiopianCross size={520} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500/[0.06]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        
        {/* Sacred Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-900/90 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-medium mb-6 shadow-md backdrop-blur-xs">
          <EthiopianCross size={15} className="text-gold-400" />
          <span>{t.heroBadge}</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </div>

        {/* Main Hero Headline */}
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-parchment-50 max-w-4xl mx-auto leading-tight sm:leading-snug mb-6">
          <span className="text-gold-400 block sm:inline">{t.brandName}</span> — {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg text-parchment-200/90 max-w-2xl mx-auto leading-relaxed mb-10">
          {t.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onExploreMezmur}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-serif font-bold text-sm sm:text-base shadow-xl hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Music2 className="w-5 h-5 text-burgundy-950" />
            <span>{t.heroBtnMezmur}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreFilms}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-burgundy-900/90 hover:bg-burgundy-800 text-parchment-100 font-serif font-semibold text-sm sm:text-base border border-gold-500/50 hover:border-gold-400 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
          >
            <Film className="w-5 h-5 text-gold-400" />
            <span>{t.heroBtnFilms}</span>
          </button>
        </div>

        {/* Liturgical stats bar */}
        <div className="mt-16 pt-10 border-t border-gold-500/20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-burgundy-950/80 backdrop-blur-sm border border-gold-500/25">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400">
              {stats.totalMezmurs}+
            </div>
            <div className="text-xs text-parchment-300 mt-1 font-medium">
              {t.heroStatMezmurs}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-burgundy-950/80 backdrop-blur-sm border border-gold-500/25">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400">
              {stats.totalFilms}+
            </div>
            <div className="text-xs text-parchment-300 mt-1 font-medium">
              {t.heroStatFilms}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-burgundy-950/80 backdrop-blur-sm border border-gold-500/25">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400">
              {stats.totalSingers}+
            </div>
            <div className="text-xs text-parchment-300 mt-1 font-medium">
              {t.heroStatSingers}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-burgundy-950/80 backdrop-blur-sm border border-gold-500/25 flex flex-col justify-center items-center">
            <div className="flex items-center gap-1.5 text-gold-400 font-serif font-bold text-lg sm:text-xl">
              <EthiopianCross size={18} />
              <span>VI c. A.D.</span>
            </div>
            <div className="text-xs text-parchment-300 mt-1 font-medium text-center">
              {t.heroStatTradition}
            </div>
          </div>
        </div>

      </div>

      {/* Woven tilet border */}
      <div className="relative tilet-band" aria-hidden="true"></div>
    </section>
  );
}
