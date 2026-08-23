'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './SmoothScroll';

export default function VerticalScrollMoment() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScrollProgress(containerRef, {
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section ref={containerRef} className="relative z-10 h-[70vh] w-full overflow-hidden flex items-center justify-center bg-navy-950 border-t border-white/5">
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/misc/holodeck"
          alt="Holodeck Core"
          fill
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-navy-950/40 mix-blend-overlay"></div>
      </motion.div>
      
      <motion.div style={{ opacity }} className="relative z-10 text-center px-6">
        <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl">
          Enter The <span className="text-gradient-cyan">Core</span>
        </h2>
        <p className="mt-6 text-slate-300 font-mono tracking-widest uppercase text-sm font-bold flex items-center justify-center gap-3">
          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
          System Initialization Sequence
        </p>
      </motion.div>
    </section>
  );
}