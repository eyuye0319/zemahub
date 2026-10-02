// server.ts
// ZemaHub - Full-Stack Express Server with persistent JSON storage, user accounts and comments.
// The REST API is client-agnostic (Bearer-token auth) so the web app and a future Android app share it.

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer, ViteDevServer } from "vite";
import {
  CATALOG_VERSION,
  initialCategories,
  initialMezmurs,
  initialFilms,
  initialSingers,
  initialStats
} from "./src/db/initial_data";
import {
  Mezmur, SpiritualFilm, CategoryInfo, SingerArtist, PlatformStats,
  PublicUser, UserRole, MediaComment
} from "./src/types";
import { matchMezmurSearch, matchFilmSearch } from "./src/utils/searchHelper";
import { createStorage } from "./server/storage";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

app.use(express.json({ limit: "1mb" }));

// ---------------- DATABASE ---------------- //

interface StoredUser extends PublicUser {
  passwordHash: string;
  salt: string;
  favorites: string[];
}

interface Session {
  tokenHash: string;
  userId: string;
  expiresAt: number;
}

interface DatabaseSchema {
  catalogVersion: number;
  mezmurs: Mezmur[];
  films: SpiritualFilm[];
  categories: CategoryInfo[];
  singers: SingerArtist[];
  stats: PlatformStats;
  users: StoredUser[];
  sessions: Session[];
  comments: MediaComment[];
}

const storage = createStorage();

// Items created through the admin panel get timestamp ids; everything else comes from the seed.
const isCustomItem = (item: { id: string }) => /^(mezmur|film)-\d+$/.test(item.id);

function seedCatalog() {
  return {
    catalogVersion: CATALOG_VERSION,
    mezmurs: structuredClone(initialMezmurs),
    films: structuredClone(initialFilms),
    categories: structuredClone(initialCategories),
    singers: structuredClone(initialSingers),
    stats: structuredClone(initialStats)
  };
}

// A load failure is fatal on purpose: starting empty would overwrite the stored users and comments.
async function loadDB(): Promise<DatabaseSchema> {
  const stored = (await storage.load()) as Partial<DatabaseSchema> | null;

  const base: DatabaseSchema = {
    ...seedCatalog(),
    users: stored?.users ?? [],
    sessions: stored?.sessions ?? [],
    comments: stored?.comments ?? []
  };

  if (stored?.mezmurs && stored?.films) {
    if (stored.catalogVersion === CATALOG_VERSION) {
      Object.assign(base, {
        mezmurs: stored.mezmurs,
        films: stored.films,
        categories: stored.categories ?? base.categories,
        singers: stored.singers ?? base.singers
      });
    } else {
      // New seed catalog: take the fresh seed but keep anything an admin added by hand.
      base.mezmurs = [...stored.mezmurs.filter(isCustomItem), ...base.mezmurs];
      base.films = [...stored.films.filter(isCustomItem), ...base.films];
    }
  }

  ensureAdminAccount(base);
  base.sessions = base.sessions.filter(s => s.expiresAt > Date.now());
  saveDB(base);
  return base;
}

function saveDB(data: DatabaseSchema) {
  storage.save(data);
}

// ---------------- AUTH HELPERS ---------------- //

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { passwordHash, salt };
}

function verifyPassword(user: StoredUser, password: string) {
  const candidate = crypto.scryptSync(password, user.salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(user.passwordHash, "hex"));
}

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

function toPublicUser(u: StoredUser): PublicUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt };
}

function createUser(data: DatabaseSchema, name: string, email: string, password: string, role: UserRole): StoredUser {
  const user: StoredUser = {
    id: `user-${crypto.randomUUID()}`,
    name,
    email: email.toLowerCase(),
    role,
    createdAt: new Date().toISOString(),
    favorites: [],
    ...hashPassword(password)
  };
  data.users.push(user);
  return user;
}

