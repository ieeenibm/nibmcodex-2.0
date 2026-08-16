'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'ieee_pill_dismissed';

export default function RegistrationPill() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  // Initialize and attach scroll listener
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (typeof window === 'undefined') return;

    const dismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    setIsDismissed(dismissed);

    if (dismissed) return;

    const handleScroll = () => {
      // Trigger when scrolling past 800px (roughly past hero section)
      if (window.scrollY > 800) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle auto-expansion after it becomes visible
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 1200); // Wait 1.2s before expanding
      return () => clearTimeout(timer);
    }
  }, [isVisible, isExpanded]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!mounted || isDismissed) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-center">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            layout
            initial={{ y: -100, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -100, scale: 0.8, opacity: 0 }}
            transition={{ 
              layout: { type: "spring", stiffness: 350, damping: 30 },
              y: { type: "spring", stiffness: 400, damping: 25 },
              opacity: { duration: 0.2 }
            }}
            className="pointer-events-auto flex items-center bg-navy-900/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] rounded-full overflow-hidden p-1.5"
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
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="flex items-center overflow-hidden whitespace-nowrap"
                >
                  <div className="flex items-center gap-3 pl-3 pr-1">
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
                    
                    {/* Divider */}
                    <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
                    
                    {/* Close Button */}
                    <button
                      onClick={handleDismiss}
                      className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-white/5"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
