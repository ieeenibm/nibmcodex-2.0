# NIBMCodeX 2.0 🚀

> The ultimate tech symposium and hackathon experience

Welcome to the official repository for **NIBMCodeX 2.0**. This project is a modern, high-performance web application built to deliver a premium user experience with smooth animations, dynamic design, and optimal performance. It also powers **Pulse Mini**, a real-time gamified polling and quiz engine for live audiences.

## ✨ Features

- **Next.js App Router**: Utilizing the latest React features, Server Actions, and optimized routing.
- **Pulse Mini Real-Time Engine**: Custom built Server-Sent Events (SSE) streaming architecture for live host-to-audience quizzes with SWR fallbacks.
- **Tailwind CSS v4**: Utility-first styling with brutalist / tech-inspired aesthetics (`clip-slanted`).
- **Framer Motion**: Smooth, spring-based animations, 3D masonry layouts, and transitions.
- **Robust Database Integration**: Prisma ORM with `@prisma/adapter-pg` connecting to PostgreSQL (Neon).
- **Atomic Scoring System**: Streak multipliers and time-based scoring evaluated directly in atomic SQL transactions.
- **Lenis Smooth Scroll**: Premium scrolling experience integrated across the app.
- **Immersive UI Components**: Custom components including Preloader, Noise Overlays, DriftWall, and Click Sparks to elevate the visual aesthetics.
- **Google Analytics Integrated**: Built-in usage tracking using `next/script`.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Turbopack)
- **Database**: PostgreSQL (via [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v18.17 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chandisarandeni/nibmcodex-2.0.git
   cd nibmcodex-2.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` or `.env.local` file and provide your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgres://user:password@hostname:5432/dbname"
   JWT_SECRET="your_secure_secret"
   ```

4. Push the Prisma schema:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Contains the Next.js App Router pages and global layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Database configuration, authentication helpers, and SSE streaming utilities.
- `scripts`: E2E simulation scripts for testing the Pulse Mini real-time engine.
- `public`: Static assets like images and fonts.

## 📄 License

This project is proprietary and closed-source. All rights reserved.
