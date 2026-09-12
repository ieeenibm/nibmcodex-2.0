'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from './ui/CountdownTimer';
import { useSectionInView } from '@/hooks/useSectionInView';

const EVENTS = [
  {
    label: 'AI for Learning Workshop',
    shortLabel: 'AI Workshop',
    startDate: new Date(Date.UTC(2026, 7, 19, 4, 30, 0)), // Aug 19, 10:00 AM SLST
    endDate: new Date(Date.UTC(2026, 7, 19, 7, 30, 0)),   // Aug 19, 01:00 PM SLST
    date: new Date(Date.UTC(2026, 7, 19, 4, 30, 0)),
    displayDate: 'Aug 19, 2026, 10:00 AM',
    subtext: 'A focused three-hour AI/ML session with a Coventry University lecturer.',
    accentClass: 'text-violet-400',
    dotClass: 'bg-violet-400',
    glowClass: 'bg-violet-400/5',
  },
  {
    label: 'Code Grid Summit 2026',
    shortLabel: 'Code Grid Summit',
    startDate: new Date(Date.UTC(2026, 8, 12, 2, 30, 0)), // Sep 12, 08:00 AM SLST
    endDate: new Date(Date.UTC(2026, 8, 12, 11, 30, 0)),  // Sep 12, 05:00 PM SLST (17:00 SLST)
    date: new Date(Date.UTC(2026, 8, 12, 2, 30, 0)),
    displayDate: 'Sep 12, 2026, 08:00 AM',
    subtext: 'A full-day flagship technology summit confronting the academia-industry gap.',
    accentClass: 'text-cyan-400',
    dotClass: 'bg-cyan-400',
    glowClass: 'bg-cyan-400/5',
  },
  {
    label: '24hr IEEEXtreme 20.0',
    shortLabel: 'IEEEXtreme 20.0',
    startDate: new Date(Date.UTC(2026, 9, 31, 0, 0, 0)), // Oct 31, 2026
    endDate: new Date(Date.UTC(2026, 10, 1, 18, 30, 0)), // Nov 01, 2026, 23:59:59 SLST
    date: new Date(Date.UTC(2026, 9, 31, 0, 0, 0)),
    displayDate: 'Oct 31, 2026',
    subtext: 'The 24-hour physical hackathon finale for NIBM teams in IEEEXtreme 20.0.',
    accentClass: 'text-cyan-400',
    dotClass: 'bg-cyan-400',
    glowClass: 'bg-cyan-400/5',
  },
];

function getAutoEventIndex(now: number = Date.now()): number {
  // If an event is currently ongoing (between start and end time), show it
  const ongoingIdx = EVENTS.findIndex((e) => now >= e.startDate.getTime() && now < e.endDate.getTime());
  if (ongoingIdx !== -1) return ongoingIdx;

  // Otherwise, find the next upcoming event that has not ended yet
  const nextIdx = EVENTS.findIndex((e) => now < e.endDate.getTime());
  if (nextIdx !== -1) return nextIdx;

  return EVENTS.length - 1;
}

export default function CountdownSection() {
  const [sectionRef, isInView] = useSectionInView<HTMLElement>();
  const [userSelectedIdx, setUserSelectedIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [nowMs, setNowMs] = useState<number>(0);

  useEffect(() => {
    const currentNow = Date.now();
    setMounted(true);
    setNowMs(currentNow);
    setActiveIdx(getAutoEventIndex(currentNow));
  }, []);

  useEffect(() => {
    if (!isInView && mounted) return;
    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNowMs(currentNow);

      // Auto-switch to next event once current event ends (e.g. after 5 PM today)
      if (userSelectedIdx === null) {
        const nextIdx = getAutoEventIndex(currentNow);
        setActiveIdx((prev) => (prev !== nextIdx ? nextIdx : prev));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isInView, mounted, userSelectedIdx]);

  const active = EVENTS[activeIdx];
  const isOngoing = mounted && nowMs > 0 && nowMs >= active.startDate.getTime() && nowMs < active.endDate.getTime();
  const isPast = mounted && nowMs > 0 && nowMs >= active.endDate.getTime();
  const allPast = useMemo(() => {
    if (!mounted || !nowMs) return false;
    return EVENTS.every((e) => e.endDate.getTime() <= nowMs);
  }, [mounted, nowMs]);

  const badgeText = isOngoing
    ? 'Happening Now'
    : isPast
    ? 'Event Concluded'
    : allPast
    ? 'Series Complete'
    : 'Next Up';

  return (
    <section
      id="about"
      ref={sectionRef}
      data-animate-in-view={isInView}
      className="relative py-28 md:py-36 w-full max-w-full flex items-center min-h-[70vh] overflow-hidden overflow-x-clip bg-navy-950 border-t border-white/5"
    >
      {/* Ambient glow - colour follows the active event */}
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
          className={`inline-flex items-center gap-2 px-4 py-1.5 mb-6 border text-[10px] font-mono uppercase tracking-[0.25em] rounded-full glass-panel-light transition-colors ${
            isOngoing
              ? 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
              : 'border-white/10 text-cyan-400'
          }`}
        >
          {isOngoing && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
          )}
          {badgeText}
        </motion.div>

        {/* Event title - animates when active event changes */}
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

        {/* Countdown timer / Ongoing Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {mounted && (
            <CountdownTimer
              targetDate={active.startDate}
              endDate={active.endDate}
              colorClass={active.accentClass}
              isOngoing={isOngoing}
            />
          )}
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
            const isEventOngoing = nowMs > 0 && nowMs >= event.startDate.getTime() && nowMs < event.endDate.getTime();
            const isEventPast = nowMs > 0 && nowMs >= event.endDate.getTime();
            const isActive = idx === activeIdx;
            const isLast = idx === EVENTS.length - 1;

            return (
              <div key={event.shortLabel} className="flex items-center">
                <button
                  onClick={() => {
                    setUserSelectedIdx(idx);
                    setActiveIdx(idx);
                  }}
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
                      isActive ? event.dotClass : isEventOngoing ? 'bg-cyan-400 animate-pulse' : isEventPast ? 'bg-white/20' : 'bg-white/10'
                    }`} />
                  </span>

                  {/* Label */}
                  <span className={`text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? event.accentClass : isEventOngoing ? 'text-cyan-300' : isEventPast ? 'text-white/30' : 'text-slate-500 group-hover:text-slate-400'
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
