'use client';
import { motion, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Magnetic from './ui/Magnetic';
import FlipCountdown from './ui/FlipCountdown';
import { useLenisScroll } from './SmoothScroll';

/* ── countdown target: Oct 31, 2026 00:00 ──────────────── */
const TARGET = new Date(Date.UTC(2026, 9, 31, 0, 0, 0));

export default function Hero() {
  const { scrollY } = useLenisScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div style={{ y, scale: 1.05 }} className="absolute inset-0 z-0">
        <Image
          src="/images/wide-cityscape.webp"
          alt="Tron Cityscape"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/40 to-navy-950"></div>
      </motion.div>

      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 sm:px-6 text-center flex flex-col items-center mt-16 sm:mt-20"
      >
        {/* Date Badge */}
        <motion.div variants={itemVariants} className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 glass-panel-light text-cyan-300 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] clip-slanted shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          31<sup className="lowercase">st</sup> of October - 01<sup className="lowercase">st</sup> of November • NIBM
        </motion.div>

        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter mb-2 sm:mb-3 text-white leading-none font-['Times_New_Roman',_Georgia,_serif]">
          NIBM<span className="text-gradient-cyan">CodeX</span> 2.0
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 font-light tracking-wide">
          The countdown begins — are you ready to compete?
        </motion.p>

        {/* Flip Countdown */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <FlipCountdown targetDate={TARGET} />
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
          <Magnetic>
            <a href="#about" className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-cyan-500 text-navy-950 font-bold uppercase tracking-wider sm:tracking-widest clip-slanted overflow-hidden transition-transform active:scale-95 text-sm sm:text-base">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="/nibmcodex-1.0" className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 border border-cyan-400/30 text-cyan-300 font-bold uppercase tracking-wider sm:tracking-widest clip-slanted overflow-hidden transition-all hover:border-cyan-400/60 hover:bg-cyan-400/5 active:scale-95 text-sm sm:text-base">
              <span className="relative z-10">View 1.0 Gallery</span>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <span className="text-[10px] sm:text-xs font-mono text-slate-500 mb-2 sm:mb-3 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-cyan-400" size={20} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}