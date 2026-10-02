// src/admin/AdminApp.tsx — the admin dashboard at /admin (loaded only when someone opens /admin).
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  LayoutDashboard, Music2, Film, Users, MessageSquare, Settings, ExternalLink, LogOut, Menu, X, Shield, AlertCircle, Check
} from 'lucide-react';
import { CategoryInfo, Language, Mezmur, SpiritualFilm } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import EthiopianCross from '../components/EthiopianCross';
import { adminStrings, AdminStrings } from './strings';
import OverviewPage from './OverviewPage';
import CatalogPage from './CatalogPage';
import SettingsPage from './SettingsPage';
import { AdminUsersPane, AdminCommentsPane } from '../components/AdminCommunity';

// ---------- Shared admin state ----------

interface AdminContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  s: AdminStrings;
  navigate: (path: string) => void;
  notify: (message: string, kind?: 'ok' | 'error') => void;
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  categories: CategoryInfo[];
  reloadCatalog: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminApp>');
  return ctx;
}

const NAV = [
  { path: '/admin', key: 'navOverview', icon: LayoutDashboard },
  { path: '/admin/mezmur', key: 'navMezmur', icon: Music2 },
  { path: '/admin/films', key: 'navFilms', icon: Film },
  { path: '/admin/users', key: 'navUsers', icon: Users },
  { path: '/admin/comments', key: 'navComments', icon: MessageSquare },
  { path: '/admin/settings', key: 'navSettings', icon: Settings }
] as const;

function readLang(): Language {
  try {
    return localStorage.getItem('zemahub_lang') === 'am' ? 'am' : 'en';
  } catch {
    return 'en';
  }
}

