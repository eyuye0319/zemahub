// src/admin/SettingsPage.tsx — dashboard language, useful links, and catalog restore.
import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import { useAdmin } from './AdminApp';

export default function SettingsPage() {
  const { s, lang, setLang, reloadCatalog, notify } = useAdmin();
  const [resetting, setResetting] = useState(false);

  const resetCatalog = async () => {
    if (!confirm(s.resetConfirm)) return;
    setResetting(true);
    try {
      await api('/api/admin/reset', { method: 'POST' });
      await reloadCatalog();
      notify(s.resetDone);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setResetting(false);
    }
  };

  const card = 'p-5 rounded-2xl bg-[#1E040A] border border-gold-500/20 space-y-3';

  return (
    <div className="space-y-4 max-w-3xl">
      <section className={card}>
        <h2 className="font-serif font-bold text-gold-300">{s.language_}</h2>
        <div className="flex gap-2">
          {(['en', 'am'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${lang === l ? 'bg-gold-500 text-burgundy-950' : 'border border-gold-500/30 text-gold-300'}`}
            >
              {l === 'en' ? 'English' : 'አማርኛ'}
            </button>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="font-serif font-bold text-gold-300">{s.settingsLinks}</h2>
        {[
          { href: '/', label: s.backToSite },
          { href: '/privacy', label: s.privacyPolicy }
        ].map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-parchment-200 hover:text-gold-300">
            <ExternalLink className="w-4 h-4 text-gold-400" />
            {link.label}
          </a>
        ))}
      </section>

      <section className="p-5 rounded-2xl bg-rose-950/20 border border-rose-600/30 space-y-3">
        <h2 className="font-serif font-bold text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {s.resetTitle}
        </h2>
        <p className="text-sm text-parchment-300">{s.resetDesc}</p>
        <button
          onClick={resetCatalog}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/50 text-rose-200 hover:bg-rose-950 disabled:opacity-60 text-sm font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          {s.resetButton}
        </button>
      </section>
    </div>
  );
}
