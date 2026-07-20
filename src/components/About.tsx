'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SpotlightCard from './ui/SpotlightCard';

export default function About() {
  const stats = [
    { label: 'Dates', value: 'Oct 22-23' },
    { label: 'Venue', value: 'NIBM' },
    { label: 'Prize Pool', value: 'Rs 100K+' },
    { label: 'Participants', value: '200+' }
  ];

  return (
    <section id="about" className="relative py-32 w-full flex items-center min-h-[80vh] overflow-hidden bg-navy-950 border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/symmetrical-corridor.webp"
          alt="Symmetrical Corridor"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
              Welcome to the <span className="text-gradient-cyan">Next Frontier</span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-400 mb-16 leading-relaxed font-light tracking-wide">
              NIBMCodeX 2.0 is more than just a hackathon. It's a 48-hour sprint of pure innovation, 
              collaboration, and technological breakthrough. Join the brightest minds as we build 
              solutions that push the boundaries of what's possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <SpotlightCard className="h-full glass-panel-light p-8 clip-slanted flex flex-col items-center justify-center">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-cyan-400/80">{stat.label}</div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}