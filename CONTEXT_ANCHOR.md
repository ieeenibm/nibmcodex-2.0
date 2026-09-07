# NIBM CodeX 2.0 — Context Anchor & Development Handover

> **Purpose**: This file serves as an active context anchor for any developer or AI assistant picking up work on this repository across different machines. It summarizes the architecture, active branch, configuration, solved issues, SEO implementation, and testing instructions.
> **Last Updated**: 2026-09-07 (Branch: `feat/general-updates`)

---

## 1. Quick Start on a New Machine

```powershell
# 1. Clone & checkout active feature branch
git clone git@github.com:supunhg/nibmcodex-2.0.git
cd nibmcodex-2.0
git checkout feat/general-updates

# 2. Install dependencies & generate Prisma client
npm install
npx prisma generate

# 3. Set up environment variables
# Copy .env.example to .env.local and fill in the secrets (see Section 3)
cp .env.example .env.local

# 4. Verify TypeScript & build
npx tsc --noEmit
npm run build

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
  - If Git SSH gives `Could not resolve hostname github.com: Name or service not known`, run `ipconfig /flushdns` or retry the command 2–3 times.

---

## 3. Environment Variables Reference (`.env.local` / `.env`)

Create `.env` and `.env.local` at the root:

```env
# Cloudinary (Cloud Name for media, gallery, and partner assets)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="jwuioa0d"

# Local Development NeonDB PostgreSQL Connection String
DATABASE_URL="postgresql://neondb_owner:npg_uGF9Pgl3pKDc@ep-lucky-thunder-a5cco6tn-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Official Production NeonDB PostgreSQL Connection String (Vercel Project Settings)
# PRODUCTION_DATABASE_URL="postgresql://neondb_owner:npg_uGF9Pgl3pKDc@ep-aged-unit-a5caemwg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# Linked Neon Project ID: bitter-water-49125455

# JWT Secret for Pulse Mini Admin/Host Auth Cookies
JWT_SECRET="nibmcodex-pulse-mini-secret-jwt-key-2026"

# Pulse Mini Master Admin Credentials (supports username or email)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="codex2026"

# Ably Realtime WebSockets API Key (for zero-latency quiz sync)
ABLY_API_KEY="your-ably-api-key"
```

---

## 4. System Architecture & Tech Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | Next.js 16.2.10 (App Router) | Turbopack enabled, React 19.2.4 |
| **Database & ORM** | Neon Serverless PostgreSQL + Prisma 7.9.1 | Schema in `prisma/schema.prisma` (`@prisma/adapter-pg`) |
| **Realtime Engine** | Ably WebSockets + SSE fallback | `/api/ably/auth`, `/api/play/[id]/stream` |
| **Media Delivery** | Cloudinary (`next-cloudinary`) | Cloud Name: `jwuioa0d`, fallback in `src/lib/cloudinary.ts` |
| **Styling & UI** | Tailwind CSS v4 + Framer Motion 12 | Lucide Icons, glassmorphism UI |
| **Physics & Scrolling** | Matter.js 0.20 + Lenis Smooth Scroll | Interactive physics drift wall |
| **Authentication** | Stateless JWT in HTTP-only cookies | Validated via `src/lib/auth.ts` |

---

## 5. Core Features & Key Files

### A. Pulse Mini (Live Interactive Quiz & Arena)
- **Direct Play Lobby (`/play`)**:
  - `src/app/play/page.tsx`: Participant join lobby.
  - *Testing Note*: The countdown overlay locking users out has been **removed**, allowing immediate access to enter the Nickname and Game PIN.
- **Interactive Quiz Room (`/play/[id]`)**:
  - `src/app/play/[id]/page.tsx`: Realtime quiz room with Ably WebSocket connection & SSE fallback.
  - Question rendering: Multiple Choice (MCQ), Free Text, and Poll types.
  - Streak multipliers, time-based scoring, live answer submission, feedback collection.
- **Host Console (`/admin/host/[id]`)**:
  - Controls session state (`DRAFT` $\rightarrow$ `ACTIVE` $\rightarrow$ `ENDED`), advances questions, triggers timer reveals, and manages live leaderboards.
- **Admin Dashboard (`/admin/dashboard`)**:
  - Create and configure quiz sessions and questions (`/admin/dashboard/session/[id]`).
  - Manage host accounts (`/admin/dashboard/hosts`).
  - View host documentation (`/admin/dashboard/docs`).
- **Realtime API Endpoints**:
  - `/api/ably/auth`: Issues scoped Ably client capability tokens.
  - `/api/play/[id]/stream`: SSE fallback stream for live event distribution.
  - `/api/play/[id]/state`: Session state snapshot.
  - `/api/play/[id]/submit`: Participant answer submission.
  - `/api/play/[id]/feedback`: Post-session feedback.

### B. SEO Architecture & Google Search Console (Google Starter Guide Aligned)
- **Metadata Configuration (`src/app/layout.tsx`)**:
  - Canonical URL: `https://nibmcodex.nibmieee.lk`
  - Title Template: `%s | NIBMCodeX 2.0` (Default: `NIBMCodeX 2.0 | The Ultimate Hackathon Experience`)
  - Description: 24-hour hackathon bringing together the brightest minds to solve real-world challenges through innovation and technology.
  - OpenGraph & Twitter Cards with 1200×630 wide cityscape preview image.