function ensureAdminAccount(data: DatabaseSchema) {
  if (data.users.some(u => u.role === "admin")) return;
  const email = process.env.ADMIN_EMAIL || "admin@zemahub.app";
  const password = process.env.ADMIN_PASSWORD || "zemahub2026";
  createUser(data, process.env.ADMIN_NAME || "ZemaHub Admin", email, password, "admin");
  console.log(`Created admin account ${email}.`);
  if (!process.env.ADMIN_PASSWORD) {
    console.warn("WARNING: admin uses the default password. Set ADMIN_PASSWORD in .env before deploying.");
  }
}

function startSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions.push({ tokenHash: hashToken(token), userId, expiresAt: Date.now() + SESSION_TTL_MS });
  saveDB(db);
  return token;
}

const isValidEmail = (email: unknown): email is string =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Loaded in startServer() before the server accepts requests.
let db: DatabaseSchema;

// ---------------- AUTH MIDDLEWARE ---------------- //

interface AuthedRequest extends Request {
  user?: StoredUser;
  token?: string;
}

function attachUser(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token) {
    const tokenHash = hashToken(token);
    const session = db.sessions.find(s => s.tokenHash === tokenHash && s.expiresAt > Date.now());
    const user = session && db.users.find(u => u.id === session.userId);
    if (user) {
      req.user = user;
      req.token = token;
    }
  }
  next();
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Please sign in to continue." });
    return;
  }
  next();
}

function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Please sign in to continue." });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Administrator access required." });
    return;
  }
  next();
}

app.use("/api", attachUser);

// Simple in-memory brute-force guard for login/register.
const authAttempts = new Map<string, { count: number; resetAt: number }>();
function authRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const entry = authAttempts.get(key);
  if (!entry || entry.resetAt < now) {
    authAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    next();
    return;
  }
  if (entry.count >= 20) {
    res.status(429).json({ error: "Too many attempts. Please wait a few minutes and try again." });
    return;
  }
  entry.count++;
  next();
}

// ---------------- AUTH ENDPOINTS ---------------- //

app.post("/api/auth/register", authRateLimit, (req: AuthedRequest, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (name.length < 2 || name.length > 60) {
    res.status(400).json({ error: "Name must be between 2 and 60 characters." });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters." });
    return;
  }
  if (db.users.some(u => u.email === email)) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const user = createUser(db, name, email, password, "user");
  const token = startSession(user.id);
  res.status(201).json({ token, user: toPublicUser(user) });
});

app.post("/api/auth/login", authRateLimit, (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const user = db.users.find(u => u.email === email);

  if (!user || !verifyPassword(user, password)) {
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }
  const token = startSession(user.id);
  res.json({ token, user: toPublicUser(user) });
});

app.get("/api/auth/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: toPublicUser(req.user!) });
});

app.post("/api/auth/logout", requireAuth, (req: AuthedRequest, res) => {
  const tokenHash = hashToken(req.token!);
  db.sessions = db.sessions.filter(s => s.tokenHash !== tokenHash);
  saveDB(db);
  res.json({ success: true });
});

// Changing the password signs the account out everywhere except the current session.
app.post("/api/auth/change-password", authRateLimit, requireAuth, (req: AuthedRequest, res) => {
  const user = req.user!;
  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");

  if (!verifyPassword(user, currentPassword)) {
    res.status(401).json({ error: "Current password is incorrect." });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters." });
    return;
  }
  Object.assign(user, hashPassword(newPassword));
  const currentHash = hashToken(req.token!);
  db.sessions = db.sessions.filter(s => s.userId !== user.id || s.tokenHash === currentHash);
  saveDB(db);
  res.json({ success: true });
});

// Favorites are stored per account so they follow the user across web and mobile.
app.get("/api/me/favorites", requireAuth, (req: AuthedRequest, res) => {
  res.json({ favorites: req.user!.favorites });
});

app.put("/api/me/favorites", requireAuth, (req: AuthedRequest, res) => {
  const ids: unknown = req.body?.favorites;
  if (!Array.isArray(ids) || !ids.every(id => typeof id === "string")) {
    res.status(400).json({ error: "favorites must be an array of ids" });
    return;
  }
  const known = new Set([...db.mezmurs.map(m => m.id), ...db.films.map(f => f.id)]);
  req.user!.favorites = [...new Set(ids as string[])].filter(id => known.has(id));
  saveDB(db);
  res.json({ favorites: req.user!.favorites });
});

