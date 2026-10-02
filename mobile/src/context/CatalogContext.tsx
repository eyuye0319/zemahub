import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { CategoryInfo, MediaItem, MediaType, Mezmur, SpiritualFilm } from '../lib/types';
import { api } from '../lib/api';

interface CatalogContextValue {
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  categories: CategoryInfo[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  findMedia: (type: MediaType, id: string) => MediaItem | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [mezmurs, setMezmurs] = useState<Mezmur[]>([]);
  const [films, setFilms] = useState<SpiritualFilm[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      const [m, f, c] = await Promise.all([
        api<{ mezmurs: Mezmur[] }>('/api/mezmur'),
        api<{ films: SpiritualFilm[] }>('/api/films'),
        api<CategoryInfo[]>('/api/categories')
      ]);
      setMezmurs(m.mezmurs);
      setFilms(f.films);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const findMedia = useCallback(
    (type: MediaType, id: string) =>
      type === 'mezmur' ? mezmurs.find((m) => m.id === id) : films.find((f) => f.id === id),
    [mezmurs, films]
  );

  return (
    <CatalogContext.Provider value={{ mezmurs, films, categories, loading, error, refresh, findMedia }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}
