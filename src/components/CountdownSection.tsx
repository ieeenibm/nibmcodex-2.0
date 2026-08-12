'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from './ui/CountdownTimer';

const EVENTS = [
  {
    label: 'AI for Learning Workshop',
    shortLabel: 'AI Workshop',
    date: new Date(Date.UTC(2026, 7, 19, 0, 0, 0)), // Aug 19
    displayDate: 'Aug 19, 2026',
    subtext: 'A focused three-hour AI/ML session with a Coventry University lecturer.',
    accentClass: 'text-violet-400',
    dotClass: 'bg-violet-400',
    glowClass: 'bg-violet-400/5',
  },
  {
    label: 'Code Grid Summit 2026',
    shortLabel: 'Code Grid Summit',
    date: new Date(Date.UTC(2026, 8, 12, 0, 0, 0)), // Sep 12
    displayDate: 'Sep 12, 2026',
    subtext: 'A full-day flagship technology summit confronting the academia-industry gap.',
    accentClass: 'text-cyan-400',
    dotClass: 'bg-cyan-400',
    glowClass: 'bg-cyan-400/5',
  },
  {
    label: '24hr IEEEXtreme 20.0',
    shortLabel: 'IEEEXtreme 20.0',
    date: new Date(Date.UTC(2026, 9, 31, 0, 0, 0)), // Oct 31
    displayDate: 'Oct 31, 2026',
    subtext: 'The 24-hour physical hackathon finale for NIBM teams in IEEEXtreme 20.0.',
    accentClass: 'text-emerald-400',
    dotClass: 'bg-emerald-400',
    glowClass: 'bg-emerald-400/5',
  },
];

function getNextEventIndex(): number {
  const now = Date.now();
  const idx = EVENTS.findIndex((e) => e.date.getTime() > now);
  return idx === -1 ? EVENTS.length - 1 : idx;
}

export default function CountdownSection() {
  const [activeIdx, setActiveIdx] = useState<number>(() => getNextEventIndex());
  const [mounted, setMounted] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return Date.now();
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const active = EVENTS[activeIdx];
  const allPast = useMemo(() => EVENTS.every((e) => e.date.getTime() <= nowMs), [nowMs]);

  return (
    <section
      id="about"
      className="relative py-28 md:py-36 w-full flex items-center min-h-[70vh] overflow-hidden bg-navy-950 border-t border-white/5"
    >
      {/* Ambient glow — colour follows the active event */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-1/2 ${active.glowClass} blur-[120px] rounded-full pointer-events-none z-0`}
        />
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 mb-6 border border-white/10 text-cyan-400 text-[10px] font-mono uppercase tracking-[0.25em] rounded-full glass-panel-light"
        >
          {allPast ? 'Series Complete' : 'Next Up'}
        </motion.div>

        {/* Event title — animates when active event changes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tighter leading-tight ${active.accentClass}`}>
              {active.label}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mb-10 sm:mb-14 font-light tracking-wide">
              {active.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {mounted && <CountdownTimer targetDate={active.date} colorClass={active.accentClass} />}
        </motion.div>

        {/* Divider */}
        <div className="mt-14 mb-8 max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Event trail */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0"
        >
          {EVENTS.map((event, idx) => {
            const isPast = event.date.getTime() <= nowMs;
            const isActive = idx === activeIdx;
            const isLast = idx === EVENTS.length - 1;

            return (
              <div key={event.shortLabel} className="flex items-center">
                <button
                  onClick={() => setActiveIdx(idx)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 group ${
                    isActive
                      ? 'glass-panel-light border border-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Status dot */}
                  <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
                    {isActive && (
                      <span className={`absolute inline-flex h-full w-full rounded-full ${event.dotClass} opacity-60 animate-ping`} />
                    )}
                    <span className={`relative inline-flex rounded-full w-2 h-2 ${
                      isActive ? event.dotClass : isPast ? 'bg-white/20' : 'bg-white/10'
                    }`} />
                  </span>

                  {/* Label */}
                  <span className={`text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? event.accentClass : isPast ? 'text-white/30' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {event.shortLabel}
                  </span>

                  {/* Date */}
                  <span className={`text-[10px] font-mono tracking-wide ${
                    isActive ? 'text-white/50' : 'text-white/20'
                  }`}>
                    {event.displayDate}
                  </span>
                </button>

                {/* Connector line between items */}
                {!isLast && (
                  <div className="hidden sm:block w-8 h-px bg-white/10 mx-1" />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