// ---------------- CATALOG ENDPOINTS ---------------- //

// 1. Overview Stats
app.get("/api/stats", (req, res) => {
  const totalViews = db.mezmurs.reduce((acc, m) => acc + (m.views || 0), 0) +
                     db.films.reduce((acc, f) => acc + (f.views || 0), 0);
  res.json({
    totalMezmurs: db.mezmurs.length,
    totalFilms: db.films.length,
    totalViews,
    totalSingers: db.singers.length,
    totalCategories: db.categories.length
  });
});

// 2. Categories
app.get("/api/categories", (req, res) => {
  const { type } = req.query;
  let list = db.categories;
  if (type && type !== "all" && type !== "both") {
    list = list.filter(c => c.type === type || c.type === "both");
  }
  res.json(list);
});

// 3. Singers / Artists
app.get("/api/singers", (req, res) => {
  res.json(db.singers);
});

// 4. Mezmurs
app.get("/api/mezmur", (req, res) => {
  const { q, category, language, year, singer, featured, sortBy, limit, offset } = req.query;
  let results = [...db.mezmurs];

  if (q && typeof q === "string") {
    results = results.filter(m => matchMezmurSearch(m, q));
  }

  if (category && category !== "all") {
    results = results.filter(m => m.category === category);
  }

  if (language && language !== "all") {
    results = results.filter(m => m.language.toLowerCase() === String(language).toLowerCase());
  }

  if (year && year !== "all") {
    results = results.filter(m => String(m.year) === String(year));
  }

  if (singer && singer !== "all") {
    const sQuery = String(singer).toLowerCase();
    results = results.filter(m =>
      m.singer.toLowerCase().includes(sQuery) ||
      m.singerAmharic.toLowerCase().includes(sQuery) ||
      m.singerEnglish.toLowerCase().includes(sQuery)
    );
  }

  if (featured === "true") {
    results = results.filter(m => m.featured);
  }

  // Sorting
  if (sortBy === "most_viewed") {
    results.sort((a, b) => b.views - a.views);
  } else if (sortBy === "oldest") {
    results.sort((a, b) => a.year - b.year || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === "alphabetical") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Newest default
    results.sort((a, b) => b.year - a.year || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = results.length;
  if (offset) {
    results = results.slice(Number(offset));
  }
  if (limit) {
    results = results.slice(0, Number(limit));
  }

  res.json({ total, mezmurs: results });
});

app.get("/api/mezmur/:id", (req, res) => {
  const mezmur = db.mezmurs.find(m => m.id === req.params.id);
  if (!mezmur) {
    res.status(404).json({ error: "Mezmur not found" });
    return;
  }
  // Also provide related mezmurs in same category
  const related = db.mezmurs
    .filter(m => m.id !== mezmur.id && (m.category === mezmur.category || m.singer === mezmur.singer))
    .slice(0, 4);

  res.json({ mezmur, related });
});

app.post("/api/mezmur", requireAdmin, (req, res) => {
  const {
    titleAmharic,
    titleEnglish,
    singerAmharic,
    singerEnglish,
    year,
    language,
    category,
    youtubeVideoId,
    thumbnailUrl,
    descriptionAmharic,
    descriptionEnglish,
    lyrics,
    duration,
    featured
  } = req.body;

  if (!titleAmharic || !youtubeVideoId) {
    res.status(400).json({ error: "Title (Amharic) and YouTube Video ID are required" });
    return;
  }

  const matchedCat = db.categories.find(c => c.id === category);
  const newMezmur: Mezmur = {
    id: `mezmur-${Date.now()}`,
    title: titleAmharic,
    titleAmharic,
    titleEnglish: titleEnglish || titleAmharic,
    singer: singerAmharic || singerEnglish || "መዘምራን",
    singerAmharic: singerAmharic || "መዘምራን",
    singerEnglish: singerEnglish || "Choir",
    year: Number(year) || new Date().getFullYear(),
    language: language || "Amharic",
    category: category || "mariam",
    categoryAmharic: matchedCat?.nameAmharic || "የእመቤታችን ቅድስት ድንግል ማርያም",
    categoryEnglish: matchedCat?.nameEnglish || "Saint Mary",
    youtubeVideoId: youtubeVideoId.trim(),
    youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideoId.trim()}`,
    thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${youtubeVideoId.trim()}/hqdefault.jpg`,
    description: descriptionAmharic || descriptionEnglish || "",
    descriptionAmharic: descriptionAmharic || "",
    descriptionEnglish: descriptionEnglish || "",
    lyrics: lyrics || "",
    duration: duration || "5:00",
    views: 0,
    shares: 0,
    featured: Boolean(featured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.mezmurs.unshift(newMezmur);
  saveDB(db);
  res.status(201).json(newMezmur);
});

app.put("/api/mezmur/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.mezmurs.findIndex(m => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Mezmur not found" });
    return;
  }

  const existing = db.mezmurs[index];
  const matchedCat = db.categories.find(c => c.id === (req.body.category || existing.category));

  db.mezmurs[index] = {
    ...existing,
    ...req.body,
    id: existing.id,
    views: existing.views,
    shares: existing.shares,
    title: req.body.titleAmharic || existing.title,
    titleAmharic: req.body.titleAmharic || existing.titleAmharic,
    titleEnglish: req.body.titleEnglish || existing.titleEnglish,
    singer: req.body.singerAmharic || existing.singer,
    singerAmharic: req.body.singerAmharic || existing.singerAmharic,
    singerEnglish: req.body.singerEnglish || existing.singerEnglish,
    year: Number(req.body.year) || existing.year,
    categoryAmharic: matchedCat?.nameAmharic || existing.categoryAmharic,
    categoryEnglish: matchedCat?.nameEnglish || existing.categoryEnglish,
    youtubeUrl: req.body.youtubeVideoId ? `https://www.youtube.com/watch?v=${req.body.youtubeVideoId}` : existing.youtubeUrl,
    updatedAt: new Date().toISOString()
  };

  saveDB(db);
  res.json(db.mezmurs[index]);
});

