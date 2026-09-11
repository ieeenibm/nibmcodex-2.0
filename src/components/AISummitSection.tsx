'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  ArrowUpRight, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Pause, 
  Play 
} from 'lucide-react';
import { SPEAKERS, Speaker } from '@/data/summitData';

const AUTO_ROTATE_INTERVAL_MS = 6000;

export default function AISummitSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeSpeaker = SPEAKERS[activeIndex];
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const nextSpeaker = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SPEAKERS.length);
    setProgress(0);
  }, []);

  const prevSpeaker = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SPEAKERS.length) % SPEAKERS.length);
    setProgress(0);
  }, []);

  const selectSpeaker = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  // Keep active speaker scrolled into view in the right rail
  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl && railRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex]);

  // Ensure mouse wheel scrolling works reliably without being hijacked by Lenis smooth scroll
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      rail.scrollTop += e.deltaY;
    };

    rail.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      rail.removeEventListener('wheel', handleWheel);
    };
  }, []);
  useEffect(() => {
    if (isPaused || selectedSpeaker !== null) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / AUTO_ROTATE_INTERVAL_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSpeaker();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, selectedSpeaker, nextSpeaker]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpeaker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSpeaker]);

  return (
    <section 
      id="summit" 
      className="relative py-24 bg-navy-950 border-t border-cyan-500/20 overflow-hidden"
    >
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[300px] bg-violet-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Header - Matching Exact Pill Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Distinguished Lineup
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Meet the <span className="text-gradient-cyan">Summit Speakers</span>
          </h2>
          <p className="text-slate-400 mt-3 font-light tracking-wide max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Learn directly from senior technology executives, government leaders, and enterprise architects shaping AI delivery, cybersecurity, and future engineering ecosystems.
          </p>
        </motion.div>

        {/* TWO-COLUMN INTERACTIVE SHOWCASE */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto items-start"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT COLUMN: ENLARGED SPOTLIGHT CARD (~7 cols on desktop) */}
          <div className="lg:col-span-7 h-full">
            <div className="relative border border-cyan-400/20 hover:border-cyan-400/35 bg-navy-900/60 backdrop-blur-2xl clip-slanted p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col justify-between h-full min-h-[530px] transition-colors duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpeaker.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
                >
                  {/* Speaker Photo - Clean 3:4 Portrait */}
                  <div className="relative shrink-0 w-full sm:w-52 md:w-56">
                    <div className="relative w-full aspect-[3/4] border border-white/10 clip-slanted bg-navy-950 shadow-xl overflow-hidden">
                      <div className="absolute inset-1 overflow-hidden clip-slanted bg-navy-900">
                        <Image
                          src={activeSpeaker.image}
                          alt={activeSpeaker.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 240px"
                          className={`object-cover ${
                            activeSpeaker.id === 'sampath-gamage'
                              ? 'object-[center_20%]'
                              : activeSpeaker.id === 'yasoma-jayasinghe'
                              ? 'object-[center_15%]'
                              : activeSpeaker.id === 'thisari-panawala'
                              ? 'object-[center_25%]'
                              : 'object-center'
                          } filter brightness-[1.02] contrast-[1.03] transition-transform duration-700 hover:scale-105`}
                          priority
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Tag badge under photo - Pill Design */}
                    <div className="mt-3 text-center">
                      <span className={`inline-block font-mono font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                        activeSpeaker.isChiefGuest 
                          ? 'bg-cyan-400 text-navy-950 border-cyan-300' 
                          : 'bg-white/[0.04] border-white/15 text-cyan-300'
                      }`}>
                        {activeSpeaker.isChiefGuest ? 'Chief Guest' : 'Keynote Speaker'}
                      </span>
                    </div>
                  </div>

                  {/* Speaker Info & Extended Bio */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Sub-track Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/10 bg-white/[0.03] text-cyan-300 text-[10px] font-mono uppercase tracking-wider mb-2.5 rounded-full">
                        <Award className="w-3 h-3 text-cyan-400" />
                        {activeSpeaker.tag}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                        {activeSpeaker.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 mb-4">
                        <span className="text-cyan-400 font-semibold text-xs sm:text-sm font-mono">
                          {activeSpeaker.title}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300 font-light text-xs sm:text-sm flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-cyan-400/80" />
                          {activeSpeaker.company}
                        </span>
                      </div>

                      {/* Credentials list if any */}
                      {activeSpeaker.credentials && activeSpeaker.credentials.length > 0 && (
                        <div className="space-y-1.5 mb-4">
                          {activeSpeaker.credentials.slice(0, 3).map((cred, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{cred}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bio summary excerpt */}
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-5 line-clamp-3">
                        {activeSpeaker.shortBio}
                      </p>
                    </div>

                    {/* View full bio button */}
                    <button
                      onClick={() => setSelectedSpeaker(activeSpeaker)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-bold text-xs font-mono uppercase tracking-wider clip-slanted transition-all duration-200 active:scale-95 shadow-md shadow-cyan-400/10 cursor-pointer w-fit"
                    >
                      Read Full Biography
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Spotlight Bottom Controls & Progress Bar */}
              <div className="mt-8 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  {/* Progress bar across current rotation cycle */}
                  <div className="h-1 w-full bg-white/10 overflow-hidden relative rounded-full">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPaused((prev) => !prev)}
                        className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                        title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                      >
                        {isPaused ? (
                          <>
                            <Play className="w-3 h-3 text-cyan-400" />
                            <span className="text-[11px]">Paused</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 text-cyan-400" />
                            <span className="text-[11px]">Auto-cycling</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-bold">
                        {activeIndex + 1} <span className="text-slate-500 font-normal">/ {SPEAKERS.length}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={prevSpeaker}
                          className="p-1.5 border border-white/10 hover:border-cyan-400/50 bg-white/5 text-slate-300 hover:text-cyan-300 rounded-lg transition-colors active:scale-95 cursor-pointer"
                          aria-label="Previous speaker"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={nextSpeaker}
                          className="p-1.5 border border-white/10 hover:border-cyan-400/50 bg-white/5 text-slate-300 hover:text-cyan-300 rounded-lg transition-colors active:scale-95 cursor-pointer"
                          aria-label="Next speaker"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ALL SPEAKERS SELECTOR RAIL (~5 cols on desktop) */}
          <div 
            ref={railRef}
            data-lenis-prevent="true"
            className="lg:col-span-5 flex flex-col gap-2 max-h-[530px] overflow-y-auto overscroll-contain pr-1.5 custom-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            {SPEAKERS.map((speaker, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={speaker.id}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  onClick={() => selectSpeaker(idx)}
                  className={`text-left w-full p-2.5 sm:p-3 border transition-all duration-300 clip-slanted flex items-center gap-3 group relative cursor-pointer ${
                    isActive
                      ? 'border-cyan-400/80 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                      : 'border-white/10 hover:border-cyan-400/40 bg-navy-900/40 hover:bg-navy-900/80'
                  }`}
                >
                  {/* Left edge active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                  )}

                  {/* Thumbnail - 3:4 Aspect with Proper Crop */}
                  <div className={`relative w-12 h-15 shrink-0 border clip-slanted overflow-hidden bg-navy-950 transition-colors ${
                    isActive ? 'border-cyan-400 ring-1 ring-cyan-400/30' : 'border-white/15 group-hover:border-cyan-400/40'
                  }`}>
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      sizes="52px"
                      className={`object-cover ${
                        speaker.id === 'sampath-gamage'
                          ? 'object-[center_20%]'
                          : speaker.id === 'yasoma-jayasinghe'
                          ? 'object-[center_15%]'
                          : speaker.id === 'thisari-panawala'
                          ? 'object-[center_25%]'
                          : 'object-center'
                      } filter brightness-[1.02]`}
                      unoptimized
                    />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-sm font-bold truncate leading-tight ${
                        isActive ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'
                      }`}>
                        {speaker.name}
                      </span>
                      {speaker.isChiefGuest && (
                        <span className="text-[9px] font-mono uppercase tracking-wider bg-cyan-400 text-navy-950 font-bold px-1.5 py-0.5 rounded-full">
                          Chief Guest
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                      {speaker.title}
                    </p>
                    <p className="text-[10px] font-mono text-cyan-400/80 truncate">
                      {speaker.company}
                    </p>
                  </div>

                  {/* Right Arrow indicator */}
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive 
                      ? 'text-cyan-400 translate-x-0.5' 
                      : 'text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SPEAKER FULL BIO MODAL */}
      <AnimatePresence>
        {selectedSpeaker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpeaker(null)}
              className="absolute inset-0 bg-navy-950/85 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-navy-900 border border-cyan-400/30 clip-slanted p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors z-20 cursor-pointer"
                aria-label="Close bio"
              >
                <X className="w-5 h-5" />
              </button>

              <div data-lenis-prevent="true" className="overflow-y-auto pr-2 custom-scrollbar">
                {/* Header in Modal */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pb-6 border-b border-white/10">
                  <div className="relative w-24 h-32 shrink-0 border border-white/15 clip-slanted overflow-hidden bg-navy-950">
                    <Image
                      src={selectedSpeaker.image}
                      alt={selectedSpeaker.name}
                      fill
                      sizes="96px"
                      className={`object-cover ${
                        selectedSpeaker.id === 'sampath-gamage'
                          ? 'object-[center_20%]'
                          : selectedSpeaker.id === 'yasoma-jayasinghe'
                          ? 'object-[center_15%]'
                          : selectedSpeaker.id === 'thisari-panawala'
                          ? 'object-[center_25%]'
                          : 'object-center'
                      }`}
                      unoptimized
                    />
                  </div>

                  <div className="text-center sm:text-left">
                    <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-white/[0.04] border border-white/15 px-2.5 py-0.5 rounded-full mb-2">
                      {selectedSpeaker.tag}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {selectedSpeaker.name}
                    </h3>
                    <p className="text-sm text-cyan-300 font-medium">
                      {selectedSpeaker.title}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedSpeaker.company}
                    </p>
                  </div>
                </div>

                {/* Credentials list if any */}
                {selectedSpeaker.credentials && selectedSpeaker.credentials.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      Key Qualifications & Appointments
                    </h5>
                    <div className="space-y-1.5">
                      {selectedSpeaker.credentials.map((cred, i) => (
                        <div
                          key={i}
                          className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Biography */}
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Biography
                  </h5>
                  <div className="text-xs md:text-sm text-slate-300 font-light leading-relaxed whitespace-pre-line space-y-3">
                    {selectedSpeaker.fullBio}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
