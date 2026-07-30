'use client';
import { motion, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Magnetic from './ui/Magnetic';
import { useLenisScroll } from './SmoothScroll';

export default function Hero() {
  const { scrollY, scrollTo } = useLenisScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center mt-20"
      >
        <motion.div variants={itemVariants} className="inline-block px-5 py-2 mb-8 glass-panel-light text-cyan-300 text-xs font-mono uppercase tracking-[0.3em] clip-slanted shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          31<sup className="lowercase">st</sup> of October - 01<sup className="lowercase">st</sup> of November • NIBM
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter mb-6 text-white leading-none font-['Times_New_Roman',_Georgia,_serif]">
          NIBM<span className="text-gradient-cyan">CodeX</span> 2.0
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-light tracking-wide">
          The ultimate 24-hour hackathon experience. Build, innovate, and conquer the digital frontier.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center">
          <LearnMoreButton scrollTo={scrollTo} />
          <Magnetic>
            <a href="/nibmcodex-1.0" className="group relative inline-flex items-center justify-center px-10 py-5 border border-cyan-400/30 text-cyan-300 font-bold uppercase tracking-widest clip-slanted overflow-hidden transition-all hover:border-cyan-400/60 hover:bg-cyan-400/5 active:scale-95">
              <span className="relative z-10">View 1.0 Gallery</span>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <span className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-cyan-400" size={24} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

type ScrollToFn = (
  target: string | HTMLElement | number,
  options?: { offset?: number; duration?: number; immediate?: boolean; lock?: boolean }
) => void;

/** Separate small component so it can also access the Lenis context */
function LearnMoreButton({ scrollTo }: { scrollTo: ScrollToFn }) {
  return (
    <Magnetic>
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollTo('#about', { offset: -80, duration: 1.2 });
        }}
        className="group relative inline-flex items-center justify-center px-10 py-5 bg-cyan-500 text-navy-950 font-bold uppercase tracking-widest clip-slanted overflow-hidden transition-transform active:scale-95"
      >
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
        <span className="relative z-10">Learn More</span>
        <div className="absolute inset-0 h-full w-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
      </a>
    </Magnetic>
  );
}
