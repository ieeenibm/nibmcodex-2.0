'use client';
import { motion } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';
import Magnetic from './ui/Magnetic';

export default function Sponsors() {
  const sponsors = [
    { name: 'TechVision', tier: 'Platinum' },
    { name: 'CloudDynamics', tier: 'Gold' },
    { name: 'QuantumAI', tier: 'Gold' },
    { name: 'DataForce', tier: 'Silver' },
    { name: 'SecureNet', tier: 'Silver' },
    { name: 'DevTools Pro', tier: 'Bronze' },
  ];

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Platinum': return 'text-cyan-400 border-cyan-400/30';
      case 'Gold': return 'text-yellow-400 border-yellow-400/30';
      case 'Silver': return 'text-slate-300 border-slate-300/30';
      case 'Bronze': return 'text-orange-400 border-orange-400/30';
      default: return 'text-white border-white/20';
    }
  };

  return (
    <section id="sponsors" className="py-32 bg-navy-950 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full">
            Partners
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">Our Sponsors</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {sponsors.map((sponsor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <SpotlightCard className="glass-panel-light p-8 clip-slanted h-full flex flex-col group">
                <div className={`self-start px-3 py-1 text-xs font-mono uppercase tracking-widest mb-8 border ${getTierColor(sponsor.tier)} bg-white/5`}>
                  {sponsor.tier}
                </div>
                <div className="flex items-center gap-6 mt-auto">
                  <div className="w-12 h-12 bg-navy-950 border border-white/10 flex items-center justify-center group-hover:border-cyan-400 transition-colors duration-500 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-cyan-400 transition-colors duration-500 shadow-[0_0_10px_rgba(34,211,238,0)] group-hover:shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-200 group-hover:text-white transition-colors tracking-tight">{sponsor.name}</h3>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-panel p-12 max-w-2xl mx-auto clip-slanted">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter">Want to sponsor us?</h3>
            <p className="text-slate-400 mb-10 font-light text-lg">Join us in shaping the future of technology by supporting the brightest minds.</p>
            <Magnetic>
              <button className="px-10 py-5 glass-panel-light hover:bg-cyan-500 hover:text-navy-950 hover:border-transparent text-white font-bold uppercase tracking-widest transition-all duration-300 clip-slanted active:scale-95">
                Become a Partner
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}