app.delete("/api/mezmur/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  db.mezmurs = db.mezmurs.filter(m => m.id !== id);
  db.comments = db.comments.filter(c => c.mediaId !== id);
  saveDB(db);
  res.json({ message: "Mezmur deleted successfully" });
});

app.post("/api/mezmur/:id/view", (req, res) => {
  const { id } = req.params;
  const mezmur = db.mezmurs.find(m => m.id === id);
  if (mezmur) {
    mezmur.views = (mezmur.views || 0) + 1;
    saveDB(db);
  }
  res.json({ views: mezmur?.views || 0 });
});

// 5. Spiritual Films
app.get("/api/films", (req, res) => {
  const { q, category, language, year, director, featured, sortBy, limit, offset } = req.query;
  let results = [...db.films];

  if (q && typeof q === "string") {
    results = results.filter(f => matchFilmSearch(f, q));
  }

  if (category && category !== "all") {
    results = results.filter(f => f.category === category);
  }

  if (language && language !== "all") {
    results = results.filter(f => f.language.toLowerCase() === String(language).toLowerCase());
  }

  if (year && year !== "all") {
    results = results.filter(f => String(f.year) === String(year));
  }

  if (director && director !== "all") {
    const dQuery = String(director).toLowerCase();
    results = results.filter(f =>
      f.director.toLowerCase().includes(dQuery) ||
      f.directorAmharic.toLowerCase().includes(dQuery) ||
      (f.directorEnglish || "").toLowerCase().includes(dQuery)
    );
  }

  if (featured === "true") {
    results = results.filter(f => f.featured);
  }

  // Sorting
  if (sortBy === "most_viewed") {
    results.sort((a, b) => b.views - a.views);
  } else if (sortBy === "oldest") {
    results.sort((a, b) => a.year - b.year || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === "alphabetical") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    results.sort((a, b) => b.year - a.year || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = results.length;
  if (offset) {
    results = results.slice(Number(offset));
  }
  if (limit) {
    results = results.slice(0, Number(limit));
  }

  res.json({ total, films: results });
});

app.get("/api/films/:id", (req, res) => {
  const film = db.films.find(f => f.id === req.params.id);
  if (!film) {
    res.status(404).json({ error: "Spiritual film not found" });
    return;
  }
  const related = db.films
    .filter(f => f.id !== film.id && (f.category === film.category || f.director === film.director))
    .slice(0, 4);

  res.json({ film, related });
});

app.post("/api/films", requireAdmin, (req, res) => {
  const {
    titleAmharic,
    titleEnglish,
    directorAmharic,
    directorEnglish,
    actors,
    year,
    duration,
    language,
    category,
    youtubeVideoId,
    thumbnailUrl,
    descriptionAmharic,
    descriptionEnglish,
    featured
  } = req.body;

  if (!titleAmharic || !youtubeVideoId) {
    res.status(400).json({ error: "Title (Amharic) and YouTube Video ID are required" });
    return;
  }

  const matchedCat = db.categories.find(c => c.id === category);
  const newFilm: SpiritualFilm = {
    id: `film-${Date.now()}`,
    title: titleAmharic,
    titleAmharic,
    titleEnglish: titleEnglish || titleAmharic,
    director: directorAmharic || directorEnglish || "አዘጋጅ",
    directorAmharic: directorAmharic || "አዘጋጅ",
    directorEnglish: directorEnglish || "Director",
    actors: Array.isArray(actors) ? actors : (actors ? String(actors).split(",").map(a => a.trim()) : []),
    year: Number(year) || new Date().getFullYear(),
    duration: duration || "1h 30m",
    language: language || "Amharic",
    category: category || "saint_films",
    categoryAmharic: matchedCat?.nameAmharic || "የቅዱሳን ገድላትና ታሪክ",
    categoryEnglish: matchedCat?.nameEnglish || "Hagiographies",
    youtubeVideoId: youtubeVideoId.trim(),
    youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideoId.trim()}`,
    thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${youtubeVideoId.trim()}/hqdefault.jpg`,
    description: descriptionAmharic || descriptionEnglish || "",
    descriptionAmharic: descriptionAmharic || "",
    descriptionEnglish: descriptionEnglish || "",
    views: 0,
    shares: 0,
    featured: Boolean(featured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.films.unshift(newFilm);
  saveDB(db);
  res.status(201).json(newFilm);
});

app.put("/api/films/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.films.findIndex(f => f.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Film not found" });
    return;
  }

  const existing = db.films[index];
  const matchedCat = db.categories.find(c => c.id === (req.body.category || existing.category));

  db.films[index] = {
    ...existing,
    ...req.body,
    id: existing.id,
    views: existing.views,
    shares: existing.shares,
    title: req.body.titleAmharic || existing.title,
    titleAmharic: req.body.titleAmharic || existing.titleAmharic,
    titleEnglish: req.body.titleEnglish || existing.titleEnglish,
    director: req.body.directorAmharic || existing.director,
    directorAmharic: req.body.directorAmharic || existing.directorAmharic,
    directorEnglish: req.body.directorEnglish || existing.directorEnglish,
    actors: Array.isArray(req.body.actors) ? req.body.actors : (req.body.actors ? String(req.body.actors).split(",").map(a => a.trim()) : existing.actors),
    year: Number(req.body.year) || existing.year,
    categoryAmharic: matchedCat?.nameAmharic || existing.categoryAmharic,
    categoryEnglish: matchedCat?.nameEnglish || existing.categoryEnglish,
    youtubeUrl: req.body.youtubeVideoId ? `https://www.youtube.com/watch?v=${req.body.youtubeVideoId}` : existing.youtubeUrl,
    updatedAt: new Date().toISOString()
  };

  saveDB(db);
  res.json(db.films[index]);
});

