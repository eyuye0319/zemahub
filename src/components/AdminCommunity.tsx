// src/components/AdminCommunity.tsx
// Admin panes for managing user accounts and moderating comments.
import React, { useEffect, useState } from 'react';
import { Shield, User, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { Language, MediaComment, PublicUser } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type AdminUser = PublicUser & { commentCount: number };
type AdminComment = MediaComment & { mediaTitle: string };

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-600/40 rounded-xl text-xs text-rose-300">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function AdminUsersPane({ currentLang }: { currentLang: Language }) {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');
  const t = translations[currentLang];

  const load = () =>
    api<{ users: AdminUser[] }>('/api/admin/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (u: AdminUser) => {
    setError('');
    try {
      await api(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { role: u.role === 'admin' ? 'user' : 'admin' } });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const remove = async (u: AdminUser) => {
    if (!confirm(`${t.adminConfirmDeleteUser}\n\n${u.name} <${u.email}>`)) return;
    setError('');
    try {
      await api(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <ErrorBanner message={error} />
      {users.map((u) => {
        const isMe = u.id === me?.id;
        return (
          <div key={u.id} className="flex flex-wrap items-center gap-3 p-3 bg-burgundy-950/80 rounded-xl border border-gold-500/20">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border flex-shrink-0 ${
              u.role === 'admin' ? 'bg-gold-500 text-burgundy-950 border-gold-300' : 'bg-burgundy-900 text-gold-400 border-gold-500/40'
            }`}>
              {u.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-[160px]">
              <p className="text-sm font-bold text-parchment-100">
                {u.name} {isMe && <span className="text-[10px] text-gold-400">({t.adminYou})</span>}
              </p>
              <p className="text-[11px] text-parchment-400">
                {u.email} • {t.adminJoined} {new Date(u.createdAt).toLocaleDateString()} • {t.commentsTitle}: {u.commentCount}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              u.role === 'admin' ? 'bg-gold-500/20 text-gold-300 border-gold-400/40' : 'bg-burgundy-900 text-parchment-300 border-gold-500/20'
            }`}>
              {u.role === 'admin' ? t.userRoleAdmin : t.userRolePilgrim}
            </span>
            {!isMe && (
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => changeRole(u)}
                  className="px-2.5 py-1.5 rounded-lg bg-burgundy-900 hover:bg-burgundy-800 border border-gold-500/30 text-[11px] text-gold-300 cursor-pointer"
                >
                  {u.role === 'admin' ? t.adminMakeUser : t.adminMakeAdmin}
                </button>
                <button
                  type="button"
                  onClick={() => remove(u)}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 cursor-pointer"
                  title={t.adminDeleteUser}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AdminCommentsPane({ currentLang }: { currentLang: Language }) {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const t = translations[currentLang];

  const load = () => {
    setLoading(true);
    return api<{ comments: AdminComment[] }>('/api/admin/comments')
      .then((data) => setComments(data.comments))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    setError('');
    try {
      await api(`/api/comments/${id}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={load}
          className="px-3 py-1.5 rounded-lg bg-burgundy-900 border border-gold-500/30 text-[11px] text-gold-300 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'አድስ' : 'Refresh'}</span>
        </button>
      </div>
      <ErrorBanner message={error} />
      {!loading && comments.length === 0 && (
        <p className="text-xs text-parchment-400 italic text-center py-8">{t.adminNoComments}</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="p-3 bg-burgundy-950/80 rounded-xl border border-gold-500/20 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-gold-400 truncate">{c.mediaTitle}</p>
              <p className="text-xs font-bold text-parchment-100">
                {c.userName}
                <span className="ml-2 font-normal text-[10px] text-parchment-400">{new Date(c.createdAt).toLocaleString()}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(c.id)}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 cursor-pointer flex-shrink-0"
              title={t.commentsDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-parchment-200 whitespace-pre-line break-words">{c.text}</p>
        </div>
      ))}
    </div>
  );
}
