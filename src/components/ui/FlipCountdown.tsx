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
    <div className="relative w-[44px] h-[62px] xs:w-[52px] xs:h-[72px] sm:w-[64px] sm:h-[88px] md:w-[72px] md:h-[100px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${idx}-${digit}`}
          initial={{ rotateX: -90, opacity: 0, scaleY: 0.6 }}
          animate={{ rotateX: 0, opacity: 1, scaleY: 1 }}
          exit={{ rotateX: 90, opacity: 0, scaleY: 0.6 }}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0 [perspective:800px] [transform-style:preserve-3d]"
        >
          {/* Card body — solid dark, sharp corners, physical depth */}
          <div className="w-full h-full bg-[#0d1b2a] border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.03)_inset] overflow-hidden relative">

            {/* Top half */}
            <div className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center bg-[#0f1d2e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Courier_New',monospace] leading-none tracking-tight -mb-px">
                {digit}
              </span>
            </div>

            {/* Divider — clean dark line with subtle light bleed */}
            <div className="absolute top-1/2 left-0 right-0 z-10 h-px bg-black/80" />
            <div className="absolute top-1/2 left-[10%] right-[10%] z-10 h-px bg-white/[0.04]" />

            {/* Centre screw-holes */}
            <div className="absolute top-1/2 left-1.5 w-[5px] h-[5px] rounded-full bg-black/60 border border-white/[0.03] -translate-y-1/2" />
            <div className="absolute top-1/2 right-1.5 w-[5px] h-[5px] rounded-full bg-black/60 border border-white/[0.03] -translate-y-1/2" />

            {/* Bottom half */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center bg-[#0b1727] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]">
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Courier_New',monospace] leading-none tracking-tight -mt-px">
                {digit}
              </span>
            </div>

            {/* Bottom weight shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-black/50" />
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
      <div className="flex gap-[2px] sm:gap-[3px]">
        {chars.map((ch, i) => (
          <FlipDigit key={`${label}-pos${i}`} digit={ch} idx={i} />
        ))}
      </div>

      {/* Label */}
      <span className="text-[9px] xs:text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-slate-500/80">
        {label}
      </span>
    </div>
  );
}

/* ── separator colon ─────────────────────────────────── */
function Colon() {
  return (
    <div className="flex flex-col items-center justify-center gap-[5px] sm:gap-2 pb-7 sm:pb-8 md:pb-10">
      <motion.span
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-slate-400"
      />
      <motion.span
        animate={{ opacity: [0.15, 1, 0.15] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-slate-400"
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

  /* Initial entrance animation */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.3 },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 16 },
    },
  } as const;

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex items-center justify-center"
    >
      <div className="flex items-center justify-center gap-0 sm:gap-1">
        <motion.div variants={itemVariants}>
          <FlipUnit value={time.days} label="Days" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Colon />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FlipUnit value={time.hours} label="Hours" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Colon />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FlipUnit value={time.minutes} label="Mins" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Colon />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FlipUnit value={time.seconds} label="Secs" />
        </motion.div>
      </div>
    </motion.div>
  );
}
