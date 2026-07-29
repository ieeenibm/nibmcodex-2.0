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
    { 
      title: 'Branch Awareness Sessions 1', 
      date: <>3<sup className="lowercase">rd</sup> of August</>, 
      desc: (
        <div className="inline-block text-left">
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1">
            <span className="font-medium text-slate-300">Matara</span><span>:</span><span>10:30 - 11:30</span>
            <span className="font-medium text-slate-300">Galle</span><span>:</span><span>14:30 - 15:30</span>
          </div>
        </div>
      ) 
    },
    { 
      title: 'Branch Awareness Sessions 2', 
      date: <>7<sup className="lowercase">th</sup> of August</>, 
      desc: (
        <div className="inline-block text-left">
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1">
            <span className="font-medium text-slate-300">KIC</span><span>:</span><span>10:30 - 11:30</span>
            <span className="font-medium text-slate-300">Kandy</span><span>:</span><span>12:00 - 13:00</span>
            <span className="font-medium text-slate-300">Kurunegala</span><span>:</span><span>14:30 - 15:30</span>
          </div>
        </div>
      ) 
    },
    { 
      title: 'AI for Learning Workshop', 
      date: <>19<sup className="lowercase">th</sup> of August | 10:00 - 13:00</>, 
      desc: (
        <div className="inline-block text-left space-y-2">
          <div className="text-[14px] text-slate-300 font-medium italic -mt-1">
            Enterprise, AI and Robotics Learning Outcomes
          </div>
          <div>
            <div className="text-[13px] text-slate-400">
              By <a href="https://www.linkedin.com/in/mark-elshaw-5a645814/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">Dr. Mark Elshaw</a>
            </div>
            <div className="text-[13px] text-slate-400">Senior Lecturer in AI, Coventry University, UK</div>
          </div>
        </div>
      ) 
    },
    { 
      title: 'Code Grid Summit', 
      date: <>12<sup className="lowercase">th</sup> of September | 08:30 - 16:00</>, 
      desc: (
        <div className="inline-block text-left space-y-2">
          <div className="text-[14px] text-slate-300 font-medium italic -mt-1">
            Where academic ends, Industry begins
          </div>
        </div>
      ) 
    },
    { title: 'IEEEXtreme 20.0', date: <>31<sup className="lowercase">st</sup> October - 01<sup className="lowercase">st</sup> November</>, desc: '24 hours coding challenge' },
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
                  <SpotlightCard className="glass-panel-light p-8 clip-slanted group hover:border-cyan-400/30 transition-all duration-500 shadow-xl overflow-hidden relative">
                    {/* Ripple effect overlay */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      whileInView={{ scale: 3, opacity: 0 }}
                      viewport={{ margin: "-100px" }}
                      transition={{ duration: 1, ease: "easeOut" }}
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
                         {step.date}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors tracking-tight">{step.title}</h3>
                      <div className="text-slate-400 font-light leading-relaxed text-sm md:text-base">{step.desc}</div>
                    </div>
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