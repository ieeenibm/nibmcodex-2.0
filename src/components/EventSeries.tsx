'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import CardSwap, { Card } from './ui/CardSwap';

const events = [
  {
    number: '01',
    title: 'AI for Learning Workshop',
    accentColor: 'from-cyan-500/20 to-sky-500/10',
    borderColor: 'border-cyan-400/20',
    glowColor: 'rgba(34, 211, 238, 0.15)',
    description:
      'A focused 3-hour AI/ML session bridging the gap between academic theory and real-world application. Gain clarity on how AI is reshaping the modern tech industry.',
    highlights: [
      { icon: Calendar, text: '19 August 2026' },
      { icon: Clock, text: '3-Hour Session' },
    ],
  },
  {
    number: '02',
    title: 'Code Grid Summit 2026',
    accentColor: 'from-violet-500/20 to-purple-500/10',
    borderColor: 'border-violet-400/20',
    glowColor: 'rgba(167, 139, 250, 0.15)',
    description:
      'Our flagship full-day technology summit. Join working practitioners for honest conversations about emerging technologies, career readiness, and the future of work.',
    highlights: [
      { icon: Calendar, text: '12 September 2026' },
      { icon: Clock, text: 'Full Day' },
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
  return (
    <section id="events" className="relative py-28 bg-navy-950 border-t border-white/5 overflow-hidden">

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            A Multi-Stage Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            The NIBMCodeX <span className="text-gradient-cyan">Series</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-2xl mx-auto">
            Three distinct events. One connected journey - from workshop to summit to a 24-hour competitive finale aligned with IEEEXtreme 20.0.
          </p>
        </motion.div>

        {/* Card Swap Stack */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[550px] w-full relative flex items-center justify-center"
        >
          <CardSwap 
            pauseOnHover={true}
            delay={1500}
            width={340}
            height={480}
            cardDistance={90}
            verticalDistance={45}
            skewAmount={4}
            easing="linear"
          >
            {events.map((event) => (
              <Card 
                key={event.number}
                customClass={`h-full clip-slanted border ${event.borderColor} bg-navy-950 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl`}
                style={{ boxShadow: `0 0 40px ${event.glowColor}` }}
              >
                {/* Top accent gradient */}
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${event.accentColor.replace('/20', '/60').replace('/10', '/0')}`} />

                {/* Glow blob */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${event.accentColor} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Number row */}
                  <div className="flex items-center mb-6">
                    <span className="text-6xl font-bold text-white/10 group-hover:text-white/30 transition-all duration-500 font-mono leading-none select-none">
                      {event.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-4 leading-snug group-hover:text-cyan-100 transition-colors duration-300">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light flex-grow">
                    {event.description}
                  </p>

                  {/* Divider */}
                  <div className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6`} />

                  {/* Highlights & CTA */}
                  <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex flex-col gap-3">
                      {event.highlights.map((h, i) => {
                        const HIcon = h.icon;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <HIcon size={14} className="text-slate-500 shrink-0" strokeWidth={1.5} />
                            <span className="text-xs text-slate-400 font-mono">{h.text}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                      <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </motion.div>

      </div>
    </section>
  );
}