app.delete("/api/films/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  db.films = db.films.filter(f => f.id !== id);
  db.comments = db.comments.filter(c => c.mediaId !== id);
  saveDB(db);
  res.json({ message: "Film deleted successfully" });
});

app.post("/api/films/:id/view", (req, res) => {
  const { id } = req.params;
  const film = db.films.find(f => f.id === id);
  if (film) {
    film.views = (film.views || 0) + 1;
    saveDB(db);
  }
  res.json({ views: film?.views || 0 });
});

// 6. Global Search across both Mezmurs and Films
app.get("/api/search", (req, res) => {
  const { q, type, language, year, category, sortBy } = req.query;
  const query = typeof q === "string" ? q.toLowerCase().trim() : "";

  let mezmurs = [...db.mezmurs];
  let films = [...db.films];

  if (query) {
    mezmurs = mezmurs.filter(m => matchMezmurSearch(m, query));
    films = films.filter(f => matchFilmSearch(f, query));
  }

  if (language && language !== "all") {
    const langLower = String(language).toLowerCase();
    mezmurs = mezmurs.filter(m => m.language.toLowerCase() === langLower);
    films = films.filter(f => f.language.toLowerCase() === langLower);
  }

  if (year && year !== "all") {
    mezmurs = mezmurs.filter(m => String(m.year) === String(year));
    films = films.filter(f => String(f.year) === String(year));
  }

  if (category && category !== "all") {
    mezmurs = mezmurs.filter(m => m.category === category);
    films = films.filter(f => f.category === category);
  }

  if (sortBy === "most_viewed") {
    mezmurs.sort((a, b) => b.views - a.views);
    films.sort((a, b) => b.views - a.views);
  } else if (sortBy === "oldest") {
    mezmurs.sort((a, b) => a.year - b.year);
    films.sort((a, b) => a.year - b.year);
  } else if (sortBy === "alphabetical") {
    mezmurs.sort((a, b) => a.title.localeCompare(b.title));
    films.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    mezmurs.sort((a, b) => b.year - a.year);
    films.sort((a, b) => b.year - a.year);
  }

  const finalType = type || "all";
  const returnMezmurs = finalType === "all" || finalType === "mezmur" ? mezmurs : [];
  const returnFilms = finalType === "all" || finalType === "film" ? films : [];

  res.json({
    total: returnMezmurs.length + returnFilms.length,
    mezmurs: returnMezmurs,
    films: returnFilms
  });
});

