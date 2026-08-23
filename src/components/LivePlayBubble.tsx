'use client';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LivePlayBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-6 left-6 z-[100]"
    >
      <Link href="/play">
        <div className="relative group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/40 group-hover:blur-2xl transition-all duration-300 pointer-events-none" />
          <button className="relative flex items-center justify-center w-14 h-14 bg-navy-900 border-2 border-cyan-500/30 rounded-full shadow-2xl overflow-hidden group-hover:border-cyan-400 transition-all duration-300">
            <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] pointer-events-none" />
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-navy-900/90 border border-cyan-500/30 rounded-lg opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl">
            <p className="text-xs font-bold text-cyan-400 font-mono tracking-tight">Pulse Mini • Join Session</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
