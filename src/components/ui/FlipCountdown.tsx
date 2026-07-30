'use client';
import { useState, useEffect, useCallback } from 'react';
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

/* ── single digit flip card ──────────────────────────── */
function FlipDigit({ digit, idx }: { digit: string; idx: number }) {
  return (
    <div className="relative w-[48px] h-[64px] xs:w-[56px] xs:h-[76px] sm:w-[72px] sm:h-[96px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${idx}-${digit}`}
          initial={{ rotateX: -90, opacity: 0, scaleY: 0.75 }}
          animate={{ rotateX: 0, opacity: 1, scaleY: 1 }}
          exit={{ rotateX: 90, opacity: 0, scaleY: 0.75 }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0 [perspective:600px] [transform-style:preserve-3d]"
        >
          {/* Card body */}
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#0e1740] to-[#070c24] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden relative">
            {/* Glossy top reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Top half */}
            <div className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center pb-1.5 sm:pb-2.5 bg-gradient-to-b from-[#0e1740] to-[#0a1130]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-mono leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {digit}
              </span>
            </div>

            {/* Divider line with glow */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] z-10 -translate-y-[1px]">
              <div className="h-full bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent relative">
                <div className="absolute inset-0 bg-navy-950/60" style={{ clipPath: 'inset(0 30% 0 30%)' }} />
              </div>
            </div>
            {/* Small centre dots (screw heads) */}
            <div className="absolute top-1/2 left-2 w-[3px] h-[3px] rounded-full bg-navy-950 border border-white/[0.06] -translate-y-1/2" />
            <div className="absolute top-1/2 right-2 w-[3px] h-[3px] rounded-full bg-navy-950 border border-white/[0.06] -translate-y-1/2" />

            {/* Bottom half */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center pt-1.5 sm:pt-2.5 bg-gradient-to-t from-[#070c24] to-[#0a1130]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-mono leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {digit}
              </span>
            </div>

            {/* Bottom shadow edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/40" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── unit: two digits + label ────────────────────────── */
function FlipUnit({ value, label }: { value: string; label: string }) {
  const [chars, setChars] = useState(() => value.split(''));
  useEffect(() => {
    setChars(value.split(''));
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="flex gap-[3px] sm:gap-1">
        {chars.map((ch, i) => (
          <FlipDigit key={`${label}-pos${i}`} digit={ch} idx={i} />
        ))}
      </div>

      {/* Label */}
      <div className="relative">
        <span className="text-[10px] xs:text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
          {label}
        </span>
        {/* Underline accent */}
        <motion.div
          className="absolute -bottom-0.5 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />
      </div>
    </div>
  );
}

/* ── separator colon ─────────────────────────────────── */
function Colon() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 pb-7 sm:pb-9">
      <motion.div
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]"
      />
      <motion.div
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]"
      />
    </div>
  );
}

/* ── main countdown ───────────────────────────────────── */
export default function FlipCountdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState(() => calcTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  const tick = useCallback(() => {
    setTime(calcTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    setMounted(true);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  /* Initial entrance staggered animation */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  } as const;

  const item = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 14 },
    },
  } as const;

  if (!mounted) return null; // avoid hydration mismatch

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3"
    >
      <motion.div variants={item}>
        <FlipUnit value={time.days} label="Days" />
      </motion.div>

      <motion.div variants={item}>
        <Colon />
      </motion.div>

      <motion.div variants={item}>
        <FlipUnit value={time.hours} label="Hours" />
      </motion.div>

      <motion.div variants={item}>
        <Colon />
      </motion.div>

      <motion.div variants={item}>
        <FlipUnit value={time.minutes} label="Mins" />
      </motion.div>

      <motion.div variants={item}>
        <Colon />
      </motion.div>

      <motion.div variants={item}>
        <FlipUnit value={time.seconds} label="Secs" />
      </motion.div>
    </motion.div>
  );
}
