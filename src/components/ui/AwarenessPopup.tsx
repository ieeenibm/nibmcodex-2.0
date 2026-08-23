'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

const SESSIONS = [
  { label: 'KIC', timeLabel: '10:30 AM', timestamp: Date.UTC(2026, 7, 24, 5, 0) },
  { label: 'Kandy', timeLabel: '12:00 PM', timestamp: Date.UTC(2026, 7, 24, 6, 30) },
  { label: 'Kurunegala', timeLabel: '03:00 PM', timestamp: Date.UTC(2026, 7, 24, 9, 30) },
];

export default function AwarenessPopup() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isPassed: boolean } | null>(null);
  
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle visit logic and hydration
  useEffect(() => {
    const visits = parseInt(localStorage.getItem('awareness_popup_visits') || '0', 10) + 1;
    localStorage.setItem('awareness_popup_visits', visits.toString());

    if (visits % 5 === 1) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
    
    // Quick slide in on load
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Timer logic
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const target = SESSIONS[currentSessionIndex].timestamp;
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentSessionIndex]);

  // Session switching logic
  useEffect(() => {
    if (!isExpanded) return;
    
    const switchInterval = setInterval(() => {
      setCurrentSessionIndex((prev) => (prev + 1) % SESSIONS.length);
    }, 5000);
    
    return () => clearInterval(switchInterval);
  }, [isExpanded]);

  if (!isVisible) return null;

  const currentSession = SESSIONS[currentSessionIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            layoutId="awareness-popup"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-14 h-14 rounded-full bg-navy-900 border border-cyan-500/30 text-white shadow-[0_5px_20px_rgba(34,211,238,0.2)] flex items-center justify-center group relative backdrop-blur-xl"
            aria-label="Expand timers"
          >
            {/* Subtle pulse effect */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping opacity-40" style={{ animationDuration: '1.5s' }} />
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden" />
            <Clock size={24} className="text-cyan-400 relative z-10" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            layoutId="awareness-popup"
            ref={popupRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-navy-900 border border-cyan-500/30 shadow-[0_10px_40px_-10px_rgba(34,211,238,0.2)] rounded-2xl p-5 w-[300px] sm:w-[340px] relative overflow-hidden backdrop-blur-xl"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-cyan-500/0" />

              <div className="mb-4 pr-2">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  Awareness Sessions
                </h3>
                <p className="text-slate-400 text-xs">
                  Join us tomorrow, August 24th. Catch the session at your nearest campus!
                </p>
              </div>

              <div className="bg-navy-950/50 rounded-xl p-4 border border-white/5 relative h-[100px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSessionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-x-4 top-4 bottom-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                        <MapPin size={16} />
                        <span>{currentSession.label}</span>
                      </div>
                      <div className="text-slate-400 text-xs font-mono bg-white/5 px-2 py-1 rounded">
                        {currentSession.timeLabel}
                      </div>
                    </div>

                    {timeLeft && (
                      <div className="flex gap-2 justify-between items-center h-full">
                        {timeLeft.isPassed ? (
                          <div className="w-full text-center py-2 text-amber-400 font-medium text-sm tracking-widest uppercase">
                            Session Started / Ended
                          </div>
                        ) : (
                          <>

                            <div className="flex flex-col items-center justify-center flex-1">
                              <span className="text-xl font-bold font-mono text-white">
                                {timeLeft.hours.toString().padStart(2, '0')}
                              </span>
                              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Hrs</span>
                            </div>
                            <div className="text-xl font-bold font-mono text-white/20">:</div>
                            <div className="flex flex-col items-center justify-center flex-1">
                              <span className="text-xl font-bold font-mono text-white">
                                {timeLeft.minutes.toString().padStart(2, '0')}
                              </span>
                              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Min</span>
                            </div>
                            <div className="text-xl font-bold font-mono text-white/20">:</div>
                            <div className="flex flex-col items-center justify-center flex-1">
                              <span className="text-xl font-bold font-mono text-cyan-400">
                                {timeLeft.seconds.toString().padStart(2, '0')}
                              </span>
                              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Sec</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex justify-center gap-1.5 mt-4">
                {SESSIONS.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSessionIndex ? 'w-4 bg-cyan-400' : 'w-1.5 bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
