'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gamepad2, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { PULSE_MINI_UNLOCK_DATE } from '@/components/PulseCountdownOverlay';

export default function LivePlayBubble() {
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIsUnlocked(Date.now() >= PULSE_MINI_UNLOCK_DATE.getTime());
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <Link href="/play" className="block focus:outline-none">
        <div className="relative group flex items-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-cyan-500/25 rounded-full blur-xl group-hover:bg-cyan-400/40 group-hover:blur-2xl transition-all duration-300 pointer-events-none" />

          {/* Bubble Button */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex items-center justify-center w-14 h-14 bg-navy-900/90 backdrop-blur-md border-2 border-cyan-500/40 rounded-full shadow-2xl overflow-hidden group-hover:border-cyan-400 transition-all duration-300 cursor-pointer"
            aria-label="Pulse Mini Live Arena"
          >
            <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />

            {/* Inner Ring Glow */}
            <span className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(34,211,238,0.25)] pointer-events-none" />

            {/* Radar / Ping indicator */}
            <span className="absolute top-1 right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-navy-950 animate-pulse" />
          </motion.div>

          {/* Interactive Tooltip */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3.5 py-2 bg-navy-900/95 border border-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-md shadow-2xl shadow-black/50 flex items-center gap-2.5">
            {isUnlocked ? (
              <>
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <p className="text-xs font-bold text-white font-mono tracking-tight">
                  Pulse Mini <span className="text-cyan-400">• Live Arena</span>
                </p>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <div className="flex flex-col">
                  <p className="text-xs font-bold text-white font-mono tracking-tight">
                    Pulse Mini Arena
                  </p>
                  <p className="text-[10px] text-cyan-400/90 font-mono">
                    Unlocks Sept 11 • Midnight
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