// ---------------- SHARES & COMMENTS ---------------- //

function findMedia(type: string, id: string): Mezmur | SpiritualFilm | undefined {
  if (type === "mezmur") return db.mezmurs.find(m => m.id === id);
  if (type === "film") return db.films.find(f => f.id === id);
  return undefined;
}

app.post("/api/share/:type/:id", (req, res) => {
  const media = findMedia(req.params.type, req.params.id);
  if (!media) {
    res.status(404).json({ error: "Media not found" });
    return;
  }
  media.shares = (media.shares || 0) + 1;
  saveDB(db);
  res.json({ shares: media.shares });
});

app.get("/api/comments/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const comments = db.comments
    .filter(c => c.mediaType === type && c.mediaId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ total: comments.length, comments });
});

const lastCommentAt = new Map<string, number>();

app.post("/api/comments/:type/:id", requireAuth, (req: AuthedRequest, res) => {
  const { type, id } = req.params;
  if (!findMedia(type, id)) {
    res.status(404).json({ error: "Media not found" });
    return;
  }
  const text = String(req.body?.text || "").trim();
  if (!text || text.length > 1000) {
    res.status(400).json({ error: "Comment must be between 1 and 1000 characters." });
    return;
  }
  const user = req.user!;
  const now = Date.now();
  if (now - (lastCommentAt.get(user.id) || 0) < 5000) {
    res.status(429).json({ error: "Please wait a moment before commenting again." });
    return;
  }
  lastCommentAt.set(user.id, now);

  const comment: MediaComment = {
    id: `comment-${crypto.randomUUID()}`,
    mediaType: type as MediaComment["mediaType"],
    mediaId: id,
    userId: user.id,
    userName: user.name,
    text,
    createdAt: new Date().toISOString()
  };
  db.comments.push(comment);
  saveDB(db);
  res.status(201).json(comment);
});

