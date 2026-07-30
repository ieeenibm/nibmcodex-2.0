'use client';
import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useScrollProgress } from '@/components/SmoothScroll';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { Clock, Users, Code, Trophy, Sparkles, Zap } from 'lucide-react';

const moments = [
  {
    icon: Users,
    title: 'Registration Opens',
    date: 'October 2025',
    desc: '150+ participants registered within the first week, signaling the hunger for innovation.',
  },
  {
    icon: Code,
    title: 'Hackathon Kickoff',
    date: '25th October 2025',
    desc: 'Teams assembled, ideas were pitched, and the 24-hour countdown began with unmatched energy.',
  },
  {
    icon: Zap,
    title: 'Midnight Innovation',
    date: '25th — 26th October 2025',
    desc: 'The campus lit up through the night as teams coded relentlessly, fueled by pizza and passion.',
  },
  {
    icon: Sparkles,
    title: 'Final Submissions',
    date: '26th October 2025',
    desc: '40+ working prototypes were submitted, ranging from AI solutions to blockchain applications.',
  },
  {
    icon: Trophy,
    title: 'Award Ceremony',
    date: '26th October 2025',
    desc: 'Top teams were awarded with prizes worth Rs 75K+, trophies, and exclusive goodies.',
  },
  {
    icon: Clock,
    title: 'Legacy Continues',
    date: 'Beyond 2025',
    desc: 'NIBMCodeX 1.0 set the foundation for what would become an annual tradition of excellence.',
  },
];

export default function KeyMoments() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScrollProgress(containerRef, {
    offset: ['start center', 'end center'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Key <span className="text-gradient-cyan">Moments</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            A timeline of the defining moments that made NIBMCodeX 1.0 unforgettable.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* Faded Background Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 z-0"></div>

          {/* Animated Active Line */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-cyan-400 -translate-x-1/2 z-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          ></motion.div>

          <div className="space-y-16">
            {moments.map((moment, idx) => {
              const Icon = moment.icon;
              return (
                <div
                  key={idx}
                  className={`relative flex items-center md:justify-between flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Marker */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                    className="absolute left-[15px] md:left-1/2 w-6 h-6 rounded-full bg-navy-950 border-2 border-cyan-400 -translate-x-1/2 z-10 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                    className={`w-full md:w-[45%] pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                  >
                    <SpotlightCard className="glass-panel-light p-8 clip-slanted group hover:border-cyan-400/30 transition-all duration-500 shadow-xl overflow-hidden relative">
                      {/* Ripple effect overlay */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0.5 }}
                        whileInView={{ scale: 3, opacity: 0 }}
                        viewport={{ margin: '-100px' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
                        style={{
                          background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)',
                          originX: 0.5,
                          originY: 0.5,
                        }}
                      />
                      <div className="relative z-10">
                        <div className="text-cyan-400 font-mono text-xs tracking-widest mb-3 flex items-center gap-2 md:inline-flex">
                          <span className="w-2 h-2 rounded-sm bg-cyan-400/50 inline-block group-hover:bg-cyan-400 transition-colors"></span>
                          {moment.date}
                        </div>
                        <div className={`flex items-center gap-4 mb-3 ${idx % 2 === 0 ? 'md:flex-row-reverse md:justify-end' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-navy-950 border border-cyan-400/20 flex items-center justify-center group-hover:border-cyan-400/60 transition-colors flex-shrink-0">
                            <Icon size={18} className="text-cyan-400" strokeWidth={1.5} />
                          </div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                            {moment.title}
                          </h3>
                        </div>
                        <p className="text-slate-400 font-light leading-relaxed text-sm md:text-base">
                          {moment.desc}
                        </p>
                      </div>
                    </SpotlightCard>
                  </motion.div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-[45%]"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
