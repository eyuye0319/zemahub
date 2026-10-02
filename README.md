# ZemaHub (ዜማሀብ) — Ethiopian Orthodox Mezmur & Spiritual Media Discovery

A bilingual digital sanctuary dedicated to discovering, searching, streaming, and preserving Ethiopian Orthodox Tewahedo Church sacred hymns (Mezmur), St. Yared liturgical chants, and faith-centered spiritual films.

## Features
- **Bilingual Experience**: Seamless Amharic (አማርኛ) and English localization.
- **Mezmur Discovery**: Search and filter by category (Mariam, Trinity, Angels, Great Lent, Fast of Assumption, etc.), singer/choir, language, and release year.
- **Spiritual Films**: Curated hagiographies (ገድላት), biblical stories, and orthodox cinema.
- **YouTube Media Player**: Integrated iframe playback with reliable fallback handling and direct YouTube links.
- **Personal Library**: Save favorite mezmurs and films to a persistent favorites drawer.
- **Accounts**: Users register and sign in with email and password; admins and regular users have separate permissions.
- **Comments**: Signed-in users comment on any mezmur or film; users delete their own comments, admins moderate all of them.
- **Sharing**: Share to WhatsApp, Telegram, Facebook, X, the phone share sheet, or copy a link. Shared links open the item directly and show a title and thumbnail preview.
- **Admin Management**: Manage the catalog, user roles, and comments from the admin dashboard.

## Catalog
47 mezmurs and 25 spiritual films, each linked to a real YouTube upload with Amharic and English titles and descriptions, credited to its source channel. Seed data lives in `src/db/initial_data.ts`; bump `CATALOG_VERSION` there to roll new seed content into an existing database (admin-added items are kept).

## Running
1. `npm install`
2. Copy `.env.example` to `.env` and set `ADMIN_EMAIL` / `ADMIN_PASSWORD` (the first admin is created on first start).
3. `npm run dev` and open http://localhost:3000

Runtime data (users, sessions, comments) is stored in `data/zemahub_db.json` (git-ignored) by default. Set `MONGODB_URI` to store it in MongoDB instead — needed on hosts without a persistent disk.

## Deploying (Render free plan + MongoDB Atlas free)
`render.yaml` deploys the app on Render's free plan. Create a free MongoDB Atlas cluster, then in Render choose **New → Blueprint**, pick this repository, and fill in `MONGODB_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Every `git push` to `main` redeploys.

## REST API
Authenticate with `Authorization: Bearer <token>` (returned by register/login). The web app and a future mobile app share the same API.

| Method & path | Access | Purpose |
|---|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` | public | `{ token, user }` |
| `GET /api/auth/me`, `POST /api/auth/logout` | user | session |
| `GET /api/mezmur`, `GET /api/films`, `GET /api/search` | public | catalog with filters |
| `GET/PUT /api/me/favorites` | user | favorites synced per account |
| `GET /api/comments/:type/:id` | public | comments for `mezmur` or `film` |
| `POST /api/comments/:type/:id`, `DELETE /api/comments/:id` | user | post / delete own (admin: any) |
| `POST /api/share/:type/:id` | public | record a share |
| `POST/PUT/DELETE /api/mezmur`, `/api/films` | admin | manage catalog |
| `GET /api/admin/users`, `PATCH/DELETE /api/admin/users/:id`, `GET /api/admin/comments` | admin | users & moderation |

Developed by **Wubgzer Alemayehu**.
