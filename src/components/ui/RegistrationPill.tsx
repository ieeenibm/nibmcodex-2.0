'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';

export default function RegistrationPill() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [autoExpanded, setAutoExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize and trigger entrance
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Slight delay so the drop-in animation plays smoothly on page load
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
    }, 7000);

    return () => clearTimeout(entranceTimer);
  }, []);

  // Handle auto-expansion and auto-collapse after it becomes visible
  useEffect(() => {
    if (isVisible) {
      let collapseTimer: NodeJS.Timeout;
      
      // 1. Wait 1.2s before expanding
      const expandTimer = setTimeout(() => {
        setAutoExpanded(true);
        
        // 2. Stay expanded for 4s, then collapse back to icon
        collapseTimer = setTimeout(() => {
          setAutoExpanded(false);
        }, 4000);
      }, 1200); 
      
      return () => {
        clearTimeout(expandTimer);
        clearTimeout(collapseTimer);
      };
    }
  }, [isVisible]);

  if (!mounted) return null;

  const showExpanded = autoExpanded || isHovered;

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex justify-center">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            layout
            initial={{ y: -60, scale: 0.5, opacity: 0 }}
            animate={{ 
              y: 0, 
              scale: 1, 
              opacity: 1,
              boxShadow: [
                "0 0 15px rgba(34,211,238,0.1)", 
                "0 0 30px rgba(34,211,238,0.25)", 
                "0 0 15px rgba(34,211,238,0.1)"
              ]
            }}
            exit={{ y: -60, scale: 0.8, opacity: 0 }}
            transition={{ 
              layout: { type: "spring", stiffness: 350, damping: 30 },
              y: { type: "spring", stiffness: 400, damping: 25 },
              opacity: { duration: 0.2 },
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="pointer-events-auto flex items-center bg-navy-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-full overflow-hidden p-1.5 cursor-pointer shadow-xl"
          >
            {/* The Icon (Always visible) */}
            <motion.div 
              layout="position"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[inset_0_1px_4px_rgba(34,211,238,0.3)]"
            >
              <Users className="w-5 h-5" />
            </motion.div>

            {/* The Expanded Content */}
            <AnimatePresence mode="popLayout">
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="flex items-center overflow-hidden whitespace-nowrap"
                >
                  <div className="flex items-center gap-3 pl-3 pr-2">
                    <span className="text-sm font-medium text-slate-200">
                      Become an IEEE Member
                    </span>
                    <a
                      href="https://www.ieee.org/membership/join/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-cyan-500/30 transition-colors"
                    >
                      Register
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
