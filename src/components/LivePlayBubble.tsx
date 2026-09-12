'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, ExternalLink, X, Trophy, Bot, Flame, QrCode } from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  url: string;
  icon: typeof Gamepad2;
  accentColor: 'cyan' | 'purple' | 'amber';
  status: string;
}

const GAMES: GameItem[] = [
  {
    id: 'quiz',
    title: 'NIBMCodeX Quiz Arena',
    badge: 'LIVE ARENA',
    tagline: 'Competitive Quiz & Trivia',
    description: 'Buzzer rounds, technical challenges, and live podium battles.',
    url: 'https://nibmcodex-quiz.nibmieee.lk',
    icon: Trophy,
    accentColor: 'cyan',
    status: 'ACTIVE NOW',
  },
  {
    id: 'ai',
    title: 'NIBMCodeX Real or Rendered',
    badge: 'AI EVENT',
    tagline: 'AI vs Human Challenge',
    description: 'Test your perception — can you distinguish real photos from generative AI?',
    url: 'https://nibmcodex-ai.nibmieee.lk',
    icon: Bot,
    accentColor: 'purple',
    status: 'ACTIVE NOW',
  },
  {
    id: 'hunt',
    title: 'NIBMCodeX Golden QR Hunt',
    badge: 'SCAVENGER HUNT',
    tagline: 'Find, Scan & Solve',
    description: 'Search the summit venue for hidden golden QR codes, solve trivia, and climb the leaderboard.',
    url: 'https://nibmcodex-hunt.nibmieee.lk',
    icon: QrCode,
    accentColor: 'amber',
    status: 'ACTIVE NOW',
  },
];

const GAMES_UNLOCK_DATE = new Date('2026-09-12T08:00:00+05:30');

export default function LivePlayBubble() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkUnlocked = () => {
      const isParamPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview_games');
      setIsUnlocked(Date.now() >= GAMES_UNLOCK_DATE.getTime() || isParamPreview);
    };
    checkUnlocked();
    const timer = setInterval(checkUnlocked, 1000);

    return () => {
      clearInterval(timer);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!mounted || isDismissed || !isUnlocked) return null;

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 250);
  };

  return (
    <div
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-3 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Expanded Games Flyout */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-2rem)] sm:w-88 md:w-96 bg-navy-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 relative overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            {/* Background Cyber Accent Glows */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-white font-bold text-sm tracking-tight">NIBMCodeX Games</h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Select an interactive arena to enter</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-slate-400 hover:text-white hover:bg-white/10 transition-colors p-1.5 rounded-lg cursor-pointer"
                aria-label="Close games menu"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Game Cards List */}
            <div className="space-y-2.5 relative z-10">
              {GAMES.map((game) => {
                const IconComponent = game.icon;
                const isCyan = game.accentColor === 'cyan';
                const isAmber = game.accentColor === 'amber';

                return (
                  <a
                    key={game.id}
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group p-3 sm:p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                      isCyan
                        ? 'bg-gradient-to-r from-navy-900/90 to-navy-900/60 border-cyan-500/25 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
                        : isAmber
                        ? 'bg-gradient-to-r from-navy-900/90 to-navy-900/60 border-amber-500/25 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
                        : 'bg-gradient-to-r from-navy-900/90 to-navy-900/60 border-purple-500/25 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10'
                    }`}
                  >
                    {/* Hover Glow Gradient */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                        isCyan
                          ? 'bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/5'
                          : isAmber
                          ? 'bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5'
                          : 'bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/5'
                      }`}
                    />

                    <div className="flex items-start gap-3 relative z-10">
                      {/* Game Icon */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 ${
                          isCyan
                            ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400'
                            : isAmber
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 group-hover:border-amber-400'
                            : 'bg-purple-500/15 border-purple-500/30 text-purple-400 group-hover:border-purple-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4
                            className={`text-white font-bold text-sm tracking-tight transition-colors truncate ${
                              isCyan
                                ? 'group-hover:text-cyan-300'
                                : isAmber
                                ? 'group-hover:text-amber-300'
                                : 'group-hover:text-purple-300'
                            }`}
                          >
                            {game.title}
                          </h4>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                              isCyan
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30'
                                : isAmber
                                ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                                : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {game.badge}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium mb-1 line-clamp-1">
                          {game.tagline}
                        </p>

                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2">
                          {game.description}
                        </p>

                        {/* CTA button line */}
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isCyan
                                ? 'text-cyan-400'
                                : isAmber
                                ? 'text-amber-400'
                                : 'text-purple-400'
                            }`}
                          >
                            <Flame className="w-3 h-3" />
                            {game.status}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-bold group-hover:underline ${
                              isCyan
                                ? 'text-cyan-400'
                                : isAmber
                                ? 'text-amber-400'
                                : 'text-purple-400'
                            }`}
                          >
                            Launch Game
                            <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Bottom Cyber Tag */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400/70" />
                NIBMCodeX 2.0 Arenas
              </span>
              <span className="text-cyan-400/80">3 Interactive Platforms</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Game Icon Bubble */}
      <div className="relative group/bubble">
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-900 border border-white/20 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition-all shadow-md opacity-0 group-hover/bubble:opacity-100 z-10 cursor-pointer"
          title="Dismiss game button"
          aria-label="Dismiss games button"
        >
          <X size={11} strokeWidth={2.5} />
        </button>

        {/* Outer Glow Ring */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full blur-md opacity-60 group-hover/bubble:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Bubble Button */}
        <motion.button
          onClick={() => setIsExpanded((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-xl shadow-cyan-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
          aria-label="Toggle NIBMCodeX Games Menu"
        >
          <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center relative overflow-hidden">
            {/* Subtle inner animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 group-hover/bubble:opacity-100 transition-opacity" />

            <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover/bubble:text-white transition-colors relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />

            {/* Pulsing Live indicator */}
            {!isExpanded && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 border border-navy-950" />
              </span>
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}
