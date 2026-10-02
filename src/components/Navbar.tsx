// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Shield, Menu, X, Music2, Film, Info, Compass, User, LogOut, ChevronRight, LogIn, UserPlus, KeyRound 
} from 'lucide-react';
import { Language, Mezmur, SpiritualFilm } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onNavigate: (tab: string, param?: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
  allMezmurs?: Mezmur[];
  allFilms?: SpiritualFilm[];
  onSelectMedia?: (item: Mezmur | SpiritualFilm, type: 'mezmur' | 'film') => void;
}

export default function Navbar({
  currentLang,
  onLanguageChange,
  activeTab,
  onNavigate,
  favoritesCount,
  onOpenFavorites,
  onOpenAdmin
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[currentLang];

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  // The ONLY 4 main navigation tabs requested: Home | Mezmur | Spiritual Films | About
  const navLinks = [
    { id: 'home', label: t.navHome, icon: Compass },
    { id: 'mezmur', label: t.navMezmur, icon: Music2 },
    { id: 'films', label: t.navFilms, icon: Film },
    { id: 'about', label: t.navAbout, icon: Info }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#26070E]/95 backdrop-blur-md border-b border-gold-500/30 text-[#FAF7F2] shadow-lg">
      {/* Top sacred ribbon accent */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-burgundy-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: [Logo] and Desktop Nav: Home | Mezmur | Spiritual Films | About */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Logo Brand */}
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group transition-transform hover:scale-[1.02] cursor-pointer shrink-0"
              aria-label="ZemaHub - Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-burgundy-800 to-burgundy-950 border border-gold-500/50 flex items-center justify-center shadow-md group-hover:border-gold-400 transition-colors">
                <EthiopianCross size={24} className="text-gold-400 group-hover:text-gold-300 transition-colors" />
              </div>
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-gold-400">
                ZemaHub
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-serif font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-burgundy-800/90 text-gold-300 border border-gold-500/40 shadow-inner'
                        : 'text-parchment-200 hover:text-gold-300 hover:bg-burgundy-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-parchment-400'}`} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Navigation Items in exact order: EN  አማ  ♡  👤 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 1. Compact Language Toggle: EN | አማ */}
            <div 
              className="flex items-center bg-[#180408] p-1 rounded-xl border border-gold-500/30 text-xs font-serif shadow-xs"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-gold-500 text-burgundy-950 font-bold shadow-xs'
                    : 'text-parchment-300 hover:text-gold-300'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('am')}
                className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  currentLang === 'am'
                    ? 'bg-gold-500 text-burgundy-950 font-bold shadow-xs'
                    : 'text-parchment-300 hover:text-gold-300'
                }`}
                title="አማርኛ"
              >
                አማ
              </button>
            </div>

            {/* 2. Favorites Heart Icon Button [♡] */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-xl bg-burgundy-900/60 border border-gold-500/30 hover:border-gold-400 text-gold-400 hover:text-gold-300 transition-all cursor-pointer"
              title={t.navFavorites}
              aria-label={t.navFavorites}
            >
              <Heart className="w-4 h-4 fill-gold-500/20" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* 3. User / Account Icon Button [👤] with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  userMenuOpen || isAdmin
                    ? 'bg-burgundy-800 text-gold-300 border-gold-400 shadow-md ring-1 ring-gold-400/50'
                    : 'bg-burgundy-900/60 text-gold-400 border-gold-500/30 hover:border-gold-400 hover:text-gold-300'
                }`}
                title={t.userAccount || 'User Account'}
                aria-label={t.userAccount || 'User Account'}
                aria-expanded={userMenuOpen}
              >
                <User className="w-4 h-4" />
                {isAdmin && (
                  <span className="w-2 h-2 rounded-full bg-gold-400 ring-2 ring-burgundy-950 absolute -top-0.5 -right-0.5" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#1E040A] border border-gold-500/40 rounded-2xl shadow-2xl z-50 p-4 text-parchment-100 backdrop-blur-xl animate-in fade-in duration-150 space-y-3.5">
                  
                  {/* Account Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gold-500/20">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border text-base font-serif font-bold shadow-md shrink-0 ${
                      isAdmin 
                        ? 'bg-gold-500 text-burgundy-950 border-gold-300' 
                        : 'bg-burgundy-900 text-gold-400 border-gold-500/40'
                    }`}>
                      {isAdmin ? <Shield className="w-5 h-5 text-burgundy-950" /> : <User className="w-5 h-5 text-gold-400" />}
                    </div>
                    
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-sm text-parchment-50 truncate">
                          {user ? user.name : (currentLang === 'am' ? 'እንግዳ' : 'Guest')}
                        </span>
                      </div>
                      
                      {user && <p className="text-[11px] text-parchment-400 truncate">{user.email}</p>}
                      <div className="mt-1">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-serif font-bold bg-gold-500/20 text-gold-300 border border-gold-400/40">
                            <Shield className="w-3 h-3 text-gold-400" />
                            <span>{t.userRoleAdmin}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-serif font-medium bg-burgundy-900/80 text-parchment-300 border border-gold-500/20">
                            <User className="w-3 h-3 text-parchment-400" />
                            <span>{t.userRolePilgrim}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADMIN SECTION: Prominent Admin Dashboard Button if logged-in user is admin */}
                  {isAdmin && (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-serif font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg hover:shadow-gold-500/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-4 h-4 text-burgundy-950" />
                          <span>{t.userAdminDashboard}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-burgundy-950 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Standard Account Options */}
                  <div className="space-y-1">
                    {/* Saved Mezmurs & Films */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenFavorites();
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-left hover:bg-burgundy-900/80 transition-all flex items-center justify-between text-xs text-parchment-200 hover:text-gold-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-gold-400" />
                        <span>{t.userFavoritesShortcut}</span>
                      </div>
                      {favoritesCount > 0 && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {favoritesCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Account Access Section */}
                  <div className="pt-2 border-t border-gold-500/20 space-y-1">
                    {user ? (
                      <>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          openAuthModal('password');
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-burgundy-900/80 transition-all flex items-center gap-2 text-xs text-parchment-200 hover:text-gold-300 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-gold-400" />
                        <span>{t.authChangePassword}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-burgundy-900/80 transition-all flex items-center gap-2 text-xs text-rose-300 hover:text-rose-200 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.userSignOut}</span>
                      </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>{t.authSignIn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            openAuthModal('register');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-xs text-gold-400 hover:text-gold-300 hover:bg-burgundy-900/80 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{t.authRegister}</span>
                        </button>
                      </>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-burgundy-900/80 border border-gold-500/30 text-parchment-200 hover:text-gold-300 transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer: Home | Mezmur | Spiritual Films | About */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E0409] border-b border-gold-500/30 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-serif font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-burgundy-800 text-gold-300 font-bold border border-gold-500/40'
                      : 'text-parchment-200 hover:bg-burgundy-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-parchment-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* If admin is active, show Admin Dashboard in mobile menu too */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-serif font-bold text-gold-300 bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-gold-400" />
                <span>{t.userAdminDashboard}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
