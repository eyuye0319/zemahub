import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from './types';

const strings = {
  am: {
    tabHome: 'መነሻ',
    tabMezmur: 'መዝሙር',
    tabFilms: 'ፊልሞች',
    tabSaved: 'የተወደዱ',
    tabProfile: 'መለያ',

    tagline: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መዝሙሮችና መንፈሳዊ ፊልሞች',
    heroTitle: 'መዝሙሮችንና መንፈሳዊ ፊልሞችን ያግኙ',
    exploreMezmur: 'መዝሙራትን ያስሱ',
    exploreFilms: 'ፊልሞችን ይመልከቱ',
    featuredMezmur: 'የተመረጡ መዝሙራት',
    mostViewed: 'በብዛት የተደመጡ',
    featuredFilms: 'መንፈሳዊ ፊልሞችና ገድላት',
    categories: 'ምድቦች',
    seeAll: 'ሁሉንም ይዩ',
    all: 'ሁሉም',
    searchPlaceholder: 'መዝሙር፣ ዘማሪ ወይም ፊልም ይፈልጉ...',
    noResults: 'ምንም ውጤት አልተገኘም',
    mezmurs: 'መዝሙራት',
    films: 'ፊልሞች',

    loading: 'በመጫን ላይ...',
    wakingServer: 'አገልጋዩ እየተነሳ ነው፤ እስከ አንድ ደቂቃ ሊወስድ ይችላል...',
    retry: 'እንደገና ሞክር',

    about: 'ማብራሪያ',
    lyrics: 'ግጥም',
    comments: 'አስተያየቶች',
    related: 'ተዛማጅ',
    views: 'ዕይታ',
    year: 'ዓመት',
    language: 'ቋንቋ',
    source: 'ምንጭ',
    watchOnYoutube: 'በዩቲዩብ ይመልከቱ',
    share: 'አጋራ',
    save: 'አስቀምጥ',
    saved: 'ተቀምጧል',
    shareMessage: 'በዜማሀብ ይመልከቱ',

    savedEmpty: 'እስካሁን የተወደደ የለም። በልብ ምልክቱ መዝሙሮችንና ፊልሞችን ያስቀምጡ።',

    commentsEmpty: 'እስካሁን አስተያየት የለም። የመጀመሪያው ይሁኑ!',
    commentPlaceholder: 'አስተያየትዎን ይጻፉ...',
    post: 'ላክ',
    signInToComment: 'አስተያየት ለመስጠት ይግቡ',
    delete: 'አጥፋ',
    deleteCommentConfirm: 'ይህን አስተያየት ማጥፋት ይፈልጋሉ?',
    cancel: 'ተው',

    signIn: 'ግባ',
    register: 'ተመዝገብ',
    signInTitle: 'ወደ ዜማሀብ ይግቡ',
    registerTitle: 'አዲስ መለያ ይፍጠሩ',
    authSubtitle: 'አስተያየት ለመስጠትና የተወደዱትን በሁሉም መሣሪያዎችዎ ለማስቀመጥ ይግቡ።',
    name: 'ሙሉ ስም',
    email: 'ኢሜይል',
    password: 'የይለፍ ቃል',
    passwordHint: 'ቢያንስ 6 ፊደላት',
    noAccount: 'መለያ የለዎትም? ይመዝገቡ',
    haveAccount: 'መለያ አለዎት? ይግቡ',
    pleaseWait: 'እባክዎ ይጠብቁ...',
    signOut: 'ውጣ',
    roleAdmin: 'አስተዳዳሪ',
    roleUser: 'ምእመን',
    adminHint: 'መዝሙራትንና ፊልሞችን ለማስተዳደር የዜማሀብ ድረ ገጽን ይጠቀሙ።',
    openWebsite: 'ድረ ገጹን ክፈት',
    changePassword: 'የይለፍ ቃል ቀይር',
    currentPassword: 'የአሁኑ የይለፍ ቃል',
    newPassword: 'አዲስ የይለፍ ቃል',
    passwordChanged: 'የይለፍ ቃልዎ ተቀይሯል።',
    deleteAccount: 'መለያዬን አጥፋ',
    deleteWarning: 'መለያዎ፣ አስተያየቶችዎና የተወደዱ ዝርዝርዎ እስከመጨረሻው ይጠፋሉ። ይህ ሊመለስ አይችልም።',
    deleteConfirmTitle: 'መለያውን እስከመጨረሻው ማጥፋት ይፈልጋሉ?',
    deleteConfirm: 'አዎ፣ አጥፋ',
    privacyPolicy: 'የግላዊነት ፖሊሲ',
    appLanguage: 'የመተግበሪያ ቋንቋ',
    guest: 'እንግዳ',

    justNow: 'አሁን',
    minutesAgo: (n: number) => `ከ${n} ደቂቃ በፊት`,
    hoursAgo: (n: number) => `ከ${n} ሰዓት በፊት`,
    daysAgo: (n: number) => `ከ${n} ቀን በፊት`
  },
  en: {
    tabHome: 'Home',
    tabMezmur: 'Mezmur',
    tabFilms: 'Films',
    tabSaved: 'Saved',
    tabProfile: 'Account',

    tagline: 'Ethiopian Orthodox Tewahedo mezmur & spiritual films',
    heroTitle: 'Discover Orthodox Mezmur & Spiritual Films',
    exploreMezmur: 'Explore Mezmur',
    exploreFilms: 'Watch Films',
    featuredMezmur: 'Featured Mezmur',
    mostViewed: 'Most Viewed',
    featuredFilms: 'Spiritual Films & Lives of Saints',
    categories: 'Categories',
    seeAll: 'See all',
    all: 'All',
    searchPlaceholder: 'Search mezmur, singers or films...',
    noResults: 'No results found',
    mezmurs: 'Mezmurs',
    films: 'Films',

    loading: 'Loading...',
    wakingServer: 'The server is waking up — this can take up to a minute...',
    retry: 'Try again',

    about: 'About',
    lyrics: 'Lyrics',
    comments: 'Comments',
    related: 'Related',
    views: 'Views',
    year: 'Year',
    language: 'Language',
    source: 'Source',
    watchOnYoutube: 'Watch on YouTube',
    share: 'Share',
    save: 'Save',
    saved: 'Saved',
    shareMessage: 'Watch on ZemaHub',

    savedEmpty: 'Nothing saved yet. Tap the heart on any mezmur or film to keep it here.',

    commentsEmpty: 'No comments yet. Be the first to share a reflection!',
    commentPlaceholder: 'Write a comment...',
    post: 'Post',
    signInToComment: 'Sign in to comment',
    delete: 'Delete',
    deleteCommentConfirm: 'Delete this comment?',
    cancel: 'Cancel',

    signIn: 'Sign In',
    register: 'Create Account',
    signInTitle: 'Sign in to ZemaHub',
    registerTitle: 'Create your account',
    authSubtitle: 'Sign in to comment and keep your favorites on all your devices.',
    name: 'Full name',
    email: 'Email',
    password: 'Password',
    passwordHint: 'At least 6 characters',
    noAccount: 'No account yet? Create one',
    haveAccount: 'Already have an account? Sign in',
    pleaseWait: 'Please wait...',
    signOut: 'Sign Out',
    roleAdmin: 'Admin',
    roleUser: 'Member',
    adminHint: 'Use the ZemaHub website to manage mezmurs, films and users.',
    openWebsite: 'Open website',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    passwordChanged: 'Your password has been changed.',
    deleteAccount: 'Delete my account',
    deleteWarning: 'Your account, comments and saved favorites will be permanently deleted. This cannot be undone.',
    deleteConfirmTitle: 'Permanently delete your account?',
    deleteConfirm: 'Yes, delete',
    privacyPolicy: 'Privacy Policy',
    appLanguage: 'App language',
    guest: 'Guest',

    justNow: 'just now',
    minutesAgo: (n: number) => `${n} min ago`,
    hoursAgo: (n: number) => `${n} h ago`,
    daysAgo: (n: number) => `${n} d ago`
  }
};

export type Strings = typeof strings.am;

interface LanguageContextValue {
  lang: Language;
  t: Strings;
  setLang: (lang: Language) => void;
  /** Picks the Amharic or English variant of a bilingual field. */
  pick: (am: string | undefined, en: string | undefined) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANG_KEY = 'zemahub_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('am');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((saved) => {
      if (saved === 'am' || saved === 'en') setLangState(saved);
    });
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    AsyncStorage.setItem(LANG_KEY, next).catch(() => {});
  };

  const pick = (am: string | undefined, en: string | undefined) =>
    (lang === 'am' ? am || en : en || am) || '';

  return (
    <LanguageContext.Provider value={{ lang, t: strings[lang] as Strings, setLang, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

export function timeAgo(iso: string, t: Strings) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return t.justNow;
  if (minutes < 60) return t.minutesAgo(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.hoursAgo(hours);
  return t.daysAgo(Math.floor(hours / 24));
}
