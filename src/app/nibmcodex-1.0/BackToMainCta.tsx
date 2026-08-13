'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

export default function BackToMainCta() {
  return (
    <section className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06),transparent_50%)] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel max-w-3xl mx-auto p-12 md:p-20 clip-slanted text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-950 border border-cyan-400/30 mb-8 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          >
            <Sparkles className="text-cyan-400" size={28} strokeWidth={1.5} />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tighter">
            Ready for the <span className="text-gradient-cyan">Next Level</span>?
          </h2>
          <p className="text-slate-400 text-lg font-light mb-12 max-w-lg mx-auto leading-relaxed">
            NIBMCodeX 2.0 is here - bigger, bolder, and ready to push the boundaries even further. 
            Dont just watch history. Make it.
          </p>

          <Magnetic>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-cyan-500 text-navy-950 font-bold uppercase tracking-widest clip-slanted overflow-hidden transition-transform active:scale-95 relative"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative z-10">Join NIBMCodeX 2.0</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              <div className="absolute inset-0 h-full w-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