app.delete("/api/comments/:commentId", requireAuth, (req: AuthedRequest, res) => {
  const comment = db.comments.find(c => c.id === req.params.commentId);
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  if (comment.userId !== req.user!.id && req.user!.role !== "admin") {
    res.status(403).json({ error: "You can only delete your own comments." });
    return;
  }
  db.comments = db.comments.filter(c => c.id !== comment.id);
  saveDB(db);
  res.json({ success: true });
});

// ---------------- ADMIN ---------------- //

app.get("/api/admin/users", requireAdmin, (req, res) => {
  const users = db.users.map(u => ({
    ...toPublicUser(u),
    commentCount: db.comments.filter(c => c.userId === u.id).length
  }));
  res.json({ users });
});

app.patch("/api/admin/users/:id", requireAdmin, (req: AuthedRequest, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  const role = req.body?.role;
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (role !== "admin" && role !== "user") {
    res.status(400).json({ error: "role must be 'admin' or 'user'" });
    return;
  }
  if (user.id === req.user!.id) {
    res.status(400).json({ error: "You cannot change your own role." });
    return;
  }
  user.role = role;
  saveDB(db);
  res.json({ user: toPublicUser(user) });
});

app.delete("/api/admin/users/:id", requireAdmin, (req: AuthedRequest, res) => {
  if (req.params.id === req.user!.id) {
    res.status(400).json({ error: "You cannot delete your own account." });
    return;
  }
  db.users = db.users.filter(u => u.id !== req.params.id);
  db.sessions = db.sessions.filter(s => s.userId !== req.params.id);
  db.comments = db.comments.filter(c => c.userId !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

app.get("/api/admin/comments", requireAdmin, (req, res) => {
  const comments = [...db.comments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 200)
    .map(c => {
      const media = findMedia(c.mediaType, c.mediaId);
      return { ...c, mediaTitle: media ? `${media.titleAmharic} — ${media.titleEnglish}` : c.mediaId };
    });
  res.json({ comments });
});

app.post("/api/admin/reset", requireAdmin, (req, res) => {
  db = { ...db, ...seedCatalog() };
  saveDB(db);
  res.json({ message: "Catalog reset to authentic seed data successfully" });
});

// ---------------- SHARE PREVIEWS (Open Graph) ---------------- //

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Shared links look like /?type=mezmur&id=... ; give link previews (Telegram, WhatsApp, Facebook) the item's title and thumbnail.
function injectShareMeta(html: string, req: Request) {
  const media = findMedia(String(req.query.type || ""), String(req.query.id || ""));
  if (!media) return html;
  const title = escapeHtml(`${media.titleAmharic} — ${media.titleEnglish} | ZemaHub`);
  const description = escapeHtml(media.descriptionEnglish || media.descriptionAmharic || "");
  const url = escapeHtml(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  const tags = [
    `<meta property="og:type" content="${req.query.type === "film" ? "video.movie" : "music.song"}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${escapeHtml(media.thumbnailUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`
  ].join("\n    ");
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />\n    ${tags}`);
}

// ---------------- VITE MIDDLEWARE & SERVER START ---------------- //
async function startServer() {
  db = await loadDB();
  console.log(`Storage: ${storage.name}`);

  app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite: ViteDevServer = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.get("/", async (req, res, next) => {
      if (!req.query.id) return next();
      try {
        const raw = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, raw);
        res.type("html").send(injectShareMeta(html, req));
      } catch (err) {
        next(err);
      }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      res.type("html").send(injectShareMeta(indexHtml, req));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZemaHub Server running on http://localhost:${PORT}`);
  });
}

// Write pending changes before the host stops the process (e.g. Render redeploy or idle spin-down).
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    try {
      await storage.flush();
    } finally {
      process.exit(0);
    }
  });
}

startServer().catch((error) => {
  console.error("ZemaHub failed to start:", error);
  process.exit(1);
});
