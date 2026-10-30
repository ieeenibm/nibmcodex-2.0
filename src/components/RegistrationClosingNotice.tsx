'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, X, Trophy, Users, Sparkles, Copy, Check, BookOpen } from 'lucide-react';

const REGISTRATION_DEADLINE = new Date('2026-10-25T23:59:59+05:30');
const IEEEXTREME_URL = 'https://ieeextreme.org';
const IEEE_JOIN_URL = 'https://www.ieee.org/membership/join/index.html';
const AMBASSADOR_CODE = 'IEEEXTREME20SB10274';
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
  const [copied, setCopied] = useState(false);
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

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(AMBASSADOR_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard API restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

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
            className="fixed inset-0 z-40 bg-black/60 sm:hidden cursor-pointer"
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
        {/* Slide-over popup card styled exactly with the flyer palette */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-[calc(100vw-2rem)] sm:w-92 md:w-96 rounded-2xl border border-[#5a1cbd]/50 bg-[#05022d]/95 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden"
              style={{ transformOrigin: 'bottom right' }}
            >
              {/* Flyer-inspired ambient glowing background orbs */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#4f58fd]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#5a1cbd]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#7bdfff]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header Row */}
              <div className="flex items-start justify-between pb-3.5 mb-3 border-b border-[#5a1cbd]/30 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5a1cbd]/40 via-[#4f58fd]/30 to-[#7bdfff]/20 border border-[#7bdfff]/40 flex items-center justify-center text-[#7bdfff] shrink-0 shadow-[0_0_20px_rgba(123,223,255,0.25)]">
                    <Trophy className="w-5 h-5 text-[#7bdfff] animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#7bdfff] font-bold bg-[#5a1cbd]/30 border border-[#7bdfff]/30 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7bdfff] animate-ping" />
                        {timeLeft.isClosed ? 'REGISTRATION CLOSED' : 'EXTENDED FOR 24H'}
                      </span>
                    </div>
                    <h3 className="text-white font-extrabold text-base tracking-tight mt-0.5 flex items-center gap-1.5">
                      <span>IEEEXtreme</span>
                      <span className="text-[#7bdfff] drop-shadow-[0_0_10px_rgba(123,223,255,0.6)]">20.0</span>
                    </h3>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-[#d7d5e3]/70 hover:text-white hover:bg-white/10 transition-colors p-1.5 rounded-lg cursor-pointer"
                  aria-label="Close registration popup"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Extended Headline Banner directly inspired by the poster */}
              <div className="relative z-10 mb-3.5 rounded-xl p-2.5 bg-gradient-to-r from-[#5a1cbd]/30 via-[#4f58fd]/20 to-[#5a1cbd]/30 border border-[#5a1cbd]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7bdfff] shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-extrabold tracking-wider text-[#bfe0e7] uppercase block text-[10px]">
                      Registrations Extended
                    </span>
                    <span className="font-semibold text-[#e2b9f5] block">
                      Final 24 Hours Window Open
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7bdfff] bg-[#03011a]/80 px-2 py-1 rounded-md border border-[#7bdfff]/30 whitespace-nowrap">
                  24H EXT
                </span>
              </div>

              {/* High-Tech Countdown Display (Deep Space & Neon Ice-Cyan) */}
              <div className="relative z-10 bg-[#03011a]/90 border border-[#5a1cbd]/40 rounded-xl p-3 sm:p-3.5 mb-3.5 shadow-inner">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#d7d5e3] mb-2.5">
                  <span className="flex items-center gap-1.5 text-[#7bdfff] font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#7bdfff]" />
                    {timeLeft.isClosed ? 'Portal Status' : 'Time Remaining'}
                  </span>
                  <span className="text-[10px] text-[#e2b9f5]/80 font-semibold">
                    Oct 25 • 23:59 SLST
                  </span>
                </div>

                {timeLeft.isClosed ? (
                  <div className="text-center py-2.5">
                    <span className="font-mono text-lg sm:text-xl font-black text-[#e92527] uppercase tracking-widest">
                      REGISTRATION ENDED
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <div className="bg-[#05022d] border border-[#5a1cbd]/40 rounded-lg py-2 px-1 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#7bdfff] block tabular-nums leading-none mb-1 drop-shadow-[0_0_8px_rgba(123,223,255,0.4)]">
                        {timeLeft.days}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#d7d5e3]/70 block font-medium">
                        Days
                      </span>
                    </div>

                    <div className="bg-[#05022d] border border-[#5a1cbd]/40 rounded-lg py-2 px-1 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#7bdfff] block tabular-nums leading-none mb-1 drop-shadow-[0_0_8px_rgba(123,223,255,0.4)]">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#d7d5e3]/70 block font-medium">
                        Hours
                      </span>
                    </div>

                    <div className="bg-[#05022d] border border-[#5a1cbd]/40 rounded-lg py-2 px-1 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#7bdfff] block tabular-nums leading-none mb-1 drop-shadow-[0_0_8px_rgba(123,223,255,0.4)]">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#d7d5e3]/70 block font-medium">
                        Mins
                      </span>
                    </div>

                    <div className="bg-[#05022d] border border-[#5a1cbd]/40 rounded-lg py-2 px-1 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#7bdfff] block tabular-nums leading-none mb-1 animate-pulse drop-shadow-[0_0_8px_rgba(123,223,255,0.6)]">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#d7d5e3]/70 block font-medium">
                        Secs
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ambassador Referral Code Pill (From Flyer) */}
              <div className="relative z-10 mb-3.5 bg-[#03011a]/80 border border-[#4f58fd]/40 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#d7d5e3]/70 block font-medium">
                    Ambassador Referral Code
                  </span>
                  <code className="text-xs font-mono font-bold text-[#bfe0e7] tracking-wider block truncate">
                    {AMBASSADOR_CODE}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#5a1cbd]/40 hover:bg-[#5a1cbd]/70 border border-[#7bdfff]/30 text-[#7bdfff] hover:text-white text-[11px] font-mono font-medium transition-all cursor-pointer"
                  title="Copy Referral Code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7bdfff]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 space-y-2">
                <a
                  href={IEEEXTREME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#4f58fd] via-[#5a1cbd] to-[#7bdfff] hover:from-[#396bfe] hover:via-[#6025bf] hover:to-[#bfe0e7] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#4f58fd]/30 active:scale-[0.98] group cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="tracking-wide">Register on IEEEXtreme</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Direct Link to Rulebook */}
                <Link
                  href="/rulebook"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#03011a]/80 hover:bg-[#5a1cbd]/30 border border-[#5a1cbd]/40 hover:border-[#7bdfff]/50 text-[#bfe0e7] hover:text-white text-xs font-mono rounded-xl transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#7bdfff]" />
                  <span>Physical Participation Rulebook</span>
                </Link>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#d7d5e3]">
                  <span className="flex items-center gap-1 text-[#d7d5e3]/80">
                    <Users className="w-3 h-3 text-[#7bdfff]" />
                    Need IEEE Membership?
                  </span>
                  <a
                    href={IEEE_JOIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7bdfff] hover:text-[#bfe0e7] font-semibold underline underline-offset-2 transition-colors flex items-center gap-0.5"
                  >
                    <span>Join IEEE</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Footer Row */}
              <div className="mt-3 pt-2.5 border-t border-[#5a1cbd]/20 flex items-center justify-between text-[10px] font-mono text-[#d7d5e3]/70 relative z-10">
                <Link href="/rulebook" className="hover:text-[#7bdfff] transition-colors underline underline-offset-2">
                  View Rulebook & PDF
                </Link>
                <span className="text-[#7bdfff] font-medium">ieeextreme.org</span>
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
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#05022d] border border-white/20 text-[#d7d5e3] hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition-all shadow-md opacity-0 group-hover/bubble:opacity-100 z-10 cursor-pointer"
            title="Dismiss notice"
            aria-label="Dismiss registration button"
          >
            <X size={11} strokeWidth={2.5} />
          </button>

          {/* Outer Ambient Glow Ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5a1cbd] via-[#4f58fd] to-[#7bdfff] rounded-full blur-md opacity-60 group-hover/bubble:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Main Bubble Button */}
          <motion.button
            onClick={() => setIsOpen((prev) => !prev)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#5a1cbd] via-[#4f58fd] to-[#7bdfff] shadow-xl shadow-[#4f58fd]/30 transition-all duration-300 cursor-pointer overflow-hidden"
            aria-label="Toggle IEEEXtreme Registration Notice"
          >
            <div className="w-full h-full rounded-full bg-[#05022d] flex items-center justify-center relative overflow-hidden">
              {/* Inner ambient animated glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4f58fd]/20 via-transparent to-[#5a1cbd]/30 group-hover/bubble:opacity-100 transition-opacity" />

              <Trophy className="w-6 h-6 text-[#7bdfff] group-hover/bubble:text-white transition-colors relative z-10 drop-shadow-[0_0_10px_rgba(123,223,255,0.7)]" />

              {/* Pulsing indicator when closed */}
              {!isOpen && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7bdfff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7bdfff] border border-[#05022d]" />
                </span>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </>
  );
}
