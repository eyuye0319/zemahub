// src/components/Footer.tsx
import React from 'react';
import { Heart, Music2, Film, Search, ExternalLink, Globe, Shield, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (tab: string, param?: string) => void;
}

export default function Footer({ currentLang, onLanguageChange, onNavigate }: FooterProps) {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#180307] text-parchment-200 border-t border-gold-600/30 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative Ethiopian manuscript top pattern border */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-burgundy-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-burgundy-900/80">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-burgundy-900 border border-gold-500/50 flex items-center justify-center">
                <EthiopianCross size={22} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-gold-400 tracking-wide">
                  {currentLang === 'am' ? 'ዜማሀብ' : 'ZemaHub'}
                </h3>
                <p className="text-[11px] text-parchment-400 font-sans">
                  {currentLang === 'am' ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መንፈሳዊ ሚዲያ' : 'Ethiopian Orthodox Spiritual Media'}
                </p>
              </div>
            </div>

            <p className="text-xs text-parchment-300/80 leading-relaxed">
              {currentLang === 'am'
                ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን መንፈሳዊ መዝሙራትን፣ የቅዱስ ያሬድን የዜማ ቅርስና መንፈሳዊ ፊልሞችን በአንድ ማዕከል የሚያቀርብ መድረክ።'
                : 'A curated sanctuary for discovering sacred Ethiopian Orthodox mezmurs, St. Yared liturgical hymns, and faith-centered spiritual films.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-gold-400/90 font-serif">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>{t.brandTagline}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-gold-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <EthiopianCross size={14} className="text-gold-500" />
              {currentLang === 'am' ? 'ማሰሻ' : 'Explore Platform'}
            </h4>
            <ul className="space-y-2.5 text-xs text-parchment-300">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>•</span> {t.navHome}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('mezmur')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>•</span> {t.navMezmur}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('films')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>•</span> {t.navFilms}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('search')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>•</span> {t.navSearch}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>•</span> {t.navAbout}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-serif font-bold text-sm text-gold-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <EthiopianCross size={14} className="text-gold-500" />
              {currentLang === 'am' ? 'የመዝሙር ምድቦች' : 'Popular Categories'}
            </h4>
            <ul className="space-y-2.5 text-xs text-parchment-300">
              <li>
                <button 
                  onClick={() => onNavigate('mezmur', 'mariam')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>•</span> {currentLang === 'am' ? 'የእመቤታችን ማርያም መዝሙራት' : 'Saint Mary Hymns (Mariam)'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('mezmur', 'tsige')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>•</span> {currentLang === 'am' ? 'የዘመነ ጽጌ ማኅሌት' : 'Zemene Tsige Hymns'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('mezmur', 'lent_fasika')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>•</span> {currentLang === 'am' ? 'የዐቢይ ጾምና የትንሣኤ መዝሙራት' : 'Great Lent & Pascha'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('films', 'saint_films')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>•</span> {currentLang === 'am' ? 'የቅዱሳን ገድላት ፊልሞች' : 'Lives of the Saints Films'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('mezmur', 'english_hymns')}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>•</span> {currentLang === 'am' ? 'የእንግሊዝኛ መዝሙራት' : 'English Orthodox Hymns'}
                </button>
              </li>
            </ul>
          </div>

          {/* Languages & Sanctuary Notice */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-gold-400 tracking-wider uppercase mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold-500" />
              {currentLang === 'am' ? 'ቋንቋ ይምረጡ' : 'Languages'}
            </h4>

            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('am')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  currentLang === 'am'
                    ? 'bg-gold-500 text-burgundy-950 border-gold-400'
                    : 'bg-burgundy-950/60 text-parchment-300 border-gold-600/40 hover:text-gold-300'
                }`}
              >
                አማርኛ (Amharic)
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-gold-500 text-burgundy-950 border-gold-400'
                    : 'bg-burgundy-950/60 text-parchment-300 border-gold-600/40 hover:text-gold-300'
                }`}
              >
                English
              </button>
            </div>

            <div className="p-3 bg-burgundy-950/80 rounded-xl border border-gold-500/20 text-[11px] text-parchment-400/90 leading-relaxed">
              <p>
                {currentLang === 'am'
                  ? 'ይዘቶቹ በYouTube በይፋዊ ቻናሎች የተስተናገዱ ናቸው። ዜማሀብ የመረጃ ማውጫ ሆኖ ያገለግላል።'
                  : 'All spiritual media linked or embedded via YouTube creators. ZemaHub serves as a non-commercial discovery directory.'}
              </p>
            </div>
          </div>

        </div>

        {/* Developer Credit & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-parchment-400">
          <p>
            © {new Date().getFullYear()} {currentLang === 'am' ? 'ዜማሀብ' : 'ZemaHub'}. {t.allRightsReserved}.
          </p>

          {/* Explicit Developer Attribution */}
          <div className="flex items-center gap-2 bg-[#26060E] px-4 py-2 rounded-xl border border-gold-500/30 text-parchment-200">
            <span>{currentLang === 'am' ? 'የተዘጋጀው በ' : 'Developed by'} <strong className="text-gold-400 font-semibold">Wubgzer Alemayehu</strong></span>
            <span className="text-gold-500/40">•</span>
            <a
              href="https://github.com/eyuye0319"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 underline font-medium flex items-center gap-1 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
