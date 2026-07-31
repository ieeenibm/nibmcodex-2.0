# 🔍 NIBMCodeX 2.0 — Codebase Analysis (SCAN)

> Generated: July 31, 2026 · Branch: `feat/nibmcodex-1.0-page`

---

## 1. What the project is

A **two-page event marketing site** for the NIBM IEEE Student Branch's hackathon series:

- **`/` (Home)** — Hero, countdown to **Oct 31, 2026**, event timeline (awareness sessions → AI workshop → Code Grid Summit → IEEEXtreme 20.0), animated marquee separator, FAQ, footer.
- **`/nibmcodex-1.0` (Previous Edition)** — Retrospective page for last year's IEEEXtreme 19.0: hero, stats, photo gallery with lightbox, organizing committee + team roster, partners, key moments, FAQ.

**Stack:** Next.js 16.2.10 (App Router, Turbopack) · React 19.2.4 · Tailwind CSS v4 · Framer Motion 12 · Lenis smooth scroll · lucide-react. The aesthetic is a consistent dark navy + cyan "Tron/holodeck" sci-fi theme with custom components (Preloader, ClickSpark, NoiseOverlay, SpotlightCard, Magnetic, FlipCountdown, custom Lenis scroll bridge).

## 2. Health check results

| Check | Result |
|---|---|
| `next build` | ✅ Passes (both routes, static) |
| `tsc --noEmit` | ✅ Passes |
| `npm run lint` | ❌ **7 errors + 1 warning** |
| Image references | ✅ All 170 assets verified on disk |

## 3. Issues found (prioritized)

### 🔴 High priority

**1. `xs:` breakpoints don't exist in Tailwind v4 — countdown is broken on mobile**
`FlipCountdown.tsx` uses `xs:text-[10px]`, `xs:w-[52px]`, `xs:h-[72px]`, `xs:gap-*`. Verified against `tailwindcss/theme.css` — **only `sm/md/lg/xl` exist** (no `xs`), and the compiled CSS output contains **zero `xs:` rules**. Every `xs:` class is dead code. The flip timer (which recent commits worked on font-size fixes for) will not size correctly on phones. **Fix:** add `--breakpoint-xs` to `@theme` in `globals.css`, or replace `xs:` with `sm:`/`max-sm:` variants.

**2. `npm run lint` fails (7 errors)** — all easy fixes. Fix-order note: `FlipCountdown` and `SectionSeparator` errors affect **live rendered code** (fix first); `About` and `Committee` errors live in **commented-out components** on the home page (fix when re-enabling):
- `FlipCountdown.tsx` ×2 — `react-hooks/set-state-in-effect` (`setChars` + `setMounted` effects) — **live**
- `SectionSeparator.tsx` ×2 — literal `///` text nodes parsed as comments — **live**
- `About.tsx` ×2 — unescaped `'` in JSX text — commented out
- `Committee.tsx` ×1 — `member: any` (`TeamCard`) — commented out
- `Preloader.tsx` ×1 (warning) — missing `texts.length` dep

**3. Scroll position isn't reset on route change**
`PageTransition` animates route swaps, but **nothing resets Lenis scroll to top** on navigation. Click "1.0 Gallery" from the bottom of the home page and `/nibmcodex-1.0` will open mid-page. This is the classic Lenis + App Router gap — add a `pathname`-watched `scrollTo(0)` (with `immediate: true`) in `SmoothScroll` or `PageTransition`.

### 🟠 Medium priority

**4. `@studio-freight/lenis@1.0.42` is a deprecated package**
The `@studio-freight` scope was abandoned; the maintained package is now **`lenis`** (unscoped). Pinned to an old 1.0.42 that won't receive fixes. Migration is a drop-in: `npm i lenis` and change the import in `SmoothScroll.tsx` + `package.json`.

**5. Dead/unused components**
- `CustomCursor.tsx` — defined, **never imported anywhere**. Dead code (or intended for `layout.tsx`).
- `nibmcodex-1.0/WhatWeProvided.tsx` + `BackToMainCta.tsx` — full sections built but **not imported** in `nibmcodex-1.0/page.tsx`. Either wire them in (they're good content!) or delete.
- Home page has `About`, `Committee`, `Sponsors`, `Registration` commented out. These contain **placeholder/fake data** (Alex Johnson, TechVision, CloudDynamics…) — real content needed when re-enabling.

**6. Accessibility gaps**
- Gallery lightbox: no `role="dialog"`, no `aria-modal`, **no keyboard support** (Esc/arrows don't work), no focus trap, no body scroll lock.
- FAQ accordion buttons lack `aria-expanded`/`aria-controls`; icon-only buttons (lightbox nav, mobile menu) lack `aria-label`.
- Global `body { user-select: none }` blocks copying content/text everywhere.

**7. Hardcoded values**
- Google Analytics ID `G-GP5FN2R0VN` hardcoded in `layout.tsx` → should be `process.env.NEXT_PUBLIC_GA_ID`.
- `allowedDevOrigins: ['192.168.36.12']` in `next.config.ts` — a private LAN IP; other devs/machines will hit dev-origin errors. Make it env-driven.

### 🟡 Low priority / polish

**8. Git hygiene** — `tsconfig.tsbuildinfo` is tracked in git (build artifact, should be in `.gitignore`); `next-env.d.ts` has an uncommitted auto-generated diff (harmless but keep it consistent).

**9. Missing SEO/social metadata** — no `metadataBase`, no OG/Twitter tags, no favicon. Add per-page `metadata` (the 1.0 page has none) plus OG image for link sharing.

**10. `useScrollProgress` custom hook** — reimplements framer-motion's `useScroll` by calling `getBoundingClientRect()` on every scroll frame (layout read per frame → potential jank). Also `viewportHeight` is set in the context but **never consumed** anywhere. Consider replacing with framer-motion's native `useScroll({ target, offset })` now that scroll is bridged via Lenis's `scrollY`.

**11. Image optimization** — `fill` images lack `sizes` (Next warns + serves oversized); hero images use `quality={100}` unconditionally.

**12. Sponsors "Become a Partner" button and Registration form** do nothing (no link/backend). When Registration is re-enabled you'll need a submission integration.

## 4. Recommendations (top 5)

1. **Fix the `xs:` breakpoint issue** (or the countdown is broken on mobile) + clear the 7 lint errors.
2. **Reset scroll to top on route change** for a polished multi-page feel.
3. **Migrate `@studio-freight/lenis` → `lenis`** before it causes compat drift with Next 16.
4. **Wire in `WhatWeProvided`/`BackToMainCta`** on the 1.0 page (free, finished content) and delete `CustomCursor` or mount it.
5. **Add dialog semantics + keyboard support to the lightbox**, then run a Lighthouse/axe pass.

## 5. Verdict

A solid, visually rich, well-organized codebase that builds cleanly and has excellent asset discipline (all images verified). The biggest real bugs are the inert `xs:` breakpoints and the missing scroll-reset; everything else is cleanup and hardening.
