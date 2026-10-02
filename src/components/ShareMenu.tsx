// src/components/ShareMenu.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Share2, Check, Link2, MessageCircle, Send, Smartphone } from 'lucide-react';
import { Language, Mezmur, SpiritualFilm } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../lib/api';

interface ShareMenuProps {
  media: Mezmur | SpiritualFilm;
  type: 'mezmur' | 'film';
  currentLang: Language;
}

export function shareUrlFor(type: 'mezmur' | 'film', id: string) {
  return `${window.location.origin}/?type=${type}&id=${encodeURIComponent(id)}`;
}

export default function ShareMenu({ media, type, currentLang }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shares, setShares] = useState(media.shares || 0);
  const ref = useRef<HTMLDivElement>(null);
  const t = translations[currentLang];

  useEffect(() => {
    setShares(media.shares || 0);
    setOpen(false);
  }, [media.id, media.shares]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const url = shareUrlFor(type, media.id);
  const text = `${media.titleAmharic} — ${media.titleEnglish} | ZemaHub`;

  const recordShare = () => {
    api<{ shares: number }>(`/api/share/${type}/${media.id}`, { method: 'POST' })
      .then((data) => setShares(data.shares))
      .catch(() => {});
  };

  const openExternal = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
    recordShare();
    setOpen(false);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: text, text, url });
      recordShare();
    } catch {
      // user cancelled the share sheet
    }
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(t.copyLink, url);
    }
    setCopied(true);
    recordShare();
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const targets = [
    { label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400', href: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}` },
    { label: 'Telegram', icon: Send, color: 'text-sky-400', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
    { label: 'Facebook', icon: Share2, color: 'text-blue-400', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X (Twitter)', icon: Share2, color: 'text-parchment-200', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` }
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg bg-burgundy-900/60 text-parchment-200 border border-gold-500/30 hover:text-gold-300 transition-all cursor-pointer flex items-center gap-1 text-xs"
        title={t.share}
        aria-expanded={open}
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">{t.share}</span>
        {shares > 0 && <span className="text-[10px] text-gold-400 font-bold">{shares}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-[#1E040A] border border-gold-500/40 rounded-xl shadow-2xl z-30 p-2 text-left">
          <p className="px-2.5 pt-1 pb-2 text-[11px] font-serif font-bold text-gold-300 border-b border-gold-500/20 mb-1">
            {t.shareTitle}
          </p>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full px-2.5 py-2 rounded-lg hover:bg-burgundy-900/80 flex items-center gap-2.5 text-xs text-parchment-100 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-gold-400" />
              <span>{t.shareVia}</span>
            </button>
          )}

          {targets.map(({ label, icon: Icon, color, href }) => (
            <button
              key={label}
              onClick={() => openExternal(href)}
              className="w-full px-2.5 py-2 rounded-lg hover:bg-burgundy-900/80 flex items-center gap-2.5 text-xs text-parchment-100 cursor-pointer"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span>{label}</span>
            </button>
          ))}

          <button
            onClick={handleCopy}
            className="w-full px-2.5 py-2 rounded-lg hover:bg-burgundy-900/80 flex items-center gap-2.5 text-xs text-parchment-100 cursor-pointer border-t border-gold-500/20 mt-1"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4 text-gold-400" />}
            <span>{copied ? t.copied : t.copyLink}</span>
          </button>
        </div>
      )}
    </div>
  );
}
