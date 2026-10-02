// src/admin/CatalogPage.tsx — manage mezmurs or films: searchable table + add/edit drawer.
import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, ExternalLink, Star, X } from 'lucide-react';
import { Mezmur, SpiritualFilm } from '../types';
import { api } from '../lib/api';
import { useAdmin } from './AdminApp';

type Kind = 'mezmur' | 'film';
type Item = Mezmur | SpiritualFilm;

/** Accepts a YouTube link in any common form (watch, youtu.be, shorts, embed) or a bare video ID. */
export function extractYoutubeId(input: string) {
  const value = input.trim();
  const match = value.match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  if (match) return match[1];
  return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : '';
}

const emptyForm = {
  youtube: '',
  titleAmharic: '',
  titleEnglish: '',
  creatorAmharic: '',
  creatorEnglish: '',
  actors: '',
  category: '',
  language: 'Amharic',
  year: new Date().getFullYear(),
  duration: '',
  sourceChannel: '',
  descriptionAmharic: '',
  descriptionEnglish: '',
  lyrics: '',
  featured: false
};
type FormState = typeof emptyForm;

function formFromItem(item: Item, kind: Kind): FormState {
  const film = item as SpiritualFilm;
  const mezmur = item as Mezmur;
  return {
    youtube: item.youtubeVideoId,
    titleAmharic: item.titleAmharic,
    titleEnglish: item.titleEnglish,
    creatorAmharic: kind === 'mezmur' ? mezmur.singerAmharic : film.directorAmharic,
    creatorEnglish: (kind === 'mezmur' ? mezmur.singerEnglish : film.directorEnglish) || '',
    actors: kind === 'film' ? (film.actors || []).join(', ') : '',
    category: item.category,
    language: item.language,
    year: item.year,
    duration: item.duration || '',
    sourceChannel: item.sourceChannel || '',
    descriptionAmharic: item.descriptionAmharic,
    descriptionEnglish: item.descriptionEnglish,
    lyrics: kind === 'mezmur' ? mezmur.lyrics || '' : '',
    featured: Boolean(item.featured)
  };
}

