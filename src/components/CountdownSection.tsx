'use client';
import { motion } from 'framer-motion';
import CountdownTimer from './ui/CountdownTimer';

/* ── countdown target: Oct 31, 2026 00:00 ──────────────── */
const TARGET = new Date(Date.UTC(2026, 9, 31, 0, 0, 0));

export default function CountdownSection() {
  return (
    <section id="about" className="relative py-28 md:py-36 w-full flex items-center min-h-[70vh] overflow-hidden bg-navy-950 border-t border-white/5">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-1/2 bg-cyan-400/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 mb-6 border border-white/10 text-cyan-400 text-[10px] font-mono uppercase tracking-[0.25em] rounded-full glass-panel-light">
            Countdown to Launch
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tighter leading-tight">
            Hackathon Starts In
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mb-10 sm:mb-14 font-light tracking-wide">
            The 24-hour coding marathon begins in — are you ready to push your limits?
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CountdownTimer targetDate={TARGET} />
        </motion.div>

        {/* Event date context */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-xs font-mono uppercase tracking-[0.2em] text-slate-500"
        >
          October 31 &mdash; November 1, 2026 &bull; NIBM
        </motion.p>
      </div>
    </section>
  );
}
