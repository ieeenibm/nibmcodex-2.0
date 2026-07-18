# NIBMCodeX 2.0 — First Deployment Spec

## Overview

**Project**: NIBMCodeX 2.0 Hackathon Website
**Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, anime.js, Lenis, Framer Motion
**Goal**: Event landing page for the NIBM CodeX hackathon — primarily to showcase the event and provide info
**First Deployment Date**: TBD

---

## 1. Branding & Naming

### Canonical Name
- **Always** use `NIBMCodeX 2.0` as one word (no spaces between NIBM and CodeX)
- No variations or different capitalizations across the site
- The `NIBMCodeX` part is stylized with `NIBM` in white and `CodeX` in cyan gradient (as in Hero)
- The `2.0` suffix always appears as superscript/stylized accent

### Logo / Brand Mark
- No separate logo file exists — use text-based branding only
- Maintain consistent styling: `font-mono font-bold` with cyan gradient for "CodeX"

---

## 2. Sections to Hide (Keep Code, Hide Visually)

For the first deployment, the following sections should be **hidden from the page** but remain in the codebase for future use:

| Section | Component File | Notes |
|---------|---------------|-------|
| Registration | `src/components/Registration.tsx` | Form exists but no backend — hide for now |
| Sponsors | `src/components/Sponsors.tsx` | Sponsor data is placeholder — hide for now |
| Committee | `src/components/Committee.tsx` | Committee members are placeholder — hide for now |

### Navigation Updates
- **Header** (`src/components/Header.tsx`): Remove `Committee`, `Sponsors`, and `Register` from `navLinks` array
- Only keep: `About`, `Timeline` in the navigation
- **Footer** (`src/components/Footer.tsx`): Keep footer links but remove references to hidden sections if any

### Page Layout (`src/app/page.tsx`)
- Comment out or remove imports and usage of hidden components
- Keep: `Header`, `Hero`, `About`, `Timeline`, `VerticalScrollMoment`, `FAQ`, `Footer`
- Remove: `Registration`, `Sponsors`, `Committee`

---

## 3. Content Updates

### 3.1 About Section (`src/components/About.tsx`)
**Current hardcoded values need updating:**

| Field | Current Value | Updated Value |
|-------|--------------|---------------|
| Dates | `Oct 22-23` | `[PLACEHOLDER — USER TO PROVIDE]` |
| Venue | `NIBM Auditorium` | `[PLACEHOLDER — USER TO PROVIDE]` |
| Prize Pool | `Rs 100K+` | `[PLACEHOLDER — USER TO PROVIDE]` |
| Participants | `200+` | `[PLACEHOLDER — USER TO PROVIDE]` |

### 3.2 Timeline Section (`src/components/Timeline.tsx`)
**Current milestones need updating:**

1. ~~Registration Opens — October 1, 2026~~
2. ~~Team Formation — October 15, 2026~~
3. ~~Opening Ceremony — October 22, 2026 - 09:00 AM~~
4. ~~Coding Sprint — Oct 22 - Oct 23~~
5. ~~Final Pitches & Awards — October 23, 2026 - 05:00 PM~~

**New milestones**: `[PLACEHOLDER — USER TO PROVIDE]`

### 3.3 Hero Section (`src/components/Hero.tsx`)
- Badge text: `October 22-23, 2026 • NIBM` — update when dates confirmed
- Title: `NIBM CODEX 2.0` — should be `NIBMCodeX 2.0` (or styled as `NIBM` + `CodeX` + `2.0`)
- Subtitle: `The ultimate 48-hour hackathon experience` — confirm if tagline should stay

### 3.4 Footer Contact Info (`src/components/Footer.tsx`)
**Current values need updating:**

| Field | Current Value | Updated Value |
|-------|--------------|---------------|
| Email | `contact@nibmcodex.com` | `nibmcodex@gmail.com` |
| Phone | `+94 77 123 4567` | `[TBD — NOT YET DECIDED]` |
| Address | `NIBM, Colombo 07` | `NIBM World Wide, Vidya Mawatha, Colombo 07` |
| Social Links | Placeholder `#` links | `[PLACEHOLDER — USER TO PROVIDE]` |

---

## 4. Animation Enhancements

The current site uses `anime.js` for scroll-triggered animations. Enhance these:

### Current Animations
- Hero: Staggered fade-in on load (`hero-anim`)
- About: Staggered fade-in on scroll (`about-anim`)
- Timeline: Slide-in from left with line animation (`timeline-item`, `timeline-line`)
- Committee: Scale-in (`oc-card`) — **hidden but keep animations for future use**
- Sponsors: Fade-in (`sponsor-anim`) — **hidden but keep animations for future use**
- FAQ: Fade-in (`faq-anim`)

### Enhancement Goals
- [ ] Smoother easing curves (use `easeOutExpo` consistently)
- [ ] Add subtle parallax to hero section
- [ ] Improve FAQ accordion animation (currently uses `maxHeight` hack)
- [ ] Add hover micro-interactions to cards and buttons
- [ ] Consider using Framer Motion for new animations (already installed but unused)

---

## 5. Technical Notes

### Dependencies (from `package.json`)
- `@studio-freight/lenis` — smooth scrolling
- `animejs` — scroll-triggered animations
- `framer-motion` — **installed but unused** — consider migrating animations
- `clsx` — className utility
- `tailwind-merge` — Tailwind class deduplication
- `lucide-react` — icons

### Styling
- Tailwind CSS 4 with custom theme colors in `globals.css`
- Custom `clip-slanted` clip-path for futuristic card styling
- Fonts: `Inter` (sans-serif) + `Space Mono` (monospace)

---

## 6. Files to Modify

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Remove/comment out Registration, Sponsors, Committee imports and usage |
| `src/components/Header.tsx` | Remove Committee, Sponsors, Register from `navLinks` |
| `src/components/Hero.tsx` | Update branding to `NIBMCodeX 2.0`, update date badge |
| `src/components/About.tsx` | Update stats with real data (when provided) |
| `src/components/Timeline.tsx` | Update milestones with real data (when provided) |
| `src/components/Footer.tsx` | Update contact info, remove hidden section links |
| `src/app/layout.tsx` | Verify metadata title matches `NIBMCodeX 2.0` |

---

## 7. Acceptance Criteria

1. ✅ Brand name displays as `NIBMCodeX 2.0` consistently across all components
2. ✅ Registration, Sponsors, Committee sections are hidden from page
3. ✅ Header navigation only shows About and Timeline
4. ✅ About section stats are updated (when data provided)
5. ✅ Timeline milestones are updated (when data provided)
6. ✅ Footer contact info is updated (when data provided)
7. ✅ All animations enhanced with smoother transitions
8. ✅ No TypeScript errors (`npm run build` passes)
9. ✅ No ESLint errors (`npm run lint` passes)
10. ✅ Responsive design maintained (mobile + desktop)

---

## 8. Open Items (Waiting on User)

- [ ] Updated event dates
- [ ] Updated venue information
- [ ] Updated prize pool details
- [ ] Updated participant count
- [ ] New timeline milestones
- [ ] Contact phone number (not yet decided)
- [ ] Social media links (LinkedIn, Instagram, Facebook)
- [ ] Any additional branding guidelines

---

## 9. Out of Scope (First Deployment)

- Registration form backend integration
- Sponsor section functionality
- Committee section with real team data
- Payment/ticketing integration
- CMS integration for content management
- Multi-language support
