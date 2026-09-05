# NIBM CodeX 2.0 — Context Anchor & Development Handover

> **Purpose**: This file serves as an active context anchor for any developer or AI assistant picking up work on this repository across different machines. It summarizes the architecture, active branch, configuration, solved issues, and outstanding tasks.

---

## 1. Quick Start on a New Machine

```powershell
# 1. Clone & checkout active feature branch
git clone git@github.com:supunhg/nibmcodex-2.0.git
cd nibmcodex-2.0
git checkout feat/general-updates

# 2. Install dependencies
npm install

# 3. Generate Prisma Client for NeonDB
npx prisma generate

# 4. Set up environment variables
# Copy .env.example to .env.local and fill in the secrets (see Section 3)
cp .env.example .env.local

# 5. Start dev server
npm run dev
```

---

## 2. Active Branch & Git Workflow

- **Active Development Branch**: `feat/general-updates`
- **Main Branch**: `main`
- **Remote Origin**: `git@github.com:supunhg/nibmcodex-2.0.git` (redirected from `chandisarandeni/nibmcodex-2.0`)
- **Important Windows / PowerShell Notes**:
  - Windows PowerShell does **not** support `&&`. Always use `;` to chain commands (e.g. `git add . ; git commit -m "..."`).
  - If Git SSH gives `Could not resolve hostname github.com: Name or service not known`, simply retry the push/pull command 2–3 times; it succeeds on retry.

---

## 3. Environment Variables Reference (`.env.local` / `.env`)

Create `.env` and `.env.local` at the root:

```env
# Cloudinary (Cloud Name for all media, gallery, and committee assets)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="jwuioa0d"

# Local Development NeonDB PostgreSQL Connection String (30-day retention dev branch)
DATABASE_URL="postgresql://neondb_owner:npg_uGF9Pgl3pKDc@ep-lucky-thunder-a5cco6tn-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Official Production NeonDB PostgreSQL Connection String (Used in Vercel Project Settings)
# PRODUCTION_DATABASE_URL="postgresql://neondb_owner:npg_uGF9Pgl3pKDc@ep-aged-unit-a5caemwg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# Linked Neon Project ID: bitter-water-49125455

# JWT Secret for Pulse Mini Admin/Host Auth Cookies
JWT_SECRET="nibmcodex-pulse-mini-secret-jwt-key-2026"

# Pulse Mini Master Admin Credentials (supports username or email)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="codex2026"
```

---

## 4. System Architecture & Tech Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | Next.js 16.2.10 (App Router) | Turbopack enabled, React 19 |
| **Database & ORM**| Neon Serverless PostgreSQL + Prisma | Schema in `prisma/schema.prisma` |
| **Media Delivery** | Cloudinary (`next-cloudinary`) | Cloud Name: `jwuioa0d`, fallback in `src/lib/cloudinary.ts` |
| **Styling & UI** | Tailwind CSS + Framer Motion | Lucide Icons, glassmorphism UI |
| **Realtime Engine**| SSE (`/api/play/[id]/stream`) | Real-time event streams + optimistic polling fallback |
| **Authentication** | Stateless JWT in HTTP-only cookies | Validated via `src/lib/auth.ts` |

---

## 5. Core Features & Key Files

### A. Pulse Mini (Live Interactive Quiz & Arena)
- **Host / Admin Dashboard**: `src/app/admin/dashboard/page.tsx`, `src/app/admin/host/[id]/page.tsx`
- **Host Login & Password Rotation**: `src/app/admin/login/page.tsx`, `src/app/api/auth/login/route.ts`
  - *Note*: Authenticates with either `ADMIN_USERNAME` or `ADMIN_EMAIL`. Supports environment variable credentials rotation on Vercel deployments.
- **Participant Play Arena**: `src/app/play/page.tsx`, `src/app/play/[id]/page.tsx`
- **API Endpoints**:
  - `src/app/api/play/[id]/stream/route.ts`: Server-Sent Events (SSE) stream delivering real-time question and timer events.
  - `src/app/api/play/[id]/state/route.ts`: Session state snapshot.
  - `src/app/api/play/[id]/submit/route.ts`: Participant answer submission.
  - `src/app/api/play/[id]/feedback/route.ts`: Post-session feedback & free-form word submissions.
- **Dual Session Modes**:
  - *Competitive Mode*: Timed questions, leaderboard calculations, live rankings.
  - *Non-Competitive / Survey Mode*: Open free-answer input with dynamic floating animations on-screen.

### B. Gallery Hub & Event Memories
- **Gallery Page**: `src/app/gallery/page.tsx`, `src/components/gallery/GalleryHub.tsx`
- **Timeline & Previews**: `src/components/Timeline.tsx`, `src/components/ui/MemoriesGallery.tsx`
- **Cloudinary Integration**:
  - All `<CldImage>` instances import `CLOUDINARY_CONFIG` from `src/lib/cloudinary.ts`.
  - Injected fallback in `next.config.ts` prevents any runtime crash if `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is missing.

### C. Partnership Logos & Branding
- **Component**: `src/components/Partners.tsx`
  - Ministry of Digital Economy (National Partner) and SLASSCOM (Ecosystem Partner) side by side with individual headings.
  - Dialog positioned right below as Connectivity Partner.
  - Dilexus and 99x side by side under dedicated "Knowledge Partners" section right after Dialog (without individual card titles).
  - Strategic & Community Partners (LSIG, Gavel Club, AZEA, EventFrame) follow after Knowledge Partners.

---

## 6. Important Gotchas & Solved Bugs

1. **Next.js `allowedDevOrigins`**:
   - `next.config.ts` uses dynamic IP detection via Node's `os.networkInterfaces()` to allow connections from local Wi-Fi / Hotspot IPs (e.g. `192.168.137.87`, `192.168.36.12`).
   - You can connect phones or secondary devices on the same Wi-Fi without origin blocking.
2. **Turbopack Cache Panic**:
   - Do **not** delete `.next` or `.next/dev` while `npm run dev` is running, as Turbopack's SST database handles will panic.
   - If Turbopack panics with `Failed to restore task data`, stop the server (`Ctrl+C`), run `Remove-Item -Recurse -Force .next`, and restart `npm run dev`.
3. **Cloudinary Missing Cloud Name**:
   - If an empty string is set in `.env.local` for `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `src/lib/cloudinary.ts` provides `'jwuioa0d'` fallback to ensure components never crash.

---

## 7. Current Project Status & Backlog

- [x] Pulse Mini admin username login & credentials rotation support.
- [x] Ministry + SLASSCOM and Dilexus + 99x updated logo layout.
- [x] Cloudinary missing cloud name runtime error resolved with permanent fallbacks.
- [x] Dynamic LAN origin authorization in `next.config.ts`.
- [x] Migrated database to official Neon project (`bitter-water-49125455`), linked production and synced schema on both dev and prod branches.
- [x] Neon agent tooling and Vercel AI plugin configured.
- [ ] Complete DNS cutover for `nibmcodex.nibmieee.lk` from personal to official Vercel account.
- [ ] Final end-to-end rehearsal of Pulse Mini live question timer switchover and zero-latency SSE connection under load.
- [ ] Prepare merge request from `feat/general-updates` into `main` before deployment.
