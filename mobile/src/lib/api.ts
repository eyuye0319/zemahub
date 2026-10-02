// API client for the ZemaHub server (same REST API the website uses).
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'https://zemahub-orthodox.onrender.com';

const TOKEN_KEY = 'zemahub_token';
let cachedToken: string | null | undefined;

export async function getToken() {
  if (cachedToken === undefined) {
    cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
  }
  return cachedToken;
}

export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// The free server sleeps when idle and can take about a minute to wake up.
const TIMEOUT_MS = 90_000;

export async function api<T = any>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Could not reach ZemaHub. Check your internet connection and try again.', 0);
  } finally {
    clearTimeout(timer);
  }
}

export const shareUrlFor = (type: 'mezmur' | 'film', id: string) =>
  `${API_URL}/?type=${type}&id=${encodeURIComponent(id)}`;
