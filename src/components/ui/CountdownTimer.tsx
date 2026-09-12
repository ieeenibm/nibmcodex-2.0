'use client';
import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

/* ── helpers ─────────────────────────────────────────── */
function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

function calcTimeLeft(target: Date, endDate?: Date) {
  const now = Date.now();
  const startMs = target.getTime();
  const endMs = endDate ? endDate.getTime() : startMs;

  if (now < startMs) {
    const diff = startMs - now;
    const total = Math.floor(diff / 1000);
    return {
      status: 'upcoming' as const,
      isPast: false,
      isOngoing: false,
      days: pad(Math.floor(total / 86400)),
      hours: pad(Math.floor((total % 86400) / 3600)),
      minutes: pad(Math.floor((total % 3600) / 60)),
      seconds: pad(total % 60),
    };
  }

  if (now >= startMs && now < endMs) {
    return {
      status: 'ongoing' as const,
      isPast: false,
      isOngoing: true,
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  return {
    status: 'ended' as const,
    isPast: true,
    isOngoing: false,
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };
}

/* ── unit: value box + label ─────────────────────────── */
function Unit({ value, label, colorClass = 'text-cyan-400' }: { value: string; label: string; colorClass?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="glass-panel-light rounded-lg min-w-[56px] px-2 py-3 sm:min-w-[76px] sm:px-4 sm:py-4 md:min-w-[92px] relative flex justify-center items-center overflow-hidden">
        {/* Invisible span to keep the container size consistent */}
        <span className="invisible font-mono text-2xl sm:text-4xl md:text-5xl font-bold tabular-nums leading-none tracking-tight">
          00
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute font-mono text-2xl sm:text-4xl md:text-5xl font-bold ${colorClass} tabular-nums leading-none tracking-tight`}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500/80">
        {label}
      </span>
    </div>
  );
}

/* ── separator colon ─────────────────────────────────── */
function Separator() {
  return (
    <span className="font-mono text-xl sm:text-3xl md:text-4xl font-bold text-slate-600 select-none">
      :
    </span>
  );
}

/* ── main countdown ───────────────────────────────────── */
export default function CountdownTimer({
  targetDate,
  endDate,
  colorClass = 'text-cyan-400',
  isOngoing: forcedOngoing,
}: {
  targetDate: Date;
  endDate?: Date;
  colorClass?: string;
  isOngoing?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(() => calcTimeLeft(targetDate, endDate));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const raf = requestAnimationFrame(() => {
      setTime(calcTimeLeft(targetDate, endDate));
      setMounted(true);
      interval = setInterval(() => setTime(calcTimeLeft(targetDate, endDate)), 1000);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (interval) clearInterval(interval);
    };
  }, [targetDate, endDate]);

  if (!mounted) return null;

  const showOngoing = forcedOngoing ?? time.isOngoing;

  if (showOngoing) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="glass-panel-light rounded-xl px-8 py-6 sm:px-14 sm:py-8 relative flex flex-col items-center justify-center overflow-hidden border border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_35px_rgba(34,211,238,0.2)]">
          {/* Subtle glowing animated pulse */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 animate-pulse pointer-events-none" />

          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`font-mono text-2xl sm:text-4xl md:text-5xl font-bold ${colorClass} tracking-widest leading-none`}
            >
              ONGOING
            </motion.span>
          </div>

          <div className="mt-3 sm:mt-3.5 flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-cyan-300/80 relative z-10">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Summit In Progress</span>
            <span className="text-white/20">•</span>
            <span>Ends 5:00 PM Today</span>
          </div>
        </div>
      </div>
    );
  }

  if (time.isPast) {
    return (
      <div className="flex items-center justify-center">
        <div className="glass-panel-light rounded-lg px-8 py-5 sm:px-12 sm:py-7 relative flex justify-center items-center overflow-hidden border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={`font-mono text-2xl sm:text-4xl md:text-5xl font-bold ${colorClass} tracking-widest`}
          >
            ENDED
          </motion.span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
      <Unit value={time.days} label="Days" colorClass={colorClass} />
      <Separator />
      <Unit value={time.hours} label="Hours" colorClass={colorClass} />
      <Separator />
      <Unit value={time.minutes} label="Mins" colorClass={colorClass} />
      <Separator />
      <Unit value={time.seconds} label="Secs" colorClass={colorClass} />
    </div>
  );
}
