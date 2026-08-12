'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface GalleryEvent {
  id: string;
  title: string;
  date: string;
  folder: string;
  count: number;
  images: string[];
}

const events: GalleryEvent[] = [
  {
    id: 'kurunegala',
    title: 'Kurunegala Branch Awareness Session',
    date: 'Sep 18, 2025 - 9:30 AM',
    folder: 'kurunegala',
    count: 10,
    images: Array.from({ length: 10 }, (_, i) => `gallery/kurunegala/${String(i + 1).padStart(2, '0')}.JPG`),
  },
  {
    id: 'kandy',
    title: 'Kandy Branch Awareness Session',
    date: 'Sep 18, 2025 - 2:30 PM',
    folder: 'kandy',
    count: 10,
    images: Array.from({ length: 10 }, (_, i) => `gallery/kandy/${String(i + 1).padStart(2, '0')}.jpg`),
  },
  {
    id: 'matara',
    title: 'Matara Branch Awareness Session',
    date: 'Sep 23, 2025 - 9:30 AM',
    folder: 'matara',
    count: 10,
    images: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map((i) => `gallery/matara/${String(i).padStart(2, '0')}.jpg`),
  },
  {
    id: 'galle',
    title: 'Galle Branch Awareness Session',
    date: 'Sep 23, 2025 - 1:30 PM',
    folder: 'galle',
    count: 10,
    images: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12].map((i) => `gallery/galle/${String(i).padStart(2, '0')}.jpg`),
  },
  {
    id: 'online',
    title: 'Online Awareness Session',
    date: 'Oct 3, 2025 - 7:30 PM',
    folder: 'online',
    count: 3,
    images: ['gallery/online/01.jpg', 'gallery/online/02.jpg', 'gallery/online/03.png'],
  },
  {
    id: 'icta1',
    title: 'ICTA Workshop 01',
    date: 'Oct 8, 2025 - 9:00 AM',
    folder: 'icta1',
    count: 10,
    images: Array.from({ length: 10 }, (_, i) => `gallery/icta1/${String(i + 1).padStart(2, '0')}.jpg`),
  },
  {
    id: 'icta2',
    title: 'ICTA Workshop 02',
    date: 'Oct 15, 2025 - 9:00 AM',
    folder: 'icta2',
    count: 10,
    images: Array.from({ length: 10 }, (_, i) => `gallery/icta2/${String(i + 1).padStart(2, '0')}.jpg`),
  },
  {
    id: 'final',
    title: 'Final Hackathon',
    date: 'Oct 25, 2025 - NIBM Colombo Campus',
    folder: 'final',
    count: 4,
    images: Array.from({ length: 4 }, (_, i) => `gallery/final/${String(i + 1).padStart(2, '0')}.jpg`),
  },
];

export default function GalleryGrid() {
  const [activeEvent, setActiveEvent] = useState<GalleryEvent | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (event: GalleryEvent, idx: number) => {
    setActiveEvent(event);
    setActiveIndex(idx);
  };

  const closeLightbox = () => {
    setActiveEvent(null);
    setActiveIndex(0);
  };

  const goNext = () => {
    if (!activeEvent) return;
    setActiveIndex((prev) => (prev + 1) % activeEvent.images.length);
  };

  const goPrev = () => {
    if (!activeEvent) return;
    setActiveIndex((prev) => (prev - 1 + activeEvent.images.length) % activeEvent.images.length);
  };

  return (
    <section id="gallery" className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Moments
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Event <span className="text-gradient-cyan">Gallery</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            Browse through highlights of our branch awareness sessions, workshops, and the grand hackathon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <div className="cursor-pointer" onClick={() => openLightbox(event, 0)}>
                <SpotlightCard className="group h-full glass-panel-light clip-slanted overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`/images/nibmcodex-1.0/${event.images[0]}`}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent"></div>
                  
                  {/* Photo count badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-navy-950/70 backdrop-blur-sm rounded-full text-[10px] font-mono text-cyan-400 border border-cyan-400/20">
                    +{event.count}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-base font-bold text-white mb-1 tracking-tight group-hover:text-cyan-300 transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">{event.date}</p>
                  </div>
                </div>
              </SpotlightCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 text-white">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{activeEvent.title}</h3>
                  <p className="text-xs text-cyan-400 font-mono">{activeEvent.date}</p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Image */}
              <div className="relative flex-1 flex items-center justify-center min-h-[50vh] bg-navy-950/50 rounded-2xl overflow-hidden border border-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={`/images/nibmcodex-1.0/${activeEvent.images[activeIndex]}`}
                      alt={`${activeEvent.title} - Photo ${activeIndex + 1}`}
                      width={1200}
                      height={800}
                      className="max-h-[70vh] w-auto object-contain rounded-lg"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Nav buttons */}
                {activeEvent.images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors text-white"
                    >
                      <ChevronLeft size={22} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors text-white"
                    >
                      <ChevronRight size={22} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 text-white/60 text-xs font-mono">
                <span>{activeIndex + 1} / {activeEvent.images.length}</span>
                <div className="flex gap-1.5">
                  {activeEvent.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex ? 'bg-cyan-400 w-4' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span>{activeEvent.folder.toUpperCase()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