export default function AdminApp() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [lang, setLangState] = useState<Language>(readLang);
  const [path, setPath] = useState(window.location.pathname.replace(/\/+$/, '') || '/admin');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'ok' | 'error' } | null>(null);
  const [mezmurs, setMezmurs] = useState<Mezmur[]>([]);
  const [films, setFilms] = useState<SpiritualFilm[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const s = adminStrings[lang];

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem('zemahub_lang', next);
    } catch {}
  };

  const navigate = useCallback((next: string) => {
    window.history.pushState(null, '', next);
    setPath(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname.replace(/\/+$/, '') || '/admin');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.title = `${s.dashboard} — ZemaHub`;
  }, [s.dashboard]);

  const notify = useCallback((message: string, kind: 'ok' | 'error' = 'ok') => {
    setToast({ message, kind });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const reloadCatalog = useCallback(async () => {
    const [m, f, c] = await Promise.all([
      api<{ mezmurs: Mezmur[] }>('/api/mezmur'),
      api<{ films: SpiritualFilm[] }>('/api/films'),
      api<CategoryInfo[]>('/api/categories')
    ]);
    setMezmurs(m.mezmurs);
    setFilms(f.films);
    setCategories(c);
  }, []);

  useEffect(() => {
    if (isAdmin) reloadCatalog().catch((err) => notify(err.message, 'error'));
  }, [isAdmin, reloadCatalog, notify]);

  if (loading) {
    return <FullScreenMessage>{s.loading}</FullScreenMessage>;
  }
  if (!user) {
    return <AdminSignIn s={s} />;
  }
  if (!isAdmin) {
    return (
      <FullScreenMessage>
        <div className="max-w-sm text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-950/60 border border-rose-600/40 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-rose-300" />
          </div>
          <h1 className="font-serif font-bold text-xl text-gold-300">{s.accessDenied}</h1>
          <p className="text-sm text-parchment-300">{s.accessDeniedDesc}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={logout} className="px-4 py-2 rounded-xl bg-gold-500 text-burgundy-950 font-bold text-sm cursor-pointer">
              {s.useOtherAccount}
            </button>
            <a href="/" className="px-4 py-2 rounded-xl border border-gold-500/40 text-gold-300 text-sm">
              {s.backToSite}
            </a>
          </div>
        </div>
      </FullScreenMessage>
    );
  }

  const page = (() => {
    switch (path) {
      case '/admin/mezmur':
        return <CatalogPage kind="mezmur" />;
      case '/admin/films':
        return <CatalogPage kind="film" />;
      case '/admin/users':
        return <AdminUsersPane currentLang={lang} />;
      case '/admin/comments':
        return <AdminCommentsPane currentLang={lang} />;
      case '/admin/settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  })();
  const current = NAV.find((n) => n.path === path) ?? NAV[0];

  const sidebar = (
    <nav className="flex flex-col h-full">
      <a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }} className="flex items-center gap-3 px-5 h-16 border-b border-gold-500/20">
        <EthiopianCross size={26} className="text-gold-400" />
        <div className="leading-tight">
          <div className="font-serif font-bold text-gold-400">ZemaHub</div>
          <div className="text-[10px] uppercase tracking-widest text-parchment-400">Admin</div>
        </div>
      </a>
      <div className="flex-1 p-3 space-y-1">
        {NAV.map(({ path: p, key, icon: Icon }) => {
          const active = p === current.path;
          return (
            <a
              key={p}
              href={p}
              onClick={(e) => {
                e.preventDefault();
                navigate(p);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-gold-500 text-burgundy-950 font-bold' : 'text-parchment-200 hover:bg-burgundy-900/80 hover:text-gold-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{s[key]}</span>
            </a>
          );
        })}
      </div>
      <div className="p-3 border-t border-gold-500/20 space-y-1">
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-parchment-300 hover:bg-burgundy-900/80">
          <ExternalLink className="w-4 h-4" />
          <span>{s.backToSite}</span>
        </a>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-300 hover:bg-burgundy-900/80 cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>{s.signOut}</span>
        </button>
      </div>
    </nav>
  );

  return (
    <AdminContext.Provider value={{ lang, setLang, s, navigate, notify, mezmurs, films, categories, reloadCatalog }}>
      <div className="min-h-screen bg-[#16030A] text-parchment-100 font-sans text-left">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-[#1E040A] border-r border-gold-500/20">{sidebar}</aside>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-64 bg-[#1E040A] border-r border-gold-500/20">{sidebar}</aside>
          </div>
        )}

        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-[#16030A]/95 backdrop-blur border-b border-gold-500/20">
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg border border-gold-500/30 text-gold-300 cursor-pointer" aria-label="Menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="flex-1 font-serif font-bold text-lg text-parchment-50 truncate">{s[current.key]}</h1>
            <div className="flex rounded-lg border border-gold-500/30 overflow-hidden text-xs font-bold">
              {(['en', 'am'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1.5 cursor-pointer ${lang === l ? 'bg-gold-500 text-burgundy-950' : 'text-gold-300'}`}>
                  {l === 'en' ? 'EN' : 'አማ'}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gold-500/20">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-burgundy-950 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-parchment-100 max-w-[140px] truncate">{user.name}</div>
                <div className="text-[10px] text-parchment-400 max-w-[140px] truncate">{user.email}</div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">{page}</main>
        </div>

        {toast && (
          <div
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
              toast.kind === 'ok' ? 'bg-emerald-950 border-emerald-500/40 text-emerald-200' : 'bg-rose-950 border-rose-500/40 text-rose-200'
            }`}
          >
            {toast.kind === 'ok' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </AdminContext.Provider>
  );
}

function FullScreenMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#16030A] text-parchment-200 flex items-center justify-center p-6 font-sans">{children}</div>
  );
}

function AdminSignIn({ s }: { s: AdminStrings }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    'w-full bg-[#120205] border border-gold-500/40 rounded-xl px-4 py-3 text-sm text-parchment-100 focus:outline-none focus:border-gold-400';

  return (
    <FullScreenMessage>
      <form onSubmit={submit} className="w-full max-w-sm bg-[#1E040A] border border-gold-500/40 rounded-2xl p-7 space-y-4 shadow-2xl">
        <div className="text-center space-y-2">
          <EthiopianCross size={36} className="text-gold-400 mx-auto" />
          <h1 className="font-serif font-bold text-xl text-gold-300">{s.signInTitle}</h1>
          <p className="text-xs text-parchment-400">{s.signInSubtitle}</p>
        </div>
        <label className="block space-y-1">
          <span className="text-[11px] text-parchment-300">{s.email}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" required />
        </label>
        <label className="block space-y-1">
          <span className="text-[11px] text-parchment-300">{s.password}</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} autoComplete="current-password" required />
        </label>
        {error && <p className="text-xs text-rose-300">{error}</p>}
        <button disabled={submitting} className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-burgundy-950 font-bold text-sm cursor-pointer">
          {submitting ? s.pleaseWait : s.signIn}
        </button>
        <a href="/" className="block text-center text-xs text-gold-400 hover:text-gold-300">
          ← {s.backToSite}
        </a>
      </form>
    </FullScreenMessage>
  );
}
