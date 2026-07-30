'use client';
import { motion } from 'framer-motion';
import SpotlightCard from '@/components/ui/SpotlightCard';

const stats = [
  { value: '24', label: 'Hours of Coding' },
  { value: '150+', label: 'Participants' },
  { value: '40+', label: 'Teams Competed' },
  { value: '10+', label: 'Industry Partners' },
  { value: 'Rs 75K+', label: 'Prize Pool' },
  { value: '1', label: 'Champion Crowned' },
];

export default function EditionStats() {
  return (
    <section className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.03),transparent_60%)] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            By the Numbers
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Edition <span className="text-gradient-cyan">Highlights</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            The inaugural edition set the bar high. Here is what NIBMCodeX 1.0 accomplished.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <SpotlightCard className="h-full glass-panel-light p-8 clip-slanted flex flex-col items-center justify-center text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-400/80">
                  {stat.label}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
