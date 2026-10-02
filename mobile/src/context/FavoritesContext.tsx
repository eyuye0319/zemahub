import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const FAVORITES_KEY = 'zemahub_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((saved) => saved && setFavorites(JSON.parse(saved)))
      .catch(() => {});
  }, []);

  const save = (updated: string[]) => {
    setFavorites(updated);
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)).catch(() => {});
    if (user) {
      api('/api/me/favorites', { method: 'PUT', body: { favorites: updated } }).catch(() => {});
    }
  };

  // On sign-in, merge favorites saved on this phone into the account (same as the website).
  useEffect(() => {
    if (!user) return;
    api<{ favorites: string[] }>('/api/me/favorites')
      .then(async ({ favorites: server }) => {
        const local = JSON.parse((await AsyncStorage.getItem(FAVORITES_KEY)) || '[]') as string[];
        const merged = [...new Set([...server, ...local])];
        if (merged.length !== server.length) save(merged);
        else {
          setFavorites(server);
          AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(server)).catch(() => {});
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const toggleFavorite = (id: string) =>
    save(favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite: (id) => favorites.includes(id), toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