- **Ownership Verification**:
  - Single primary Google verification token: `google: 'v1RPsCzsvEyW6qNOTK-ULZ46tYmZVG37giMPMYRVR4Q'`.
  - The secondary token (`LN5K-dbVc16qefWhvDw4NGYUlyRibg42pGNMwslGwC4`) has been removed.
- **Structured Data (JSON-LD)**:
  - Injected Schema.org `Event` detailing dates (`2026-10-31` to `2026-11-01`), venue (`NIBM Colombo`), and organizer (`IEEE Student Branch of NIBM`).
- **Robots & Sitemap**:
  - `public/robots.txt`: Blocks aggressive AI scrapers (`GPTBot`, `ClaudeBot`, etc.), disallows `/admin/`, `/play/`, `/api/`, and declares sitemap.
  - `src/app/sitemap.ts`: Dynamic sitemap providing URLs, `lastModified`, and priority weights for `/`, `/gallery`, `/nibmcodex-1.0`.
- **Branded Error Handling**:
  - Custom `src/app/not-found.tsx` (404) and `src/app/error.tsx` (500) boundaries.

### C. Landing Page & Interactive UI
- `src/app/page.tsx`:
  - `Header`, `Hero`, `CountdownSection`, `SectionSeparator`, `LandingGallery`, `EventSeries`, `Timeline`, `Committee`, `Partners`, `VerticalScrollMoment`, `FAQ`, `Footer`.
  - Floating `RegistrationPill` and interactive `WhatsAppBubble`.
- `src/components/Partners.tsx`:
  - National Partner (Ministry of Digital Economy) & Ecosystem Partner (SLASSCOM) side by side.
  - Dialog (Connectivity Partner).
  - Dilexus & 99x (Knowledge Partners).
  - Strategic & Community Partners (LSIG, Gavel Club, AZEA, EventFrame).
- `src/app/gallery/page.tsx`: High-resolution event memories powered by Cloudinary.
- `src/app/nibmcodex-1.0/page.tsx`: Inaugural hackathon archive.

---

## 6. Testing & Quality Verification Guide

Before pushing or creating pull requests, execute these verification steps:

```powershell
# 1. Type Check
npx tsc --noEmit

# 2. Production Build
npm run build

# 3. Testing Pulse Mini Locally
# Step A: Start dev server
npm run dev

# Step B: Log into Host Dashboard
# Navigate to http://localhost:3000/admin/login
# Username: admin
# Password: codex2026 (or custom env password)

# Step C: Create or activate a session
# Copy the 6-character Join Code (e.g. ABC123)

# Step D: Join as Participant
# In a private/incognito window, navigate directly to http://localhost:3000/play
# (No countdown lock will block access)
# Enter Nickname and Join Code -> Join Session
```

---

## 7. Current Project Status & Backlog

- [x] Merged and pulled latest `feat/general-updates` branch changes (`358eefa..9f7ea5b`).
- [x] Removed secondary Google site verification token (`LN5K-dbVc16qefWhvDw4NGYUlyRibg42pGNMwslGwC4`) from `layout.tsx`.
- [x] Removed countdown overlay locking users out of `/play` for direct testing.
- [x] Integrated Ably Realtime WebSockets with SSE fallback.
- [x] Security hardening: fixed IDOR vulnerabilities, scoped Ably auth, cascade deletions.
- [x] Performance optimizations: downscaled partner assets, Cloudinary CDN delivery.
- [x] Google SEO Starter Guide alignment: sitemap, robots.txt, canonical, schema.org.
- [ ] End-to-end load testing of Pulse Mini quiz with multiple concurrent participant sessions.
- [ ] Complete DNS cutover for `nibmcodex.nibmieee.lk` to official Vercel production deployment.
- [ ] Prepare PR from `feat/general-updates` to `main`.