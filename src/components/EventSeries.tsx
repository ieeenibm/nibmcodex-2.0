'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Zap, BookOpen, Mic } from 'lucide-react';

const events = [
  {
    number: '01',
    badge: 'AI for Learning',
    title: 'AI for Learning Workshop',
    date: '19th of August 2026',
    duration: '3 Hours',
    format: 'Academic Session',
    icon: BookOpen,
    accentColor: 'from-violet-500/20 to-purple-500/10',
    borderColor: 'border-violet-400/20',
    badgeColor: 'text-violet-300 border-violet-400/30',
    glowColor: 'rgba(167, 139, 250, 0.15)',
    description:
      'A focused three-hour AI/ML session bridging the gap between academic theory and real-world application. Featuring academic exposure from a Coventry University lecturer, this workshop arms students with clarity on how AI is reshaping what junior technology work actually looks like.',
    highlights: [
      { icon: Calendar, text: '19 August 2026' },
      { icon: Clock, text: '3-Hour Session' },
      { icon: Users, text: 'NIBM Students' },
    ],
    tag: 'Kick-off Event',
  },
  {
    number: '02',
    badge: 'Code Grid Summit',
    title: 'Code Grid Summit 2026',
    date: '12th of September 2026',
    duration: 'Full Day',
    format: 'Technology Summit',
    icon: Mic,
    accentColor: 'from-cyan-500/20 to-sky-500/10',
    borderColor: 'border-cyan-400/20',
    badgeColor: 'text-cyan-300 border-cyan-400/30',
    glowColor: 'rgba(34, 211, 238, 0.15)',
    description:
      'A full-day flagship technology summit confronting the gap between what campus teaches and what industry actually expects. Emerging technologies, working industry practitioners and honest conversations about AI, career readiness, and the future of tech work — all in one room.',
    highlights: [
      { icon: Calendar, text: '12 September 2026' },
      { icon: Clock, text: 'Full Day' },
      { icon: Mic, text: 'Industry Speakers' },
    ],
    tag: 'Flagship Summit',
  },
  {
    number: '03',
    badge: 'IEEEXtreme 20.0',
    title: '24hr IEEEXtreme 20.0',
    date: '31st of October 2026',
    duration: '24 Hours',
    format: 'Hackathon',
    icon: Zap,
    accentColor: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-400/20',
    badgeColor: 'text-emerald-300 border-emerald-400/30',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    description:
      'The culmination of the NIBMCodeX journey — a 24-hour physical event for registered NIBM teams competing in the official IEEEXtreme 20.0 competition. Real teamwork, debugging under pressure, and endurance. Built by doing, not through lectures alone.',
    highlights: [
      { icon: Calendar, text: '31 October 2026' },
      { icon: Clock, text: '24 Hours' },
      { icon: MapPin, text: 'NIBM Campus' },
    ],
    tag: 'The Finale',
  },
];

export default function EventSeries() {
  return (
    <section id="events" className="relative py-28 bg-navy-950 border-t border-white/5 overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-transparent to-navy-950 z-0" />

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
            Three distinct events. One connected journey — from workshop to summit to a 24-hour competitive finale aligned with IEEEXtreme 20.0.
          </p>
        </motion.div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.12, type: 'spring', stiffness: 80, damping: 20 }}
                className={`relative rounded-2xl border ${event.borderColor} glass-panel-light overflow-hidden flex flex-col group`}
                style={{ boxShadow: `0 0 40px ${event.glowColor}` }}
              >
                {/* Top accent gradient */}
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${event.accentColor.replace('/20', '/60').replace('/10', '/0')}`} />

                {/* Glow blob */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${event.accentColor} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10 p-7 flex flex-col h-full">
                  {/* Number + Tag row */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-5xl font-bold text-white/5 font-mono leading-none select-none">
                      {event.number}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border rounded-full ${event.badgeColor} glass-panel-light`}>
                      {event.tag}
                    </span>
                  </div>

                  {/* Icon + Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${event.accentColor} border ${event.borderColor}`}>
                      <Icon size={20} className={event.badgeColor.split(' ')[0]} strokeWidth={1.5} />
                    </div>
                    <span className={`text-xs font-mono uppercase tracking-wider ${event.badgeColor.split(' ')[0]}`}>
                      {event.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white tracking-tight mb-3 leading-snug group-hover:text-cyan-100 transition-colors duration-300">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light flex-grow">
                    {event.description}
                  </p>

                  {/* Divider */}
                  <div className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5`} />

                  {/* Highlights */}
                  <div className="flex flex-col gap-2">
                    {event.highlights.map((h, i) => {
                      const HIcon = h.icon;
                      return (
                        <div key={i} className="flex items-center gap-2.5">
                          <HIcon size={13} className="text-slate-500 shrink-0" strokeWidth={1.5} />
                          <span className="text-xs text-slate-400 font-mono">{h.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom connecting line / journey indicator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 max-w-4xl mx-auto flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/30 to-cyan-400/30" />
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 whitespace-nowrap">
            Aligned with IEEEXtreme 20.0
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-emerald-400/30 to-cyan-400/30" />
        </motion.div>
      </div>
    </section>
  );
}
