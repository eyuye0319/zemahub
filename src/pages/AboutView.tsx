// src/pages/AboutView.tsx
import React from 'react';
import { 
  Heart, Sparkles, BookOpen, Music2, Film, Shield, Globe, ExternalLink, Code2, CheckCircle2 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from '../components/EthiopianCross';

interface AboutViewProps {
  currentLang: Language;
  onNavigate: (tab: string, param?: string) => void;
}

export default function AboutView({ currentLang, onNavigate }: AboutViewProps) {
  const t = translations[currentLang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-burgundy-950 via-[#360914] to-burgundy-950 p-8 sm:p-12 rounded-3xl border border-gold-500/40 text-parchment-100 shadow-xl relative overflow-hidden">
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-900/90 border border-gold-500/30 text-gold-300 text-xs font-serif font-bold">
            <EthiopianCross size={14} className="text-gold-400" />
            <span>{t.navAbout}</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-parchment-50 leading-tight">
            {t.brandName} — {t.aboutTitle}
          </h1>

          <p className="text-sm sm:text-base text-parchment-200/90 leading-relaxed font-sans">
            {t.aboutIntro}
          </p>
        </div>
      </div>

      {/* Core Mission & St. Yared Legacy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* St. Yared Heritage */}
        <div className="bg-white p-8 rounded-3xl border border-parchment-300 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-950 text-gold-400 flex items-center justify-center">
            <EthiopianCross size={24} />
          </div>
          <h2 className="font-serif font-bold text-xl text-burgundy-950">
            {currentLang === 'am' ? 'የቅዱስ ያሬድ የዜማ ቅርስ' : 'Saint Yared Liturgical Heritage'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {currentLang === 'am'
              ? 'በስድስተኛው መቶ ክፍለ ዘመን በቅዱስ ያሬድ የተደረሱት ሦስቱ የዜማ ስልቶች — ግዕዝ፣ ዕዝል እና አራራይ — የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን መንፈሳዊ ማኅሌትና የምስጋና መሠረቶች ናቸው። ዜማሀብ ይህን ታላቅ መንፈሳዊ ቅርስ በዘመናዊ አቀራረብ ያከብራል እንዲሁም ለምእመናን ያደርሳል።'
              : 'Formulated in the 6th century A.D. by Saint Yared of Aksum, the three sacred melodic modes (Ge\'ez, Ezel, and Araray) constitute the musical bedrock of the Ethiopian Orthodox Tewahedo Church. ZemaHub honors and illuminates this venerable liturgical treasure.'}
          </p>
        </div>

        {/* Media Curation & YouTube Foundation */}
        <div className="bg-white p-8 rounded-3xl border border-parchment-300 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-950 text-gold-400 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-xl text-burgundy-950">
            {currentLang === 'am' ? 'መንፈሳዊ ፊልሞችና ይዘት አሰሳ' : 'Spiritual Films & Media Index'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {currentLang === 'am'
              ? 'የቅዱሳን ገድላትና ተጋድሎ፣ የመጽሐፍ ቅዱስ ታሪኮች፣ እና የሃይማኖታዊ ትምህርቶች ፊልሞች በአንድ ማዕከል ተሰባስበው ቀርበዋል። ሁሉም ይዘቶች በYouTube በይፋዊ ፈጣሪዎችና አገልጋዮች የተስተናገዱ ናቸው።'
              : 'Discover curated hagiographical movies, biblical cinematic productions, and spiritual dramatizations from Orthodox filmmakers. All media is officially embedded and linked to YouTube creators.'}
          </p>
        </div>

      </div>

      {/* Principles & Features Grid */}
      <div className="bg-parchment-100/70 p-8 sm:p-10 rounded-3xl border border-parchment-300 space-y-6">
        <h3 className="font-serif font-bold text-xl text-burgundy-950">
          {currentLang === 'am' ? 'የዜማሀብ ቁልፍ መገለጫዎች' : 'Platform Features & Pillars'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-parchment-200 space-y-2">
            <div className="flex items-center gap-2 text-gold-700 font-serif font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>{currentLang === 'am' ? 'ባለሁለት ቋንቋ (Bilingual)' : 'Fully Bilingual'}</span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {currentLang === 'am'
                ? 'ሙሉው ድረ-ገጽ በአማርኛና በእንግሊዝኛ ቋንቋዎች ያለ ምንም እንከን ይሰራል።'
                : 'Native support for both Amharic (አማርኛ) and English across all filters and content.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-parchment-200 space-y-2">
            <div className="flex items-center gap-2 text-gold-700 font-serif font-bold text-sm">
              <Heart className="w-4 h-4" />
              <span>{currentLang === 'am' ? 'የግል ተወዳጆች ማከማቻ' : 'Personal Favorites Library'}</span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {currentLang === 'am'
                ? 'የወደዷቸውን መዝሙራትና ፊልሞች በአንድ ቁልፍ ማስቀመጥና ማጫወት ይችላሉ።'
                : 'Bookmark your favorite mezmurs and films for instant continuous playback.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-parchment-200 space-y-2">
            <div className="flex items-center gap-2 text-gold-700 font-serif font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>{currentLang === 'am' ? 'የይዘት አስተዳደር ማዕከል' : 'Content Management'}</span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {currentLang === 'am'
                ? 'አዳዲስ መዝሙራትንና ፊልሞችን በቀላሉ ለማከልና ለማስተካከል የሚያስችል የአስተዳዳሪ ማዕከል አለው።'
                : 'Integrated administrative tools for adding, editing, and managing sacred media items.'}
            </p>
          </div>

        </div>
      </div>

      {/* Developer Attribution Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#26050C] to-[#170307] p-8 sm:p-10 border border-gold-500/40 text-parchment-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-serif font-bold text-gold-400">
            <Code2 className="w-4 h-4" />
            <span>{currentLang === 'am' ? 'የገንቢው መረጃ' : 'Engineering & Development'}</span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-parchment-50">
            {currentLang === 'am' ? 'የተዘጋጀው በ ዉብግዘር ዓለማየሁ' : 'Developed by Wubgzer Alemayehu'}
          </h3>
          <p className="text-xs text-parchment-300 leading-relaxed">
            {currentLang === 'am'
              ? 'ይህ መድረክ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መንፈሳዊ መዝሙራትንና ፊልሞችን በዓለም ዙሪያ ላሉ ምእመናን ለማድረስ በውብግዘር ዓለማየሁ የተዘጋጀ ነው።'
              : 'Crafted as an open sacred digital directory to celebrate and preserve Ethiopian Orthodox Christian hymns, spiritual films, and liturgical arts.'}
          </p>
        </div>

        <a
          href="https://github.com/eyuye0319"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-serif font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <span>GitHub: @eyuye0319</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
