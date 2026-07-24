'use client';
import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useScrollProgress } from './SmoothScroll';
import SpotlightCard from './ui/SpotlightCard';

export default function Timeline() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScrollProgress(containerRef, {
    offset: ["start center", "end center"]
  });

  // Apply a spring physics layer to make the vertical progress line feel buttery smooth
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    { title: 'Branch Awareness Sessions 1', date: '3rd Aug', desc: 'Galle, Matara' },
    { title: 'Branch Awareness Sessions 2', date: '7th Aug', desc: 'KIC, Kandy, Kurunegala' },
    { title: 'AI for Learning Workshop', date: '19th Aug', desc: 'Time not decided' },
    { title: 'AI Summit', date: '12th Sep', desc: 'Full day event' },
    { title: 'IEEEXtreme 20.0', date: '22-23 Oct', desc: '24 Hours Coding Challenge' },
  ];

  return (
    <section id="timeline" ref={containerRef} className="py-32 bg-navy-950 relative border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light shadow-xl">
            Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter drop-shadow-2xl">Event Timeline</h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">The roadmap leading up to the ultimate challenge.</p>
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
            {steps.map((step, idx) => (
              <div key={idx} className={`relative flex items-center md:justify-between flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Marker */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="absolute left-[15px] md:left-1/2 w-6 h-6 rounded-full bg-navy-950 border-2 border-cyan-400 -translate-x-1/2 z-10 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                </motion.div>

                {/* Content Card */}
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className={`w-full md:w-[45%] pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                >
                  <SpotlightCard className="glass-panel-light p-8 clip-slanted group hover:border-cyan-400/30 transition-all duration-500 shadow-xl">
                    <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2 md:inline-flex">
                       <span className="w-2 h-2 rounded-sm bg-cyan-400/50 inline-block group-hover:bg-cyan-400 transition-colors"></span>
                       {step.date}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors tracking-tight">{step.title}</h3>
                    <p className="text-slate-400 font-light leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </SpotlightCard>
                </motion.div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-[45%]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}