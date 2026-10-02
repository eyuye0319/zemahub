// src/components/AdminPanel.tsx
import React, { useState } from 'react';
import { 
  Shield, X, Plus, Edit, Trash2, Check, RefreshCw, Music2, Film, Lock, AlertCircle, Eye, Sparkles, Users, MessageSquare 
} from 'lucide-react';
import { Mezmur, SpiritualFilm, CategoryInfo, Language, PlatformStats } from '../types';
import { translations } from '../i18n/translations';
import EthiopianCross from './EthiopianCross';
import { useAuth } from '../context/AuthContext';
import { AdminUsersPane, AdminCommentsPane } from './AdminCommunity';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  categories: CategoryInfo[];
  stats: PlatformStats;
  onAddMezmur: (data: any) => Promise<void>;
  onUpdateMezmur: (id: string, data: any) => Promise<void>;
  onDeleteMezmur: (id: string) => Promise<void>;
  onAddFilm: (data: any) => Promise<void>;
  onUpdateFilm: (id: string, data: any) => Promise<void>;
  onDeleteFilm: (id: string) => Promise<void>;
  onResetCatalog: () => Promise<void>;
}

export default function AdminPanel({
  isOpen,
  onClose,
  currentLang,
  mezmurs,
  films,
  categories,
  stats,
  onAddMezmur,
  onUpdateMezmur,
  onDeleteMezmur,
  onAddFilm,
  onUpdateFilm,
  onDeleteFilm,
  onResetCatalog
}: AdminPanelProps) {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'mezmur' | 'films' | 'users' | 'comments' | 'stats'>('mezmur');
  
  // Mezmur form state
  const [editingMezmurId, setEditingMezmurId] = useState<string | null>(null);
  const [mezmurForm, setMezmurForm] = useState({
    titleAmharic: '',
    titleEnglish: '',
    singerAmharic: '',
    singerEnglish: '',
    year: new Date().getFullYear(),
    language: 'Amharic',
    category: 'mariam',
    youtubeVideoId: '',
    thumbnailUrl: '',
    descriptionAmharic: '',
    descriptionEnglish: '',
    lyrics: '',
    duration: '6:00',
    featured: false
  });

  // Film form state
  const [editingFilmId, setEditingFilmId] = useState<string | null>(null);
  const [filmForm, setFilmForm] = useState({
    titleAmharic: '',
    titleEnglish: '',
    directorAmharic: '',
    directorEnglish: '',
    actors: '',
    year: new Date().getFullYear(),
    duration: '1h 45m',
    language: 'Amharic',
    category: 'saint_films',
    youtubeVideoId: '',
    thumbnailUrl: '',
    descriptionAmharic: '',
    descriptionEnglish: '',
    featured: false
  });

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const t = translations[currentLang];

  const handleEditMezmurClick = (m: Mezmur) => {
    setEditingMezmurId(m.id);
    setMezmurForm({
      titleAmharic: m.titleAmharic,
      titleEnglish: m.titleEnglish,
      singerAmharic: m.singerAmharic,
      singerEnglish: m.singerEnglish,
      year: m.year,
      language: m.language,
      category: m.category,
      youtubeVideoId: m.youtubeVideoId,
      thumbnailUrl: m.thumbnailUrl,
      descriptionAmharic: m.descriptionAmharic,
      descriptionEnglish: m.descriptionEnglish,
      lyrics: m.lyrics || '',
      duration: m.duration || '5:00',
      featured: Boolean(m.featured)
    });
  };

  const handleResetMezmurForm = () => {
    setEditingMezmurId(null);
    setMezmurForm({
      titleAmharic: '',
      titleEnglish: '',
      singerAmharic: '',
      singerEnglish: '',
      year: new Date().getFullYear(),
      language: 'Amharic',
      category: 'mariam',
      youtubeVideoId: '',
      thumbnailUrl: '',
      descriptionAmharic: '',
      descriptionEnglish: '',
      lyrics: '',
      duration: '5:30',
      featured: false
    });
  };

  const handleSaveMezmur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mezmurForm.titleAmharic || !mezmurForm.youtubeVideoId) {
      alert('Please provide Title (Amharic) and YouTube Video ID');
      return;
    }
    setSaving(true);
    try {
      if (editingMezmurId) {
        await onUpdateMezmur(editingMezmurId, mezmurForm);
        setNotification('Mezmur updated successfully');
      } else {
        await onAddMezmur(mezmurForm);
        setNotification('New Mezmur added successfully');
      }
      handleResetMezmurForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleEditFilmClick = (f: SpiritualFilm) => {
    setEditingFilmId(f.id);
    setFilmForm({
      titleAmharic: f.titleAmharic,
      titleEnglish: f.titleEnglish,
      directorAmharic: f.directorAmharic,
      directorEnglish: f.directorEnglish,
      actors: f.actors.join(', '),
      year: f.year,
      duration: f.duration,
      language: f.language,
      category: f.category,
      youtubeVideoId: f.youtubeVideoId,
      thumbnailUrl: f.thumbnailUrl,
      descriptionAmharic: f.descriptionAmharic,
      descriptionEnglish: f.descriptionEnglish,
      featured: Boolean(f.featured)
    });
  };

  const handleResetFilmForm = () => {
    setEditingFilmId(null);
    setFilmForm({
      titleAmharic: '',
      titleEnglish: '',
      directorAmharic: '',
      directorEnglish: '',
      actors: '',
      year: new Date().getFullYear(),
      duration: '1h 30m',
      language: 'Amharic',
      category: 'saint_films',
      youtubeVideoId: '',
      thumbnailUrl: '',
      descriptionAmharic: '',
      descriptionEnglish: '',
      featured: false
    });
  };

  const handleSaveFilm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filmForm.titleAmharic || !filmForm.youtubeVideoId) {
      alert('Please provide Title (Amharic) and YouTube Video ID');
      return;
    }
    setSaving(true);
    try {
      if (editingFilmId) {
        await onUpdateFilm(editingFilmId, filmForm);
        setNotification('Film updated successfully');
      } else {
        await onAddFilm(filmForm);
        setNotification('New Film added successfully');
      }
      handleResetFilmForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#1A0409] text-parchment-100 rounded-2xl border border-gold-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-burgundy-950/90 border-b border-gold-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gold-300">
                {t.adminTitle}
              </h3>
              <p className="text-xs text-parchment-300/80">
                {t.adminSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-parchment-300 hover:text-rose-400 hover:bg-burgundy-900/60 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-burgundy-950 border border-gold-500/40 flex items-center justify-center mx-auto text-gold-400 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <p className="text-sm text-parchment-300">
              {currentLang === 'am' ? 'ይህ ገጽ ለአስተዳዳሪዎች ብቻ ነው። እባክዎ በአስተዳዳሪ መለያ ይግቡ።' : 'This area is for administrators only. Please sign in with an admin account.'}
            </p>
          </div>
        ) : (
          /* Admin Dashboard CRUD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="flex overflow-x-auto whitespace-nowrap border-b border-gold-500/20 bg-burgundy-950/70 px-4 sm:px-6 gap-2">
              <button
                onClick={() => setActiveTab('mezmur')}
                className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'mezmur'
                    ? 'border-gold-400 text-gold-300'
                    : 'border-transparent text-parchment-400 hover:text-parchment-200'
                }`}
              >
                <Music2 className="w-4 h-4" />
                <span>{t.adminTabMezmur} ({mezmurs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('films')}
                className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'films'
                    ? 'border-gold-400 text-gold-300'
                    : 'border-transparent text-parchment-400 hover:text-parchment-200'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>{t.adminTabFilms} ({films.length})</span>
              </button>

              {([
                ['users', Users, t.adminTabUsers],
                ['comments', MessageSquare, t.adminTabComments]
              ] as const).map(([tab, Icon, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === tab
                      ? 'border-gold-400 text-gold-300'
                      : 'border-transparent text-parchment-400 hover:text-parchment-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}

              <button
                onClick={() => setActiveTab('stats')}
                className={`py-3 px-4 text-xs sm:text-sm font-serif font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'stats'
                    ? 'border-gold-400 text-gold-300'
                    : 'border-transparent text-parchment-400 hover:text-parchment-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.adminTabStats}</span>
              </button>
            </div>

            {notification && (
              <div className="bg-emerald-900/90 text-emerald-100 px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b border-emerald-500/40">
                <Check className="w-4 h-4" />
                <span>{notification}</span>
              </div>
            )}

            {/* Tab Panes */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* 1. MEZMUR CRUD */}
              {activeTab === 'mezmur' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="lg:col-span-5 bg-burgundy-950/80 p-5 rounded-2xl border border-gold-500/30 space-y-4">
                    <h4 className="font-serif font-bold text-sm text-gold-400 flex items-center justify-between">
                      <span>{editingMezmurId ? t.adminEdit : t.adminAddMezmur}</span>
                      {editingMezmurId && (
                        <button
                          type="button"
                          onClick={handleResetMezmurForm}
                          className="text-xs text-parchment-300 hover:text-white underline cursor-pointer"
                        >
                          {t.adminCancel}
                        </button>
                      )}
                    </h4>

                    <form onSubmit={handleSaveMezmur} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminAmharicTitle} *
                        </label>
                        <input
                          type="text"
                          value={mezmurForm.titleAmharic}
                          onChange={(e) => setMezmurForm({ ...mezmurForm, titleAmharic: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="ምሳሌ፦ እመቤቴ ማርያም"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminEnglishTitle}
                        </label>
                        <input
                          type="text"
                          value={mezmurForm.titleEnglish}
                          onChange={(e) => setMezmurForm({ ...mezmurForm, titleEnglish: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="e.g. Emebete Mariam"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">
                            {t.adminAmharicSinger}
                          </label>
                          <input
                            type="text"
                            value={mezmurForm.singerAmharic}
                            onChange={(e) => setMezmurForm({ ...mezmurForm, singerAmharic: e.target.value })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                            placeholder="ዲ/ን ይልማ ኃይሉ"
                          />
                        </div>
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">
                            {t.adminEnglishSinger}
                          </label>
                          <input
                            type="text"
                            value={mezmurForm.singerEnglish}
                            onChange={(e) => setMezmurForm({ ...mezmurForm, singerEnglish: e.target.value })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                            placeholder="Dn. Yilma Hailu"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">{t.year}</label>
                          <input
                            type="number"
                            value={mezmurForm.year}
                            onChange={(e) => setMezmurForm({ ...mezmurForm, year: Number(e.target.value) })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          />
                        </div>
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">{t.language}</label>
                          <select
                            value={mezmurForm.language}
                            onChange={(e) => setMezmurForm({ ...mezmurForm, language: e.target.value as any })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          >
                            <option value="Amharic">Amharic</option>
                            <option value="English">English</option>
                            <option value="Ge'ez">Ge'ez</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">{t.duration}</label>
                          <input
                            type="text"
                            value={mezmurForm.duration}
                            onChange={(e) => setMezmurForm({ ...mezmurForm, duration: e.target.value })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                            placeholder="5:30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">{t.category}</label>
                        <select
                          value={mezmurForm.category}
                          onChange={(e) => setMezmurForm({ ...mezmurForm, category: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                        >
                          {categories.filter(c => c.type === 'mezmur' || c.type === 'both').map(c => (
                            <option key={c.id} value={c.id}>
                              {currentLang === 'am' ? c.nameAmharic : c.nameEnglish}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminYoutubeId} *
                        </label>
                        <input
                          type="text"
                          value={mezmurForm.youtubeVideoId}
                          onChange={(e) => setMezmurForm({ ...mezmurForm, youtubeVideoId: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="e.g. f0gCvhc5qgQ"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminLyricsLabel}
                        </label>
                        <textarea
                          rows={3}
                          value={mezmurForm.lyrics}
                          onChange={(e) => setMezmurForm({ ...mezmurForm, lyrics: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="የመዝሙር ስንኞች..."
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="mezmur-featured"
                          checked={mezmurForm.featured}
                          onChange={(e) => setMezmurForm({ ...mezmurForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-gold-500 bg-[#120205] border-gold-500/40"
                        />
                        <label htmlFor="mezmur-featured" className="text-parchment-300">
                          {currentLang === 'am' ? 'በዋና ገጽ ላይ ይደምቅ (Featured)' : 'Feature on homepage'}
                        </label>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-serif font-bold rounded-lg transition-all cursor-pointer"
                        >
                          {saving ? 'Saving...' : (editingMezmurId ? t.adminSave : t.adminAddMezmur)}
                        </button>
                        {editingMezmurId && (
                          <button
                            type="button"
                            onClick={handleResetMezmurForm}
                            className="px-4 py-2.5 bg-burgundy-900 text-parchment-300 hover:text-white rounded-lg cursor-pointer"
                          >
                            {t.adminCancel}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-gold-400">
                      {currentLang === 'am' ? 'የመዝሙራት ካታሎግ' : 'Mezmur Catalog'} ({mezmurs.length})
                    </h4>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {mezmurs.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 bg-burgundy-950/70 border border-gold-500/20 rounded-xl flex items-center justify-between gap-3"
                        >
                          <img
                            src={m.thumbnailUrl}
                            alt={m.title}
                            className="w-14 h-10 object-cover rounded-lg border border-gold-500/30"
                          />
                          <div className="flex-1 overflow-hidden">
                            <p className="font-serif font-bold text-xs text-parchment-100 truncate">
                              {m.titleAmharic}
                            </p>
                            <p className="text-[11px] text-parchment-400 truncate">
                              {m.singerAmharic} • {m.year} • {m.categoryAmharic}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditMezmurClick(m)}
                              className="p-1.5 rounded bg-burgundy-900 hover:bg-gold-500 hover:text-burgundy-950 text-gold-400 transition-all cursor-pointer"
                              title={t.adminEdit}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this Mezmur?')) {
                                  onDeleteMezmur(m.id);
                                }
                              }}
                              className="p-1.5 rounded bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white transition-all cursor-pointer"
                              title={t.adminDelete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* 2. FILMS CRUD */}
              {activeTab === 'films' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Form */}
                  <div className="lg:col-span-5 bg-burgundy-950/80 p-5 rounded-2xl border border-gold-500/30 space-y-4">
                    <h4 className="font-serif font-bold text-sm text-gold-400 flex items-center justify-between">
                      <span>{editingFilmId ? t.adminEdit : t.adminAddFilm}</span>
                      {editingFilmId && (
                        <button
                          type="button"
                          onClick={handleResetFilmForm}
                          className="text-xs text-parchment-300 hover:text-white underline cursor-pointer"
                        >
                          {t.adminCancel}
                        </button>
                      )}
                    </h4>

                    <form onSubmit={handleSaveFilm} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminAmharicTitle} *
                        </label>
                        <input
                          type="text"
                          value={filmForm.titleAmharic}
                          onChange={(e) => setFilmForm({ ...filmForm, titleAmharic: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="ምሳሌ፦ ሰማዕቲቷ ቅድስት አርሴማ"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminEnglishTitle}
                        </label>
                        <input
                          type="text"
                          value={filmForm.titleEnglish}
                          onChange={(e) => setFilmForm({ ...filmForm, titleEnglish: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="e.g. Saint Arsema"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">
                            {t.adminAmharicDirector}
                          </label>
                          <input
                            type="text"
                            value={filmForm.directorAmharic}
                            onChange={(e) => setFilmForm({ ...filmForm, directorAmharic: e.target.value })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          />
                        </div>
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">
                            {t.adminEnglishDirector}
                          </label>
                          <input
                            type="text"
                            value={filmForm.directorEnglish}
                            onChange={(e) => setFilmForm({ ...filmForm, directorEnglish: e.target.value })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">{t.actors} (Comma separated)</label>
                        <input
                          type="text"
                          value={filmForm.actors}
                          onChange={(e) => setFilmForm({ ...filmForm, actors: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="ተዋንያን በኮማ ተለይተው..."
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">{t.year}</label>
                          <input
                            type="number"
                            value={filmForm.year}
                            onChange={(e) => setFilmForm({ ...filmForm, year: Number(e.target.value) })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          />
                        </div>
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">{t.language}</label>
                          <select
                            value={filmForm.language}
                            onChange={(e) => setFilmForm({ ...filmForm, language: e.target.value as any })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          >
                            <option value="Amharic">Amharic</option>
                            <option value="English">English</option>
                            <option value="Ge'ez">Ge'ez</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-parchment-300 font-medium mb-1">{t.duration}</label>
                          <input
                            type="text"
                            value={filmForm.duration}
                            onChange={(e) => setFilmForm({ ...filmForm, duration: e.target.value })}
                            className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                            placeholder="1h 45m"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">{t.category}</label>
                        <select
                          value={filmForm.category}
                          onChange={(e) => setFilmForm({ ...filmForm, category: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                        >
                          {categories.filter(c => c.type === 'film' || c.type === 'both').map(c => (
                            <option key={c.id} value={c.id}>
                              {currentLang === 'am' ? c.nameAmharic : c.nameEnglish}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminYoutubeId} *
                        </label>
                        <input
                          type="text"
                          value={filmForm.youtubeVideoId}
                          onChange={(e) => setFilmForm({ ...filmForm, youtubeVideoId: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="YouTube Video ID"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-parchment-300 font-medium mb-1">
                          {t.adminAmharicDesc}
                        </label>
                        <textarea
                          rows={2}
                          value={filmForm.descriptionAmharic}
                          onChange={(e) => setFilmForm({ ...filmForm, descriptionAmharic: e.target.value })}
                          className="w-full bg-[#120205] border border-gold-500/30 rounded-lg p-2 text-parchment-100"
                          placeholder="የፊልሙ አጭር ታሪክና ማብራሪያ..."
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="film-featured"
                          checked={filmForm.featured}
                          onChange={(e) => setFilmForm({ ...filmForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-gold-500 bg-[#120205] border-gold-500/40"
                        />
                        <label htmlFor="film-featured" className="text-parchment-300">
                          {currentLang === 'am' ? 'በዋና ገጽ ላይ ይደምቅ (Featured)' : 'Feature on homepage'}
                        </label>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-serif font-bold rounded-lg transition-all cursor-pointer"
                        >
                          {saving ? 'Saving...' : (editingFilmId ? t.adminSave : t.adminAddFilm)}
                        </button>
                        {editingFilmId && (
                          <button
                            type="button"
                            onClick={handleResetFilmForm}
                            className="px-4 py-2.5 bg-burgundy-900 text-parchment-300 hover:text-white rounded-lg cursor-pointer"
                          >
                            {t.adminCancel}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-gold-400">
                      {currentLang === 'am' ? 'የፊልሞች ካታሎግ' : 'Films Catalog'} ({films.length})
                    </h4>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {films.map((f) => (
                        <div
                          key={f.id}
                          className="p-3 bg-burgundy-950/70 border border-gold-500/20 rounded-xl flex items-center justify-between gap-3"
                        >
                          <img
                            src={f.thumbnailUrl}
                            alt={f.title}
                            className="w-14 h-10 object-cover rounded-lg border border-gold-500/30"
                          />
                          <div className="flex-1 overflow-hidden">
                            <p className="font-serif font-bold text-xs text-parchment-100 truncate">
                              {f.titleAmharic}
                            </p>
                            <p className="text-[11px] text-parchment-400 truncate">
                              {f.directorAmharic} • {f.year} • {f.duration}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditFilmClick(f)}
                              className="p-1.5 rounded bg-burgundy-900 hover:bg-gold-500 hover:text-burgundy-950 text-gold-400 transition-all cursor-pointer"
                              title={t.adminEdit}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this Film?')) {
                                  onDeleteFilm(f.id);
                                }
                              }}
                              className="p-1.5 rounded bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white transition-all cursor-pointer"
                              title={t.adminDelete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'users' && <AdminUsersPane currentLang={currentLang} />}
              {activeTab === 'comments' && <AdminCommentsPane currentLang={currentLang} />}

              {/* 3. STATS & RESET */}
              {activeTab === 'stats' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-burgundy-950/80 rounded-xl border border-gold-500/30">
                      <p className="text-2xl font-serif font-bold text-gold-400">{mezmurs.length}</p>
                      <p className="text-xs text-parchment-300 mt-1">{t.navMezmur}</p>
                    </div>
                    <div className="p-4 bg-burgundy-950/80 rounded-xl border border-gold-500/30">
                      <p className="text-2xl font-serif font-bold text-gold-400">{films.length}</p>
                      <p className="text-xs text-parchment-300 mt-1">{t.navFilms}</p>
                    </div>
                    <div className="p-4 bg-burgundy-950/80 rounded-xl border border-gold-500/30">
                      <p className="text-2xl font-serif font-bold text-gold-400">{categories.length}</p>
                      <p className="text-xs text-parchment-300 mt-1">{t.category}</p>
                    </div>
                    <div className="p-4 bg-burgundy-950/80 rounded-xl border border-gold-500/30">
                      <p className="text-2xl font-serif font-bold text-gold-400">{(stats.totalViews / 1_000_000).toFixed(1)}M</p>
                      <p className="text-xs text-parchment-300 mt-1">{t.views}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-burgundy-950/80 rounded-2xl border border-gold-500/30 space-y-4">
                    <h4 className="font-serif font-bold text-base text-gold-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gold-400" />
                      <span>{currentLang === 'am' ? 'የመረጃ ቋት ዳግም ማስጀመሪያ' : 'Database & Catalog Reset'}</span>
                    </h4>
                    <p className="text-xs text-parchment-300 leading-relaxed">
                      {currentLang === 'am'
                        ? 'ይህ ቁልፍ ሁሉንም መዝሙራትና ፊልሞች ወደ ቀደመው እውነተኛ የማኅደር ይዘት ይመልሳቸዋል።'
                        : 'Reset the catalog to restore all authentic seed mezmurs, spiritual films, and liturgical categories.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all data to authentic default seeds?')) {
                          onResetCatalog();
                          setNotification('Catalog reset to defaults successfully');
                        }
                      }}
                      className="px-5 py-2.5 bg-burgundy-900 hover:bg-burgundy-800 text-gold-300 border border-gold-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{currentLang === 'am' ? 'ወደ መጀመሪያው ይዘት መልስ' : 'Restore Authentic Seed Catalog'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
