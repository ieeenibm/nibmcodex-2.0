'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    "INITIALIZING CODEX CORE...",
    "ESTABLISHING SECURE CONNECTION...",
    "LOADING NEURAL NETWORKS...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('nibmcodex_has_seen_preloader');
    if (hasSeen) {
      return;
    }
    setLoading(true);

    const interval = setInterval(() => {
      setTextIndex(prev => {
        if (prev === texts.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('nibmcodex_has_seen_preloader', 'true');
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[1000] bg-navy-950 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-8 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${((textIndex + 1) / texts.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <motion.p 
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          >
            {texts[textIndex]}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}