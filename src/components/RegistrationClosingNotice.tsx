'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, X, Flame, Trophy, AlertTriangle, Users } from 'lucide-react';

const REGISTRATION_DEADLINE = new Date('2026-10-25T23:59:59+05:30');
const IEEEXTREME_URL = 'https://ieeextreme.org';
const IEEE_JOIN_URL = 'https://www.ieee.org/membership/join/index.html';
const STORAGE_KEY = 'nibmcodex_xtreme_reg_visits';

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

function calculateTimeLeft() {
  const now = Date.now();
  const diff = REGISTRATION_DEADLINE.getTime() - now;

  if (diff <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isClosed: true,
    };
  }

  const total = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
    isClosed: false,
  };
}

export default function RegistrationClosingNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Visit counter: auto-show on 1st visit and every 5th visit
  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      if (count === 0 || count >= 5) {
        setIsOpen(true);
        localStorage.setItem(STORAGE_KEY, '1');
      } else {
        localStorage.setItem(STORAGE_KEY, String(count + 1));
      }
    } catch {
      setIsOpen(true);
    }
    setMounted(true);
  }, []);

  // Real-time 1-second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!mounted || isDismissed) return null;

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 350);
  };

  return (
    <>
      {/* Click-away backdrop on mobile when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 sm:hidden cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-label="Close registration notice overlay"
          />
        )}
      </AnimatePresence>

      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slide-over popup card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-[calc(100vw-2rem)] sm:w-88 md:w-96 rounded-2xl border border-amber-500/40 bg-navy-950/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 relative overflow-hidden"
              style={{ transformOrigin: 'bottom right' }}
            >
              {/* Ambient Glowing Cyber Accents */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Header Row */}
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        {timeLeft.isClosed ? 'REGISTRATION CLOSED' : 'CLOSING SOON'}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-base tracking-tight mt-0.5">
                      IEEEXtreme 20.0
                    </h3>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-slate-400 hover:text-white hover:bg-white/10 transition-colors p-1.5 rounded-lg cursor-pointer"
                  aria-label="Close registration popup"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Notice Description */}
              <div className="relative z-10 text-xs text-slate-300 leading-relaxed mb-3">
                <p>
                  Global registrations for <strong className="text-white font-semibold">IEEEXtreme 20.0</strong> are entering their final countdown on our end. Form your team of up to 3 and register before the deadline.
                </p>
              </div>

              {/* High-Tech Countdown Display */}
              <div className="relative z-10 bg-navy-900/80 border border-amber-500/30 rounded-xl p-3 sm:p-3.5 mb-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    {timeLeft.isClosed ? 'Portal Status' : 'Time Remaining'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Oct 25 • 23:59 SLST
                  </span>
                </div>

                {timeLeft.isClosed ? (
                  <div className="text-center py-2">
                    <span className="font-mono text-xl sm:text-2xl font-black text-red-400 uppercase tracking-widest">
                      REGISTRATION ENDED
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <div className="bg-navy-950/90 border border-white/10 rounded-lg py-2 px-1 text-center">
                      <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 block tabular-nums leading-none mb-1">
                        {timeLeft.days}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                        Days
                      </span>
                    </div>

                    <div className="bg-navy-950/90 border border-white/10 rounded-lg py-2 px-1 text-center">
                      <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 block tabular-nums leading-none mb-1">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                        Hours
                      </span>
                    </div>

                    <div className="bg-navy-950/90 border border-white/10 rounded-lg py-2 px-1 text-center">
                      <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 block tabular-nums leading-none mb-1">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                        Mins
                      </span>
                    </div>

                    <div className="bg-navy-950/90 border border-white/10 rounded-lg py-2 px-1 text-center">
                      <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 block tabular-nums leading-none mb-1 animate-pulse">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                        Secs
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 space-y-2">
                <a
                  href={IEEEXTREME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] group"
                >
                  <Trophy className="w-4 h-4 text-navy-950" />
                  <span>Register on IEEEXtreme</span>
                  <ExternalLink className="w-3.5 h-3.5 text-navy-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3 text-cyan-400" />
                    Need IEEE Membership?
                  </span>
                  <a
                    href={IEEE_JOIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors flex items-center gap-0.5"
                  >
                    <span>Join IEEE</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-10">
                <span>Oct 31 • 24hr Challenge</span>
                <span className="text-amber-400/90">ieeextreme.org</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Button */}
        <div className="relative group/bubble">
          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-navy-900 border border-white/20 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition-all shadow-md opacity-0 group-hover/bubble:opacity-100 z-10 cursor-pointer"
            title="Dismiss notice"
            aria-label="Dismiss registration button"
          >
            <X size={11} strokeWidth={2.5} />
          </button>

          {/* Outer Ambient Glow Ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full blur-md opacity-60 group-hover/bubble:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Main Bubble Button */}
          <motion.button
            onClick={() => setIsOpen((prev) => !prev)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 shadow-xl shadow-amber-500/25 transition-all duration-300 cursor-pointer overflow-hidden"
            aria-label="Toggle IEEEXtreme Registration Notice"
          >
            <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center relative overflow-hidden">
              {/* Inner ambient animated glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 group-hover/bubble:opacity-100 transition-opacity" />

              <Trophy className="w-6 h-6 text-amber-400 group-hover/bubble:text-white transition-colors relative z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />

              {/* Pulsing indicator when closed */}
              {!isOpen && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 border border-navy-950" />
                </span>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </>
  );
}
