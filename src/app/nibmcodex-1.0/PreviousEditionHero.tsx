'use client';
import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';
import { useLenisScroll } from '@/components/SmoothScroll';

export default function PreviousEditionHero() {
  const { scrollY } = useLenisScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y, scale: 1.05 }} className="absolute inset-0 z-0">
        <Image
          src="/images/theme.webp"
          alt="NIBMCodeX 1.0"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/50 to-navy-950"></div>
      </motion.div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-28 left-6 md:left-12 z-20"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          Back to NIBMCodeX 2.0
        </Link>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center mt-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-block px-5 py-2 mb-8 glass-panel-light text-cyan-300 text-xs font-mono uppercase tracking-[0.3em] clip-slanted shadow-[0_0_20px_rgba(34,211,238,0.1)]"
        >
          Previous Edition • IEEEXtreme 19.0 • October 2025
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter mb-4 text-white leading-none font-['Times_New_Roman',_Georgia,_serif]"
        >
          NIBM<span className="text-gradient-cyan">CodeX</span> 1.0
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-6 font-light tracking-wide"
        >
          A 24-hour coding challenge hosted by NIBM IEEE Student Branch as part of{' '}
          <span className="text-cyan-400 font-semibold">IEEEXtreme 19.0</span>.
          Where innovation sparked, teams competed, and history was made.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-sm text-slate-500 max-w-xl mx-auto mb-10 font-mono tracking-wide"
        >
          Solve tough algorithm problems and compete with coders worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Magnetic>
            <a href="#gallery" className="group relative inline-flex items-center justify-center px-10 py-5 bg-cyan-500 text-navy-950 font-bold uppercase tracking-widest clip-slanted overflow-hidden transition-transform active:scale-95">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative z-10">Explore Highlights</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
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
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-cyan-400" size={24} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
