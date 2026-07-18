# 🚀 NIBMCodeX 2.0 — Project Anchor

> **Event Website** for the NIBMCodeX 2.0 Hackathon  
> **Stack**: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · anime.js · Lenis · Framer Motion  
> **Git Branch**: `content/homepage-data`  

---

## 📋 Table of Contents

1. [Project Understanding](#-project-understanding)
2. [Implemented Changes ✅](#-implemented-changes)
3. [Open Items / Placeholders 📌](#-open-items--placeholders)
4. [Brainstormed Ideas 💡](#-brainstormed-ideas)
5. [Codebase Map](#-codebase-map)
6. [Branding Guidelines](#-branding-guidelines)
7. [Tech Stack & Dependencies](#-tech-stack--dependencies)
8. [Development Commands](#-development-commands)

---

## 🧠 Project Understanding

**NIBMCodeX 2.0** is a hackathon/tech event organized by **NIBM (National Institute of Business Management)** in Sri Lanka. This is an event landing page to showcase the event, timeline, and provide information to potential participants.

### Event Format
The event consists of multiple phases:
1. **Branch Awareness Sessions** — Roadshows across NIBM branches
2. **Galle & Matara** — Awareness sessions at southern campuses
3. **Kandy & Kurunegala KIC** — Sessions in central region
4. **AI/ML Workshop** — Dedicated tech workshop
5. **Summit** — Main hackathon event
6. **IEEE Xtreme 20.0** — 24-Hour Coding Challenge (global competition)

### Design Aesthetic
- **Theme**: Cyber/Tron futuristic
- **Colors**: Navy backgrounds (`#0a0e17`), cyan accents (`#67e8f9`, `#22d3ee`, `#06b6d4`)
- **Typography**: Inter (sans-serif), Space Mono (monospace)
- **Visual Style**: `clip-slanted` cut corners on cards, gradient overlays, backdrop blur, glowing borders

---

## ✅ Implemented Changes

### 1. Timeline (`src/components/Timeline.tsx`)
| Before | After |
|--------|-------|
| Registration Opens → Team Formation → Opening Ceremony → Coding Sprint → Final Pitches | Branch Awareness Sessions → Galle & Matara → Kandy & Kurunegala KIC → AI/ML Workshop → Summit → IEEE Xtreme 20.0 |
| Specific dates (Oct 1, Oct 15, Oct 22) | "Coming Soon" placeholders |
| 5 milestones | 6 milestones |

### 2. Footer Contact Info (`src/components/Footer.tsx`)
| Field | Before | After |
|-------|--------|-------|
| Email | `contact@nibmcodex.com` | `nibmcodex@gmail.com` |
| Phone | `+94 77 123 4567` | "Contact number coming soon" |
| Address | `NIBM, Colombo 07` | `NIBM World Wide, Vidya Mawatha, Colombo 07` |
| Quick Links | About, Schedule, Committee, Sponsors | About, Schedule, FAQ |

### 3. Hidden Sections (Code preserved, not rendered)
- **Registration** (`src/components/Registration.tsx`) — Form exists, hidden until backend ready
- **Sponsors** (`src/components/Sponsors.tsx`) — Placeholder data, hidden
- **Committee** (`src/components/Committee.tsx`) — Placeholder team, hidden

### 4. Header Navigation (`src/components/Header.tsx`)
- **Before**: About, Timeline, Committee, Sponsors, Register
- **After**: About, Timeline

### 5. Hero Branding (`src/components/Hero.tsx`)
- **Before**: `NIBM <span>CODEX</span> 2.0`
- **After**: `NIBM<span>CodeX</span><sup>2.0</sup>` (with cyan gradient on CodeX)
- Buttons updated: "Register Now" → "Learn More", "Learn More" → "View Timeline"

### 6. Header & Footer Logo Branding (`src/components/Header.tsx`, `src/components/Footer.tsx`)
- **Before**: `CodeX <span>2.0</span>` (missing NIBM)
- **After**: `NIBM<span>CodeX</span><sup>2.0</sup>` with matching gradient + `font-mono`

### 7. Metadata (`src/app/layout.tsx`)
- **Before**: `title: 'NIBM CodeX 2.0'` (spaced)
- **After**: `title: 'NIBMCodeX 2.0'` (no space)

---

## 📌 Open Items / Placeholders

### Waiting on User Input

| Item | Current Value | Component |
|------|--------------|-----------|
| ⏰ Event dates | `Oct 22-23` (badge) | `Hero.tsx` |
| 📍 Venue | `NIBM Auditorium` | `About.tsx` |
| 💰 Prize pool | `Rs 100K+` | `About.tsx` |
| 👥 Participant count | `200+` | `About.tsx` |
| 📅 Timeline dates | All marked "Coming Soon" | `Timeline.tsx` |
| 📞 Contact number | "Contact number coming soon" | `Footer.tsx` |
| 🔗 Social media URLs | `#` placeholders | `Footer.tsx` |

### Code Left for Future Use (Hidden)
- `src/components/Committee.tsx` — Organizing committee tree layout (placeholder names)
- `src/components/Sponsors.tsx` — Sponsor tiers grid (placeholder companies)
- `src/components/Registration.tsx` — Registration form (no backend)

### Animation Enhancement Goals (from spec)
- [ ] Smoother easing curves (`easeOutExpo` consistently)
- [ ] Subtle parallax on hero section
- [ ] Better FAQ accordion animation (replace `maxHeight` hack)
- [ ] Hover micro-interactions on cards and buttons
- [ ] Consider Framer Motion migration (already installed)

---

## 💡 Brainstormed Ideas

### Tier 1 — High Impact, Medium Effort
| Idea | Description |
|------|-------------|
| 🌐 **Particle network / Matrix rain** | Animated cyan particles or data streams on hero — fits Tron aesthetic perfectly |
| ⏱️ **Live countdown timer** | Countdown to Summit / IEEE Xtreme — builds urgency |
| 🎯 **Animated stat counters** | About numbers count up from 0 on scroll (`0 → 200+`) |
| 📊 **Scroll progress bar** | Thin cyan line across top of viewport |
| ❓ **Framer Motion FAQ accordion** | Replace `maxHeight` hack with smooth `AnimatePresence` |

### Tier 2 — Visual Polish
| Idea | Description |
|------|-------------|
| ⚡ **Glowing cursor trail** | Subtle cyan glow following mouse |
| 🌀 **3D tilt cards** | Timeline/About cards tilt with mouse movement |
| ⌨️ **Typewriter tagline** | Hero subtitle types itself out character by character |
| 🎬 **Section transition animations** | Framer Motion page transitions between sections |
| 🔄 **Smooth mobile nav** | Animated hamburger → overlay menu |

### Tier 3 — Content Additions
| Idea | Description |
|------|-------------|
| 🏆 **Prizes section** | Showcase winner tiers and prizes |
| 🎤 **Judges / Speakers** | Highlight notable event personalities |
| 📋 **Workshop schedule** | Detailed schedule table for AI/ML Workshop |
| 🗺️ **Venue map** | Embedded Google Map |
| 📸 **Gallery** | Past event photos |
| 📱 **PWA support** | "Installable" on mobile devices |
| 🔍 **SEO / Open Graph** | Rich social media preview cards |

---

## 🗺️ Codebase Map

```
nibmcodex-2.0/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + custom theme (navy, cyan colors)
│   │   ├── layout.tsx           # Root layout, fonts, metadata
│   │   └── page.tsx             # Page composition (7 active sections)
│   └── components/
│       ├── Header.tsx           # Sticky nav — About, Timeline only
│       ├── Hero.tsx             # Full-screen hero with cityscape BG
│       ├── About.tsx            # Event description + stat cards
│       ├── Timeline.tsx         # 6 milestones, alternating layout
│       ├── VerticalScrollMoment.tsx  # Parallax scroll break section
│       ├── FAQ.tsx              # Accordion, 4 questions
│       ├── Footer.tsx           # 4-column footer
│       ├── Committee.tsx        # 🔒 Hidden — org tree layout
│       ├── Sponsors.tsx         # 🔒 Hidden — sponsor tiers
│       ├── Registration.tsx     # 🔒 Hidden — registration form
│       └── SmoothScroll.tsx     # Lenis wrapper
├── public/images/               # BG images (cityscape, corridor, holodeck)
├── nibmcodex-spec.md            # Original deployment spec document
├── ANCHOR.md                    # ← This file
├── package.json
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

### Component Dependencies
- **anime.js**: Hero, About, Timeline, FAQ, Committee, Sponsors, Registration
- **Framer Motion**: Installed but **unused** (available for future)
- **Lenis (smooth-scroll)**: Wraps entire app via `SmoothScroll.tsx`
- **lucide-react**: Menu, X, ChevronDown icons

---

## 🎨 Branding Guidelines

### Canonical Name
- **Always** `NIBMCodeX 2.0` — one word, no space between NIBM and CodeX
- `NIBM` in **white** · `CodeX` in **cyan gradient** (`from-cyan-300 to-cyan-500`)
- `2.0` appears as **superscript** in cyan, styled with `font-mono`
- Format: `NIBM<span>CodeX</span><sup>2.0</sup>`

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `navy-900` | `#0a0e17` | Page background |
| `navy-800` | `#0d1326` | Card/form backgrounds |
| `navy-700` | `#111a36` | — |
| `cyan-300` | `#67e8f9` | Primary accent, links |
| `cyan-400` | `#22d3ee` | Hover states |
| `cyan-500` | `#06b6d4` | Buttons, bold accents |

### Signature Styles
- `clip-slanted` — custom `clip-path` polygon for futuristic card corners
- `font-mono` (Space Mono) — used for dates, stats, badges
- `font-sans` (Inter) — body text

---

## 🛠 Tech Stack & Dependencies

```json
{
  "next": "16.2.10",
  "react": "19.2.4",
  "tailwindcss": "^4",
  "animejs": "^3.2.2",
  "@studio-freight/lenis": "^1.0.42",
  "framer-motion": "^12.42.2",
  "lucide-react": "^1.25.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0"
}
```

---

## 🧪 Development Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm start        # Start production server
```

---

## 📝 Recent Git History

```
commit efb3b9f (HEAD -> content/homepage-data)
Update timeline, contact info, and hide placeholder sections

Modified:
  • nibmcodex-spec.md    (added)
  • src/app/layout.tsx   (metadata title)
  • src/app/page.tsx     (removed hidden sections)
  • src/components/Header.tsx   (nav links, branding)
  • src/components/Hero.tsx     (branding, buttons)
  • src/components/Footer.tsx   (contact info, branding)
  • src/components/Timeline.tsx (new milestones)
```

---

*Last updated: July 18, 2026 · Created with ❤️ by Buffy (Freebuff)*
