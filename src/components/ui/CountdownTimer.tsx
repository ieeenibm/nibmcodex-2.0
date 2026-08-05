'use client';
import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

/* ── helpers ─────────────────────────────────────────── */
function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  const total = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

/* ── unit: value box + label ─────────────────────────── */
function Unit({ value, label }: { value: string; label: string }) {
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
            className="absolute font-mono text-2xl sm:text-4xl md:text-5xl font-bold text-cyan-400 tabular-nums leading-none tracking-tight"
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
export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const raf = requestAnimationFrame(() => {
      setTime(calcTimeLeft(targetDate));
      setMounted(true);
      interval = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (interval) clearInterval(interval);
    };
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
      <Unit value={time.days} label="Days" />
      <Separator />
      <Unit value={time.hours} label="Hours" />
      <Separator />
      <Unit value={time.minutes} label="Mins" />
      <Separator />
      <Unit value={time.seconds} label="Secs" />
    </div>
  );
}
