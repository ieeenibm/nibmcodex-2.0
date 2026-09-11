'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useSectionInView } from '@/hooks/useSectionInView';

const events = [
  {
    number: '01',
    title: 'AI for Learning Workshop',
    completed: true,
    accentColor: 'from-violet-500/20 to-purple-500/10',
    borderColor: 'border-violet-400/20',
    glowColor: 'rgba(167, 139, 250, 0.15)',
    description:
      'A focused 3-hour AI/ML session bridging the gap between academic theory and real-world application. Gain clarity on how AI is reshaping the modern tech industry.',
    highlights: [
      { icon: Calendar, text: '19 August 2026' },
      { icon: Clock, text: '3-Hour Session' },
      { icon: MapPin, text: 'Trace Expert City' },
    ],
  },
  {
    number: '02',
    title: 'Code Grid Summit 2026',
    nextUp: true,
    accentColor: 'from-cyan-500/20 to-sky-500/10',
    borderColor: 'border-cyan-400/20',
    glowColor: 'rgba(34, 211, 238, 0.15)',
    description:
      'Our flagship full-day technology summit. Join working practitioners for honest conversations about emerging technologies, career readiness, and the future of work.',
    highlights: [
      { icon: Calendar, text: '12 September 2026' },
      { icon: Clock, text: 'Full Day' },
      { icon: MapPin, text: 'NIBM Campus' },
    ],
  },
  {
    number: '03',
    title: '24hr IEEEXtreme 20.0',
    accentColor: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-400/20',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    description:
      'The 24-hour physical coding finale. Compete in the official IEEEXtreme 20.0 and experience real teamwork, debugging under pressure, and endurance.',
    highlights: [
      { icon: Calendar, text: '31 October 2026' },
      { icon: Clock, text: '24 Hours' },
      { icon: MapPin, text: 'NIBM Campus' },
    ],
  },
];

export default function EventSeries() {
  const [sectionRef, isInView] = useSectionInView<HTMLElement>();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section 
      id="events" 
      ref={sectionRef}
      data-animate-in-view={isInView}
      className="relative py-20 sm:py-28 bg-navy-950 border-t border-white/5 overflow-hidden overflow-x-clip max-w-full"
    >

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            A Multi-Stage Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter">
            The NIBMCodeX <span className="text-gradient-cyan">Series</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-2xl mx-auto text-sm sm:text-base">
            Three distinct events. One connected journey - from workshop to summit to a 24-hour competitive finale aligned with IEEEXtreme 20.0.
          </p>
        </motion.div>

        {/* Event Cards */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {events.map((event, idx) => {
            const isHovered = hoveredIdx === idx;
            const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;

                const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                };

                return (
                  <motion.div
                    key={event.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: idx * 0.12, type: 'spring', stiffness: 80, damping: 20 }}
                    className="relative z-10 flex flex-col group h-full"
                    style={{ zIndex: isHovered ? 20 : 10 }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseMove={handleMouseMove}
                  >
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.02 : isOtherHovered ? 0.98 : 1,
                        opacity: isOtherHovered ? 0.5 : 1,
                        filter: isOtherHovered ? 'blur(4px)' : 'blur(0px)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={`relative h-full clip-slanted border ${event.borderColor} bg-white/[0.02] backdrop-blur-2xl overflow-hidden flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}
                      style={{ 
                        boxShadow: isHovered 
                          ? `0 20px 40px -10px ${event.glowColor}, inset 0 1px 1px rgba(255,255,255,0.15)` 
                          : `0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)`
                      }}
                    >
                      {/* Dynamic Mouse Spotlight */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08), transparent 40%)`
                        }}
                      />

                      {/* Top accent gradient line */}
                      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${event.accentColor.replace('/20', '/80').replace('/10', '/0')}`} />

                      {/* Soft underlying glow blob */}
                      <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${event.accentColor} blur-[80px] opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none`} />

                      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
                        {/* Number row */}
                        <div className="flex items-center justify-between mb-5 sm:mb-6">
                          <span className="text-5xl sm:text-6xl font-bold text-white/5 group-hover:text-white/20 transition-all duration-500 font-mono leading-none select-none">
                            {event.number}
                          </span>
                          {event.completed && (
                            <div className="px-2.5 sm:px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase backdrop-blur-sm">
                              Completed
                            </div>
                          )}
                          {event.nextUp && (
                            <div className="px-2.5 sm:px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-[9px] sm:text-[10px] font-bold tracking-widest text-cyan-300 uppercase backdrop-blur-sm flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                              </span>
                              Next Up
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 sm:mb-4 leading-snug group-hover:text-cyan-100 transition-colors duration-300">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8 font-light flex-grow">
                          {event.description}
                        </p>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                        {/* Highlights & CTA */}
                        <div className="flex items-end justify-between gap-4 mt-auto">
                          <div className="flex flex-col gap-3">
                            {event.highlights.map((h, i) => {
                              const HIcon = h.icon;
                              return (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <HIcon size={12} className="text-slate-300" strokeWidth={2} />
                                  </div>
                                  <span className="text-sm text-slate-300 font-medium tracking-wide">{h.text}</span>
                                </div>
                              );
                            })}
                          </div>
                          

                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
          })}
        </div>


      </div>
    </section>
  );
}
