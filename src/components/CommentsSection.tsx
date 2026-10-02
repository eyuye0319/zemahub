// src/components/CommentsSection.tsx
import React, { useEffect, useState } from 'react';
import { Send, Trash2, LogIn, AlertCircle, Shield } from 'lucide-react';
import { Language, MediaComment } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface CommentsSectionProps {
  mediaType: 'mezmur' | 'film';
  mediaId: string;
  currentLang: Language;
  onCountChange?: (count: number) => void;
}

function timeAgo(iso: string, lang: Language) {
  const rtf = new Intl.RelativeTimeFormat(lang === 'am' ? 'am' : 'en', { numeric: 'auto' });
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(seconds, 'second');
}

export default function CommentsSection({ mediaType, mediaId, currentLang, onCountChange }: CommentsSectionProps) {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [comments, setComments] = useState<MediaComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const t = translations[currentLang];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api<{ comments: MediaComment[] }>(`/api/comments/${mediaType}/${mediaId}`)
      .then((data) => {
        if (!cancelled) setComments(data.comments);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mediaType, mediaId]);

  useEffect(() => {
    onCountChange?.(comments.length);
  }, [comments.length, onCountChange]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    setError('');
    try {
      const comment = await api<MediaComment>(`/api/comments/${mediaType}/${mediaId}`, {
        method: 'POST',
        body: { text }
      });
      setComments((prev) => [comment, ...prev]);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api(`/api/comments/${id}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete comment');
    }
  };

  return (
    <div className="space-y-4">
      {user ? (
        <form onSubmit={handlePost} className="flex gap-2 items-start">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.commentsPlaceholder}
            maxLength={1000}
            rows={2}
            className="flex-1 bg-[#120205] border border-gold-500/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-parchment-100 placeholder-parchment-400/50 focus:outline-none focus:border-gold-400 resize-none"
          />
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="px-3 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-burgundy-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.commentsPost}</span>
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="w-full p-3 rounded-xl border border-dashed border-gold-500/40 text-gold-300 hover:bg-burgundy-900/60 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>{t.commentsSignInPrompt}</span>
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-950/60 border border-rose-600/40 rounded-xl text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-parchment-400">{t.commentsLoading}</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-parchment-400 italic">{t.commentsEmpty}</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2.5 p-3 bg-burgundy-950/80 rounded-xl border border-gold-500/20">
              <div className="w-8 h-8 rounded-full bg-burgundy-900 border border-gold-500/30 text-gold-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {c.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-parchment-100 truncate">
                    {c.userName}
                    <span className="ml-2 font-normal text-[10px] text-parchment-400">{timeAgo(c.createdAt, currentLang)}</span>
                  </p>
                  {user && (user.id === c.userId || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-1 rounded text-parchment-400 hover:text-rose-400 cursor-pointer flex items-center gap-1 text-[10px]"
                      title={t.commentsDelete}
                    >
                      {isAdmin && user.id !== c.userId && <Shield className="w-3 h-3" />}
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-parchment-200 whitespace-pre-line break-words mt-0.5">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
