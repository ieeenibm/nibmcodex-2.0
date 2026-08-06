'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from './SmoothScroll';
import SpotlightCard from './ui/SpotlightCard';
import MemoriesGallery from './ui/MemoriesGallery';
import Image from 'next/image';

export default function Timeline() {
  const containerRef = useRef<HTMLElement>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [hoveredPreview, setHoveredPreview] = useState<{ src: string, idx: number } | null>(null);
  const [openGalleryIdx, setOpenGalleryIdx] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setNow(new Date()), 0); // delay slightly to avoid synchronous setState in effect
    const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  
  const { scrollYProgress } = useScrollProgress(containerRef, {
    offset: ["start center", "end center"]
  });

  // Apply a spring physics layer to make the vertical progress line feel buttery smooth
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const rawSteps = [
    { 
      title: 'Branch Awareness Sessions 1', 
      date: <>3<sup className="lowercase">rd</sup> of August</>, 
      startISO: '2026-08-03T10:30:00+05:30',
      endISO: '2026-08-03T15:30:00+05:30',
      memories: Array.from({ length: 8 }, (_, i) => `/images/memories/awareness-sessions-1/${i + 1}.webp`),
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
      date: <>TBA (Postponed)</>, 
      status: 'postponed',
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
      startISO: '2026-08-19T10:00:00+05:30',
      endISO: '2026-08-19T13:00:00+05:30',
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
      startISO: '2026-09-12T08:30:00+05:30',
      endISO: '2026-09-12T16:00:00+05:30',
      desc: (
        <div className="inline-block text-left space-y-2">
          <div className="text-[14px] text-slate-300 font-medium italic -mt-1">
            Where academic ends, Industry begins
          </div>
        </div>
      ) 
    },
    { 
      title: 'IEEEXtreme 20.0', 
      date: <>31<sup className="lowercase">st</sup> October - 01<sup className="lowercase">st</sup> November</>, 
      startISO: '2026-10-31T00:00:00+05:30',
      endISO: '2026-11-01T23:59:59+05:30',
      desc: '24 hours coding challenge' 
    },
  ];

  // Process states
  const steps = rawSteps.map(step => {
    type StepWithStatus = typeof step & { status?: string };
    let status = (step as StepWithStatus).status || 'upcoming';
    if (now && !(step as StepWithStatus).status) {
      const start = new Date(step.startISO as string).getTime();
      const end = new Date(step.endISO as string).getTime();
      const current = now.getTime();
      
      if (current > end) status = 'completed';
      else if (current >= start && current <= end) status = 'active';
    }
    return { ...step, status };
  });

  // Highlight the immediate next event if nothing is currently active
  const hasActive = steps.some(s => s.status === 'active');
  const firstUpcomingIdx = steps.findIndex(s => s.status === 'upcoming');
  if (!hasActive && firstUpcomingIdx !== -1) {
    steps[firstUpcomingIdx].status = 'next';
  }

  return (
    <section id="timeline" ref={containerRef} onClick={() => setOpenGalleryIdx(null)} className="py-32 bg-navy-950 relative border-t border-white/5">
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
            initial={{ x: "-50%" }}
            animate={{ x: "-50%" }}
            className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-cyan-400 z-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          ></motion.div>
          
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active' || step.status === 'next';

              return (
                <div key={idx} className={`relative flex items-center md:justify-between flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Marker */}
                  <motion.div 
                    initial={{ scale: 0, x: "-50%", y: "-50%" }}
                    whileInView={{ scale: 1, x: "-50%", y: "-50%" }}
                    viewport={{ margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className={`absolute left-[27px] top-1/2 md:left-1/2 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center transition-colors duration-700
                      ${isCompleted ? 'bg-navy-950 border-slate-700' : (step.status === 'postponed' ? 'bg-navy-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-navy-950 border-cyan-400')}
                      ${isActive ? 'shadow-[0_0_15px_rgba(34,211,238,0.8)] border-cyan-300' : (step.status !== 'postponed' ? 'shadow-[0_0_10px_rgba(34,211,238,0.4)]' : '')}
                    `}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-700
                      ${isCompleted ? 'bg-slate-700' : (step.status === 'postponed' ? 'bg-amber-400' : 'bg-cyan-400')}
                      ${isActive ? 'animate-pulse bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,1)]' : ''}
                    `}></div>
                    
                    {/* Ripple for active item */}
                    {isActive && (
                       <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400/40"></span>
                    )}
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className={`w-full md:w-[45%] pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                  >
                    <SpotlightCard 
                      onClick={(e) => e.stopPropagation()}
                      className={`glass-panel-light p-8 clip-slanted overflow-hidden relative transition-all duration-700 shadow-xl
                      ${isCompleted ? (step.memories && step.memories.length > 0 ? 'opacity-80 hover:opacity-100' : 'opacity-50 grayscale hover:opacity-60') : (step.status === 'postponed' ? 'group hover:border-amber-400/30' : 'group hover:border-cyan-400/30')}
                      ${isActive ? 'border-cyan-400/40 ring-1 ring-cyan-400/10' : ''}
                    `}>
                      {/* Ripple effect overlay */}
                      {!isCompleted && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0.5, x: "-50%", y: "-50%" }}
                          whileInView={{ scale: 3, opacity: 0, x: "-50%", y: "-50%" }}
                          viewport={{ margin: "-100px" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full pointer-events-none z-0"
                          style={{
                            background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)',
                            originX: 0.5,
                            originY: 0.5,
                          }}
                        />
                      )}
                      
                      <div className="relative z-10">
                        <div className={`font-mono text-xs tracking-widest mb-3 flex items-center gap-2 md:inline-flex flex-wrap
                          ${isCompleted ? 'text-slate-500' : (step.status === 'postponed' ? 'text-amber-400' : 'text-cyan-400')}
                        `}>
                           {!isCompleted && (
                             <span className={`w-2 h-2 rounded-sm inline-block transition-colors ${step.status === 'postponed' ? 'bg-amber-400/50 group-hover:bg-amber-400' : 'bg-cyan-400/50 group-hover:bg-cyan-400'}`}></span>
                           )}
                           {step.date}
                           
                           {/* Status Badge */}
                           {step.status === 'completed' && (
                             <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-[10px] ml-2 text-slate-400">COMPLETED</span>
                           )}
                           {step.status === 'postponed' && (
                             <span className="px-2 py-0.5 rounded border border-amber-500/50 bg-amber-500/20 text-[10px] ml-2 text-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]">POSTPONED</span>
                           )}
                           {step.status === 'active' && (
                             <span className="px-2 py-0.5 rounded border border-cyan-400/50 bg-cyan-500/20 text-[10px] ml-2 text-cyan-300 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.3)]">ONGOING</span>
                           )}
                           {step.status === 'next' && (
                             <span className="px-2 py-0.5 rounded border border-cyan-400/50 bg-cyan-500/10 text-[10px] ml-2 text-cyan-300 shadow-[0_0_5px_rgba(34,211,238,0.2)]">NEXT UP</span>
                           )}
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 transition-colors tracking-tight
                          ${isCompleted ? 'text-slate-300' : (step.status === 'postponed' ? 'text-white group-hover:text-amber-300' : 'text-white group-hover:text-cyan-300')}
                        `}>{step.title}</h3>
                        <div className={`font-light leading-relaxed text-sm md:text-base
                          ${isCompleted ? 'text-slate-500' : 'text-slate-400'}
                        `}>{step.desc}</div>

                        {/* Memories Gallery for completed events */}
                        {isCompleted && step.memories && step.memories.length > 0 && (
                          <MemoriesGallery 
                            images={step.memories} 
                            eventTitle={step.title} 
                            onHoverImage={(src) => setHoveredPreview(src ? { src, idx } : null)}
                            isOpen={openGalleryIdx === idx}
                            onToggle={() => setOpenGalleryIdx(prev => prev === idx ? null : idx)}
                          />
                        )}
                      </div>
                    </SpotlightCard>
                  </motion.div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-[45%]">
                    <AnimatePresence>
                      {hoveredPreview && hoveredPreview.idx === idx && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, x: idx % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95, x: idx % 2 === 0 ? -20 : 20 }}
                          transition={{ duration: 0.3 }}
                          className={`absolute top-0 bottom-0 w-[45%] hidden md:flex items-center justify-center z-50 ${idx % 2 === 0 ? 'left-0' : 'right-0'}`}
                        >
                          <div className="relative w-full h-full rounded-2xl overflow-hidden glass-panel-light shadow-[0_0_30px_rgba(34,211,238,0.15)] p-2">
                            <div className="relative w-full h-full rounded-xl overflow-hidden bg-navy-950/50">
                               <Image src={hoveredPreview.src} fill className="object-cover" alt="Memory preview" />
                               <div className="absolute inset-0 border border-cyan-400/20 rounded-xl" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}