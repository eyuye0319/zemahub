// src/admin/OverviewPage.tsx — dashboard home: key numbers and recent activity.
import React, { useEffect, useState } from 'react';
import { Music2, Film, Users, MessageSquare, Eye, Share2, ArrowRight } from 'lucide-react';
import { MediaComment, PublicUser } from '../types';
import { api } from '../lib/api';
import { useAdmin } from './AdminApp';

type AdminComment = MediaComment & { mediaTitle: string };

const formatNumber = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

export default function OverviewPage() {
  const { s, lang, navigate, mezmurs, films } = useAdmin();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);

  useEffect(() => {
    api<{ users: PublicUser[] }>('/api/admin/users').then((d) => setUsers(d.users)).catch(() => {});
    api<{ comments: AdminComment[] }>('/api/admin/comments').then((d) => setComments(d.comments)).catch(() => {});
  }, []);

  const all = [...mezmurs, ...films];
  const stats = [
    { label: s.statMezmurs, value: mezmurs.length, icon: Music2, path: '/admin/mezmur' },
    { label: s.statFilms, value: films.length, icon: Film, path: '/admin/films' },
    { label: s.statUsers, value: users.length, icon: Users, path: '/admin/users' },
    { label: s.statComments, value: comments.length, icon: MessageSquare, path: '/admin/comments' },
    { label: s.statViews, value: all.reduce((sum, i) => sum + (i.views || 0), 0), icon: Eye },
    { label: s.statShares, value: all.reduce((sum, i) => sum + (i.shares || 0), 0), icon: Share2 }
  ];
  const newestUsers = [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const topViewed = [...all].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(({ label, value, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => path && navigate(path)}
            className={`text-left p-4 rounded-2xl bg-[#1E040A] border border-gold-500/20 ${path ? 'hover:border-gold-400 cursor-pointer' : 'cursor-default'}`}
          >
            <Icon className="w-5 h-5 text-gold-400" />
            <div className="mt-3 text-2xl font-serif font-bold text-parchment-50">{formatNumber(value)}</div>
            <div className="text-xs text-parchment-400">{label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel title={s.recentComments} action={s.viewAll} onAction={() => navigate('/admin/comments')}>
          {comments.slice(0, 5).map((c) => (
            <div key={c.id} className="py-2.5 border-b border-gold-500/10 last:border-0">
              <p className="text-[11px] text-gold-400 truncate">{c.mediaTitle}</p>
              <p className="text-sm text-parchment-200 line-clamp-2">
                <strong className="text-parchment-50">{c.userName}:</strong> {c.text}
              </p>
            </div>
          ))}
          {!comments.length && <Empty text={s.nothingYet} />}
        </Panel>

        <Panel title={s.newestUsers} action={s.viewAll} onAction={() => navigate('/admin/users')}>
          {newestUsers.map((u) => (
            <div key={u.id} className="py-2.5 flex items-center gap-3 border-b border-gold-500/10 last:border-0">
              <div className="w-8 h-8 rounded-full bg-burgundy-900 border border-gold-500/30 text-gold-400 flex items-center justify-center text-xs font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-parchment-50 truncate">{u.name}</p>
                <p className="text-[11px] text-parchment-400 truncate">{u.email}</p>
              </div>
              <span className="text-[10px] text-parchment-400">{new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
          {!users.length && <Empty text={s.nothingYet} />}
        </Panel>

        <Panel title={s.topViewed}>
          {topViewed.map((item, i) => (
            <div key={item.id} className="py-2 flex items-center gap-3 border-b border-gold-500/10 last:border-0">
              <span className="w-5 text-xs font-bold text-gold-500">{i + 1}</span>
              <img src={`https://i.ytimg.com/vi/${item.youtubeVideoId}/default.jpg`} alt="" className="w-12 h-9 object-cover rounded" />
              <p className="flex-1 min-w-0 text-sm text-parchment-100 truncate">
                {lang === 'am' ? item.titleAmharic : item.titleEnglish}
              </p>
              <span className="text-xs text-parchment-400">{formatNumber(item.views)}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <section className="p-5 rounded-2xl bg-[#1E040A] border border-gold-500/20">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-serif font-bold text-gold-300">{title}</h2>
        {action && onAction && (
          <button onClick={onAction} className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 cursor-pointer">
            {action} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-parchment-400 italic py-4">{text}</p>;
}
