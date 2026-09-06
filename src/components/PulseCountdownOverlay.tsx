'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ArrowLeft, Clock, Sparkles } from 'lucide-react';

export const PULSE_MINI_UNLOCK_DATE = new Date('2026-09-11T00:00:00+05:30');

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

function calculateTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

function CountdownBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="glass-panel-light border border-cyan-500/20 rounded-2xl min-w-[70px] sm:min-w-[95px] md:min-w-[110px] px-3 py-4 sm:py-5 relative flex justify-center items-center overflow-hidden shadow-[0_0_25px_rgba(34,211,238,0.1)]">
        <span className="invisible font-mono text-3xl sm:text-5xl md:text-6xl font-black tabular-nums leading-none">
          00
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 25, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 25 }}
            className="absolute font-mono text-3xl sm:text-5xl md:text-6xl font-black text-cyan-400 tabular-nums leading-none"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-slate-400 font-semibold">
        {label}
      </span>
    </div>
  );
}

export default function PulseCountdownOverlay({
  onUnlocked,
  isBypassed = false,
}: {
  onUnlocked: () => void;
  isBypassed?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(PULSE_MINI_UNLOCK_DATE));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const initial = calculateTimeLeft(PULSE_MINI_UNLOCK_DATE);
    setTimeLeft(initial);
    if (!initial || isBypassed) {
      onUnlocked();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(PULSE_MINI_UNLOCK_DATE);
      setTimeLeft(remaining);
      if (!remaining) {
        clearInterval(interval);
        onUnlocked();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onUnlocked, isBypassed]);

  if (!mounted || isBypassed || !timeLeft) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(12px)', transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 bg-navy-950/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
    >
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="text-slate-400 hover:text-cyan-300 font-bold font-mono tracking-tight text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          BACK TO NIBMCODEX
        </Link>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          ARENA LOCKED
        </div>
      </div>

      {/* Center Countdown Content */}
      <div className="my-auto max-w-2xl mx-auto text-center relative z-10 py-10">
        {/* Animated Icon Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="inline-flex p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl mb-6 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
        >
          <Gamepad2 className="w-12 h-12 text-cyan-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-block px-4 py-1 mb-4 border border-cyan-400/20 text-cyan-400 text-xs font-mono uppercase tracking-[0.25em] rounded-full bg-cyan-950/60">
            Pre-Summit Lockout
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Pulse Mini <span className="text-gradient-cyan">Arena</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-10 font-light leading-relaxed">
            The live interactive quiz & polling arena unlocks before the Code Grid Summit.
            When the countdown concludes, this overlay will automatically dissolve to reveal the game terminal.
          </p>
        </motion.div>

        {/* Countdown Digit Boxes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-10"
        >
          <CountdownBox value={timeLeft.days} label="Days" />
          <span className="font-mono text-2xl sm:text-4xl text-slate-600 font-bold -mt-6">:</span>
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <span className="font-mono text-2xl sm:text-4xl text-slate-600 font-bold -mt-6">:</span>
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <span className="font-mono text-2xl sm:text-4xl text-slate-600 font-bold -mt-6">:</span>
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </motion.div>

        {/* Target Time Footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-navy-900/80 border border-white/10 text-xs text-slate-400 font-mono shadow-inner"
        >
          <Clock size={14} className="text-cyan-400" />
          <span>Launch Target: Friday, September 11, 2026 • 12:00 AM (Midnight) SLST</span>
        </motion.div>
      </div>

      {/* Bottom Footer note */}
      <div className="w-full text-center relative z-10 pt-4">
        <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">
          NIBMCodeX 2.0 • Code Grid Summit Series
        </p>
      </div>

      {/* Decorative Neon Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/15 via-navy-950 to-navy-950 pointer-events-none" />
    </motion.div>
  );
}
