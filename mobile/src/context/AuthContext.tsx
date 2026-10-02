import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PublicUser } from '../lib/types';
import { api, getToken, setToken } from '../lib/api';

interface AuthContextValue {
  user: PublicUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (await getToken()) {
          const data = await api<{ user: PublicUser }>('/api/auth/me');
          setUser(data.user);
        }
      } catch (err: any) {
        // Only forget the session when the server rejects it, not when offline.
        if (err?.status === 401) await setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (path: string, body: object) => {
    const data = await api<{ token: string; user: PublicUser }>(path, { method: 'POST', body });
    await setToken(data.token);
    setUser(data.user);
  };

  const login = useCallback((email: string, password: string) => signIn('/api/auth/login', { email, password }), []);

  const register = useCallback(
    (name: string, email: string, password: string) => signIn('/api/auth/register', { name, email, password }),
    []
  );

  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch {}
    await setToken(null);
    setUser(null);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await api('/api/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    await api('/api/me', { method: 'DELETE', body: { password } });
    await setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: user?.role === 'admin', loading, login, register, logout, changePassword, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
