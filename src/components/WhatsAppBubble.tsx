'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb5p4Uw6buMQ9aWCIp1i';

export default function WhatsAppBubble() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (isDismissed) return null;

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Small delay ensures smooth transition if user cursor grazes the edge
    closeTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Expanded Popup */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50 w-72 select-none"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-md shadow-[#25D366]/20">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">NIBMCodeX 2.0</h4>
                  <p className="text-slate-400 text-xs">WhatsApp Channel</p>
                </div>
              </div>
              {/* Close popup only */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-slate-400 hover:text-white hover:bg-white/10 transition-colors p-1.5 rounded-lg"
                aria-label="Close popup"
                title="Close popup"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Follow our WhatsApp Channel for real-time updates on IEEEXtreme 20.0, workshops, and event announcements.
            </p>
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#25D366]/20 active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Follow Channel
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Container */}
      <div className="relative group/bubble">
        {/* Dismiss bubble button (persists for session, reload brings it back) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-navy-900 border border-white/20 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition-all shadow-md opacity-80 hover:opacity-100 z-10 cursor-pointer"
          title="Dismiss button"
          aria-label="Dismiss WhatsApp button"
        >
          <X size={11} strokeWidth={2.5} />
        </button>

        {/* Floating Bubble Button */}
        <motion.button
          onClick={() => setIsExpanded((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-colors relative cursor-pointer"
          aria-label="Toggle WhatsApp Channel Popup"
        >
          <WhatsAppIcon className="w-7 h-7 text-white" />
          {/* Ping indicator */}
          {!isExpanded && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-navy-950 animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