export default function CatalogPage({ kind }: { kind: Kind }) {
  const { s, lang, mezmurs, films, categories, reloadCatalog, notify } = useAdmin();
  const items: Item[] = kind === 'mezmur' ? mezmurs : films;
  const kindCategories = categories.filter((c) => c.type === kind || c.type === 'both');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [editing, setEditing] = useState<Item | 'new' | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (featuredOnly && !item.featured) return false;
      if (!q) return true;
      const creator = kind === 'mezmur' ? `${(item as Mezmur).singerAmharic} ${(item as Mezmur).singerEnglish}` : `${(item as SpiritualFilm).directorAmharic} ${(item as SpiritualFilm).directorEnglish}`;
      return `${item.titleAmharic} ${item.titleEnglish} ${creator} ${item.id} ${item.youtubeVideoId}`.toLowerCase().includes(q);
    });
  }, [items, query, category, featuredOnly, kind]);

  const remove = async (item: Item) => {
    if (!confirm(s.confirmDelete(item.titleAmharic))) return;
    try {
      await api(`/api/${kind === 'mezmur' ? 'mezmur' : 'films'}/${item.id}`, { method: 'DELETE' });
      await reloadCatalog();
      notify(s.deletedOk);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const categoryName = (id: string) => {
    const c = categories.find((x) => x.id === id);
    return c ? (lang === 'am' ? c.nameAmharic : c.nameEnglish) : id;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-parchment-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={s.search}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1E040A] border border-gold-500/30 text-sm focus:outline-none focus:border-gold-400"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#1E040A] border border-gold-500/30 text-sm text-parchment-100"
        >
          <option value="all">{s.allCategories}</option>
          {kindCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {lang === 'am' ? c.nameAmharic : c.nameEnglish}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-parchment-200 px-1 cursor-pointer">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="accent-amber-500" />
          {s.featuredOnly}
        </label>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {kind === 'mezmur' ? s.addMezmur : s.addFilm}
        </button>
      </div>

      <p className="text-xs text-parchment-400">{s.results(visible.length)}</p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gold-500/20 bg-[#1E040A]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-parchment-400 border-b border-gold-500/20">
              <th className="p-3">{s.colTitle}</th>
              <th className="p-3">{kind === 'mezmur' ? s.colSinger : s.colProducer}</th>
              <th className="p-3">{s.colCategory}</th>
              <th className="p-3">{s.colYear}</th>
              <th className="p-3 text-right">{s.colViews}</th>
              <th className="p-3 text-right">{s.colShares}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-b border-gold-500/10 last:border-0 hover:bg-burgundy-950/60">
                <td className="p-3">
                  <div className="flex items-center gap-3 min-w-[260px]">
                    <img src={`https://i.ytimg.com/vi/${item.youtubeVideoId}/default.jpg`} alt="" className="w-16 h-12 object-cover rounded-lg border border-gold-500/20" />
                    <div className="min-w-0">
                      <p className="font-semibold text-parchment-50 truncate max-w-[280px] flex items-center gap-1">
                        {item.featured && <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400 flex-shrink-0" />}
                        {item.titleAmharic}
                      </p>
                      <p className="text-xs text-parchment-400 truncate max-w-[280px]">{item.titleEnglish}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-parchment-200 whitespace-nowrap">
                  {kind === 'mezmur' ? (item as Mezmur).singerEnglish : (item as SpiritualFilm).directorEnglish}
                </td>
                <td className="p-3 text-parchment-300 whitespace-nowrap">{categoryName(item.category)}</td>
                <td className="p-3 text-parchment-300">{item.year}</td>
                <td className="p-3 text-right text-parchment-200">{item.views.toLocaleString()}</td>
                <td className="p-3 text-right text-parchment-200">{item.shares || 0}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <IconButton title={s.openOnSite} onClick={() => window.open(`/watch/${kind}/${item.id}`, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </IconButton>
                    <IconButton title={s.edit} onClick={() => setEditing(item)}>
                      <Pencil className="w-4 h-4" />
                    </IconButton>
                    <IconButton title={s.delete} onClick={() => remove(item)} danger>
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <p className="p-8 text-center text-parchment-400 text-sm">{s.noMatches}</p>}
      </div>

      {editing && (
        <ItemDrawer
          kind={kind}
          item={editing === 'new' ? null : editing}
          defaultCategory={kindCategories[0]?.id || ''}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function IconButton({ title, onClick, danger, children }: { title: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`p-2 rounded-lg border cursor-pointer ${
        danger ? 'border-rose-600/40 text-rose-300 hover:bg-rose-950' : 'border-gold-500/30 text-gold-300 hover:bg-burgundy-900'
      }`}
    >
      {children}
    </button>
  );
}

function ItemDrawer({ kind, item, defaultCategory, onClose }: { kind: Kind; item: Item | null; defaultCategory: string; onClose: () => void }) {
  const { s, lang, categories, reloadCatalog, notify } = useAdmin();
  const [form, setForm] = useState<FormState>(() => (item ? formFromItem(item, kind) : { ...emptyForm, category: defaultCategory }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const videoId = extractYoutubeId(form.youtube);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleAmharic.trim() || !videoId) {
      setError(s.required);
      return;
    }
    const creator =
      kind === 'mezmur'
        ? { singerAmharic: form.creatorAmharic, singerEnglish: form.creatorEnglish, lyrics: form.lyrics }
        : { directorAmharic: form.creatorAmharic, directorEnglish: form.creatorEnglish, actors: form.actors };
    const body = {
      titleAmharic: form.titleAmharic.trim(),
      titleEnglish: form.titleEnglish.trim(),
      ...creator,
      category: form.category,
      language: form.language,
      year: form.year,
      duration: form.duration,
      sourceChannel: form.sourceChannel,
      youtubeVideoId: videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      descriptionAmharic: form.descriptionAmharic,
      descriptionEnglish: form.descriptionEnglish,
      featured: form.featured
    };
    const base = kind === 'mezmur' ? '/api/mezmur' : '/api/films';
    setSaving(true);
    setError('');
    try {
      await api(item ? `${base}/${item.id}` : base, { method: item ? 'PUT' : 'POST', body });
      await reloadCatalog();
      notify(s.savedOk);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full bg-[#120205] border border-gold-500/30 rounded-lg px-3 py-2 text-sm text-parchment-100 focus:outline-none focus:border-gold-400';
  const title = item ? (kind === 'mezmur' ? s.editMezmur : s.editFilm) : kind === 'mezmur' ? s.newMezmur : s.newFilm;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={save} className="absolute inset-y-0 right-0 w-full max-w-xl bg-[#1E040A] border-l border-gold-500/30 flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-gold-500/20">
          <h2 className="font-serif font-bold text-lg text-gold-300">{title}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-parchment-300 hover:text-rose-300 cursor-pointer" aria-label={s.cancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <Field label={s.youtubeLink} hint={s.youtubeHint}>
            <input value={form.youtube} onChange={(e) => set('youtube', e.target.value)} className={input} placeholder="https://www.youtube.com/watch?v=..." />
          </Field>
          {videoId && (
            <img src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt="" className="w-full aspect-video object-cover rounded-xl border border-gold-500/30" />
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={`${s.titleAm} *`}>
              <input value={form.titleAmharic} onChange={(e) => set('titleAmharic', e.target.value)} className={input} />
            </Field>
            <Field label={s.titleEn}>
              <input value={form.titleEnglish} onChange={(e) => set('titleEnglish', e.target.value)} className={input} />
            </Field>
            <Field label={kind === 'mezmur' ? s.singerAm : s.producerAm}>
              <input value={form.creatorAmharic} onChange={(e) => set('creatorAmharic', e.target.value)} className={input} />
            </Field>
            <Field label={kind === 'mezmur' ? s.singerEn : s.producerEn}>
              <input value={form.creatorEnglish} onChange={(e) => set('creatorEnglish', e.target.value)} className={input} />
            </Field>
            <Field label={s.category}>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={input}>
                {categories
                  .filter((c) => c.type === kind || c.type === 'both')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === 'am' ? c.nameAmharic : c.nameEnglish}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label={s.language}>
              <select value={form.language} onChange={(e) => set('language', e.target.value)} className={input}>
                {['Amharic', 'English', "Ge'ez", 'Tigrinya', 'Afaan Oromoo'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label={s.year}>
              <input type="number" value={form.year} onChange={(e) => set('year', Number(e.target.value))} className={input} />
            </Field>
            <Field label={s.duration}>
              <input value={form.duration} onChange={(e) => set('duration', e.target.value)} className={input} placeholder={kind === 'mezmur' ? '6:30' : '1h 20m'} />
            </Field>
          </div>

          {kind === 'film' && (
            <Field label={s.actors}>
              <input value={form.actors} onChange={(e) => set('actors', e.target.value)} className={input} />
            </Field>
          )}
          <Field label={s.sourceChannel}>
            <input value={form.sourceChannel} onChange={(e) => set('sourceChannel', e.target.value)} className={input} />
          </Field>
          <Field label={s.descAm}>
            <textarea rows={3} value={form.descriptionAmharic} onChange={(e) => set('descriptionAmharic', e.target.value)} className={input} />
          </Field>
          <Field label={s.descEn}>
            <textarea rows={3} value={form.descriptionEnglish} onChange={(e) => set('descriptionEnglish', e.target.value)} className={input} />
          </Field>
          {kind === 'mezmur' && (
            <Field label={s.lyrics}>
              <textarea rows={5} value={form.lyrics} onChange={(e) => set('lyrics', e.target.value)} className={input} />
            </Field>
          )}
          <label className="flex items-center gap-2 text-sm text-parchment-200 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-amber-500" />
            {s.featured}
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </div>

        <div className="p-4 border-t border-gold-500/20 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gold-500/30 text-parchment-200 text-sm cursor-pointer">
            {s.cancel}
          </button>
          <button disabled={saving} className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-burgundy-950 font-bold text-sm cursor-pointer">
            {item ? s.save : s.create}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-parchment-300">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-parchment-400">{hint}</span>}
    </label>
  );
}
