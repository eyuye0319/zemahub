// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Language, Mezmur, SpiritualFilm, CategoryInfo, SingerArtist, PlatformStats 
} from './types';
import { translations } from './i18n/translations';
import { 
  initialCategories, initialMezmurs, initialFilms, initialSingers, initialStats 
} from './db/initial_data';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MediaPlayerModal from './components/MediaPlayerModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { api } from './lib/api';
import HomeView from './pages/HomeView';
import MezmurView from './pages/MezmurView';
import FilmsView from './pages/FilmsView';
import SearchView from './pages/SearchView';
import AboutView from './pages/AboutView';

export default function App() {
  const { user } = useAuth();

  // 1. Language state
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('zemahub_lang');
    return (saved === 'en' || saved === 'am') ? saved : 'am';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('zemahub_lang', lang);
  };

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [navParam, setNavParam] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, param?: string) => {
    setActiveTab(tab);
    setNavParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zemahub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveFavorites = (updated: string[]) => {
    setFavorites(updated);
    try {
      localStorage.setItem('zemahub_favorites', JSON.stringify(updated));
    } catch {}
    if (user) {
      api('/api/me/favorites', { method: 'PUT', body: { favorites: updated } }).catch(() => {});
    }
  };

  const handleToggleFavorite = (id: string) => {
    saveFavorites(favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]);
  };

  // On sign-in, merge favorites saved on this device into the account so they follow the user.
  useEffect(() => {
    if (!user) return;
    api<{ favorites: string[] }>('/api/me/favorites')
      .then(({ favorites: server }) => {
        const merged = [...new Set([...server, ...favorites])];
        if (merged.length !== server.length) {
          saveFavorites(merged);
        } else {
          setFavorites(server);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleClearFavorites = () => {
    saveFavorites([]);
  };

  // 4. Media Player & Modal State
  const [activeMedia, setActiveMedia] = useState<Mezmur | SpiritualFilm | null>(null);
  const [activeMediaType, setActiveMediaType] = useState<'mezmur' | 'film'>('mezmur');
  const [relatedItems, setRelatedItems] = useState<(Mezmur | SpiritualFilm)[]>([]);

  // 5. Drawers / Modals
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 6. Data State
  const [mezmurs, setMezmurs] = useState<Mezmur[]>(initialMezmurs);
  const [films, setFilms] = useState<SpiritualFilm[]>(initialFilms);
  const [categories, setCategories] = useState<CategoryInfo[]>(initialCategories);
  const [singers, setSingers] = useState<SingerArtist[]>(initialSingers);
  const [stats, setStats] = useState<PlatformStats>(initialStats);

  // Fetch live data from backend server
  const loadData = async () => {
    try {
      const [mRes, fRes, cRes, sRes, statsRes] = await Promise.all([
        fetch('/api/mezmur').then(r => r.ok ? r.json() : null),
        fetch('/api/films').then(r => r.ok ? r.json() : null),
        fetch('/api/categories').then(r => r.ok ? r.json() : null),
        fetch('/api/singers').then(r => r.ok ? r.json() : null),
        fetch('/api/stats').then(r => r.ok ? r.json() : null)
      ]);

      if (mRes && mRes.mezmurs) setMezmurs(mRes.mezmurs);
      if (fRes && fRes.films) setFilms(fRes.films);
      if (cRes) setCategories(cRes);
      if (sRes) setSingers(sRes);
      if (statsRes) setStats(statsRes);
      return {
        mezmurs: (mRes?.mezmurs ?? initialMezmurs) as Mezmur[],
        films: (fRes?.films ?? initialFilms) as SpiritualFilm[]
      };
    } catch (err) {
      console.warn('Backend API loaded initial client fallback data.', err);
    }
    return { mezmurs: initialMezmurs, films: initialFilms };
  };

  // Shared links look like /watch/mezmur/<id> (older ones: /?type=mezmur&id=...) — open that item once the catalog has loaded.
  const deepLinkHandled = useRef(false);
  useEffect(() => {
    loadData().then(({ mezmurs: allMezmurs, films: allFilms }) => {
      if (deepLinkHandled.current) return;
      deepLinkHandled.current = true;
      const params = new URLSearchParams(window.location.search);
      const match = window.location.pathname.match(/^\/watch\/(mezmur|film)\/([^/]+)/);
      const type = match ? match[1] : params.get('type');
      const id = match ? decodeURIComponent(match[2]) : params.get('id');
      if (type === 'mezmur') {
        const item = allMezmurs.find(m => m.id === id);
        if (item) openMedia(item, 'mezmur', allMezmurs);
      } else if (type === 'film') {
        const item = allFilms.find(f => f.id === id);
        if (item) openMedia(item, 'film', allFilms);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play handler — also mirrors the open item in the URL so the address bar is shareable.
  const openMedia = (item: Mezmur | SpiritualFilm, type: 'mezmur' | 'film', pool: (Mezmur | SpiritualFilm)[]) => {
    setActiveMedia(item);
    setActiveMediaType(type);
    const rel = type === 'mezmur'
      ? (pool as Mezmur[]).filter(m => m.id !== item.id && (m.category === item.category || m.singer === (item as Mezmur).singer))
      : (pool as SpiritualFilm[]).filter(f => f.id !== item.id && (f.category === item.category || f.director === (item as SpiritualFilm).director));
    setRelatedItems(rel.slice(0, 4));
    window.history.replaceState(null, '', `/watch/${type}/${encodeURIComponent(item.id)}`);
    fetch(`/api/${type === 'mezmur' ? 'mezmur' : 'films'}/${item.id}/view`, { method: 'POST' }).catch(() => {});
  };

  const handleCloseMedia = () => {
    setActiveMedia(null);
    window.history.replaceState(null, '', '/');
  };

  const handlePlayMezmur = (m: Mezmur) => openMedia(m, 'mezmur', mezmurs);
  const handlePlayFilm = (f: SpiritualFilm) => openMedia(f, 'film', films);

  const handleSelectMedia = (item: Mezmur | SpiritualFilm, type: 'mezmur' | 'film') => {
    if (type === 'mezmur') {
      handlePlayMezmur(item as Mezmur);
    } else {
      handlePlayFilm(item as SpiritualFilm);
    }
  };

  // Admin CRUD operations (the server checks the admin session on every call)
  const adminRequest = async (path: string, method: string, body?: unknown) => {
    try {
      await api(path, { method, body });
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
      throw err;
    }
    await loadData();
  };

  const handleAddMezmur = (data: any) => adminRequest('/api/mezmur', 'POST', data);
  const handleUpdateMezmur = (id: string, data: any) => adminRequest(`/api/mezmur/${id}`, 'PUT', data);
  const handleDeleteMezmur = (id: string) => adminRequest(`/api/mezmur/${id}`, 'DELETE');
  const handleAddFilm = (data: any) => adminRequest('/api/films', 'POST', data);
  const handleUpdateFilm = (id: string, data: any) => adminRequest(`/api/films/${id}`, 'PUT', data);
  const handleDeleteFilm = (id: string) => adminRequest(`/api/films/${id}`, 'DELETE');
  const handleResetCatalog = () => adminRequest('/api/admin/reset', 'POST');

  return (
    <div className="min-h-screen bg-parchment-50 text-charcoal-900 font-sans flex flex-col selection:bg-gold-500 selection:text-burgundy-950">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        allMezmurs={mezmurs}
        allFilms={films}
        onSelectMedia={handleSelectMedia}
      />

      {/* 2. Main Page Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            currentLang={currentLang}
            stats={stats}
            mezmurs={mezmurs}
            films={films}
            categories={categories}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onPlayMezmur={handlePlayMezmur}
            onPlayFilm={handlePlayFilm}
            onSelectMezmur={handlePlayMezmur}
            onSelectFilm={handlePlayFilm}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'mezmur' && (
          <MezmurView
            currentLang={currentLang}
            mezmurs={mezmurs}
            categories={categories}
            singers={singers}
            favorites={favorites}
            initialCategory={navParam}
            onToggleFavorite={handleToggleFavorite}
            onPlayMezmur={handlePlayMezmur}
            onSelectMezmur={handlePlayMezmur}
          />
        )}

        {activeTab === 'films' && (
          <FilmsView
            currentLang={currentLang}
            films={films}
            categories={categories}
            favorites={favorites}
            initialCategory={navParam}
            onToggleFavorite={handleToggleFavorite}
            onPlayFilm={handlePlayFilm}
            onSelectFilm={handlePlayFilm}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            currentLang={currentLang}
            mezmurs={mezmurs}
            films={films}
            categories={categories}
            favorites={favorites}
            initialQuery={navParam}
            onToggleFavorite={handleToggleFavorite}
            onPlayMezmur={handlePlayMezmur}
            onPlayFilm={handlePlayFilm}
            onSelectMezmur={handlePlayMezmur}
            onSelectFilm={handlePlayFilm}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            currentLang={currentLang}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
      />

      {/* 4. Media Player Modal */}
      <MediaPlayerModal
        media={activeMedia}
        type={activeMediaType}
        currentLang={currentLang}
        onClose={handleCloseMedia}
        isFavorite={activeMedia ? favorites.includes(activeMedia.id) : false}
        onToggleFavorite={handleToggleFavorite}
        relatedItems={relatedItems}
        onSelectRelated={(item) => handleSelectMedia(item, activeMediaType)}
      />

      {/* 5. Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        allMezmurs={mezmurs}
        allFilms={films}
        currentLang={currentLang}
        onPlayMezmur={handlePlayMezmur}
        onPlayFilm={handlePlayFilm}
        onRemoveFavorite={handleToggleFavorite}
        onClearAll={handleClearFavorites}
      />

      {/* 6. Sign-in / Registration Modal */}
      <AuthModal currentLang={currentLang} />

      {/* 7. Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentLang={currentLang}
        mezmurs={mezmurs}
        films={films}
        categories={categories}
        stats={stats}
        onAddMezmur={handleAddMezmur}
        onUpdateMezmur={handleUpdateMezmur}
        onDeleteMezmur={handleDeleteMezmur}
        onAddFilm={handleAddFilm}
        onUpdateFilm={handleUpdateFilm}
        onDeleteFilm={handleDeleteFilm}
        onResetCatalog={handleResetCatalog}
      />

    </div>
  );
}
