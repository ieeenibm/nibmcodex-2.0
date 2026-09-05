'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { PlayCircle, LayoutGrid, Layers } from 'lucide-react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary';

type EventGallery = {
  id: string;
  title: string;
  date: string;
  imageIds: string[];
};

const galleries: EventGallery[] = [
  {
    id: 'ai-workshop',
    title: 'AI for Learning Workshop',
    date: 'August 19, 2026',
    imageIds: [
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_115108",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_123943",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_123951",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_124112",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2153",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2180",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2268",
      "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_7514"
    ],
  },
  {
    id: 'awareness-1',
    title: 'Branch Awareness Sessions 1',
    date: 'August 3, 2026',
    imageIds: [
      'nibmcodex/2.0/memories/awareness-sessions-1/1',
      'nibmcodex/2.0/memories/awareness-sessions-1/2',
      'nibmcodex/2.0/memories/awareness-sessions-1/3',
      'nibmcodex/2.0/memories/awareness-sessions-1/4',
      'nibmcodex/2.0/memories/awareness-sessions-1/5',
      'nibmcodex/2.0/memories/awareness-sessions-1/6',
      'nibmcodex/2.0/memories/awareness-sessions-1/7',
      'nibmcodex/2.0/memories/awareness-sessions-1/8',
    ],
  }
,
  {
    id: 'nibmcodex-1.0',
    title: 'NIBMCodeX 1.0 Memories',
    date: 'September 2025',
    imageIds: [
      "nibmcodex/1.0/gallery/final/01",
      "nibmcodex/1.0/gallery/final/02",
      "nibmcodex/1.0/gallery/final/03",
      "nibmcodex/1.0/gallery/final/04",
      "nibmcodex/1.0/gallery/galle/01",
      "nibmcodex/1.0/gallery/galle/02",
      "nibmcodex/1.0/gallery/galle/03",
      "nibmcodex/1.0/gallery/galle/04",
      "nibmcodex/1.0/gallery/galle/06",
      "nibmcodex/1.0/gallery/galle/07",
      "nibmcodex/1.0/gallery/galle/08",
      "nibmcodex/1.0/gallery/galle/09",
      "nibmcodex/1.0/gallery/galle/11",
      "nibmcodex/1.0/gallery/galle/12",
      "nibmcodex/1.0/gallery/icta1/01",
      "nibmcodex/1.0/gallery/icta1/02",
      "nibmcodex/1.0/gallery/icta1/03",
      "nibmcodex/1.0/gallery/icta1/04",
      "nibmcodex/1.0/gallery/icta1/05",
      "nibmcodex/1.0/gallery/icta1/06",
      "nibmcodex/1.0/gallery/icta1/07",
      "nibmcodex/1.0/gallery/icta1/08",
      "nibmcodex/1.0/gallery/icta1/09",
      "nibmcodex/1.0/gallery/icta1/10",
      "nibmcodex/1.0/gallery/icta2/01",
      "nibmcodex/1.0/gallery/icta2/02",
      "nibmcodex/1.0/gallery/icta2/03",
      "nibmcodex/1.0/gallery/icta2/04",
      "nibmcodex/1.0/gallery/icta2/05",
      "nibmcodex/1.0/gallery/icta2/06",
      "nibmcodex/1.0/gallery/icta2/07",
      "nibmcodex/1.0/gallery/icta2/08",
      "nibmcodex/1.0/gallery/icta2/09",
      "nibmcodex/1.0/gallery/icta2/10",
      "nibmcodex/1.0/gallery/kandy/01",
      "nibmcodex/1.0/gallery/kandy/02",
      "nibmcodex/1.0/gallery/kandy/03",
      "nibmcodex/1.0/gallery/kandy/04",
      "nibmcodex/1.0/gallery/kandy/05",
      "nibmcodex/1.0/gallery/kandy/06",
      "nibmcodex/1.0/gallery/kandy/07",
      "nibmcodex/1.0/gallery/kandy/08",
      "nibmcodex/1.0/gallery/kandy/09",
      "nibmcodex/1.0/gallery/kandy/10",
      "nibmcodex/1.0/gallery/kurunegala/01",
      "nibmcodex/1.0/gallery/kurunegala/02",
      "nibmcodex/1.0/gallery/kurunegala/03",
      "nibmcodex/1.0/gallery/kurunegala/04",
      "nibmcodex/1.0/gallery/kurunegala/05",
      "nibmcodex/1.0/gallery/kurunegala/06",
      "nibmcodex/1.0/gallery/kurunegala/07",
      "nibmcodex/1.0/gallery/kurunegala/08",
      "nibmcodex/1.0/gallery/kurunegala/09",
      "nibmcodex/1.0/gallery/kurunegala/10",
      "nibmcodex/1.0/gallery/matara/01",
      "nibmcodex/1.0/gallery/matara/02",
      "nibmcodex/1.0/gallery/matara/03",
      "nibmcodex/1.0/gallery/matara/04",
      "nibmcodex/1.0/gallery/matara/05",
      "nibmcodex/1.0/gallery/matara/07",
      "nibmcodex/1.0/gallery/matara/08",
      "nibmcodex/1.0/gallery/matara/09",
      "nibmcodex/1.0/gallery/matara/10",
      "nibmcodex/1.0/gallery/matara/11",
      "nibmcodex/1.0/gallery/online/01",
      "nibmcodex/1.0/gallery/online/02",
      "nibmcodex/1.0/gallery/online/03"
    ],
  }
];

export default function GalleryHub() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || galleries[0].id;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [subFilter, setSubFilter] = useState<string>('All');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && galleries.some(g => g.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);


  const activeGallery = galleries.find(g => g.id === activeTab) || galleries[0];

  let filteredImages = activeGallery.imageIds;
  let availableFilters: string[] = [];

  if (activeGallery.id === 'nibmcodex-1.0') {
    const events = new Set<string>();
    activeGallery.imageIds.forEach(id => {
      const parts = id.split('/');
      if (parts.length >= 5) {
        // e.g., nibmcodex/1.0/gallery/galle/01 -> galle
        events.add(parts[3]);
      }
    });
    availableFilters = ['All', ...Array.from(events)];
    
    if (subFilter !== 'All') {
      filteredImages = activeGallery.imageIds.filter(id => {
        const parts = id.split('/');
        return parts.length >= 5 && parts[3] === subFilter;
      });
    }
  }


  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
        {galleries.map(gallery => {
          const isActive = activeTab === gallery.id;
          return (
            <button
              key={gallery.id}
              onClick={() => { setActiveTab(gallery.id); setSubFilter('All'); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                gallery.id === 'nibmcodex-1.0' ? 'ml-auto' : ''
              } ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {isActive ? <LayoutGrid size={16} /> : <Layers size={16} />}
              {gallery.title}
            </button>
          );
        })}
      </div>


      {/* Sub Filters */}
      {availableFilters.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {availableFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setSubFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize ${
                subFilter === filter 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' 
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
              }`}
            >
              {filter.replace(/\d+$/, match => ' ' + match).replace(/icta/i, 'ICTA')}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredImages.length > 0 ? (
            filteredImages.map((id, index) => {
              const isVideo = id.endsWith('#video');
              const realId = id.replace('#video', '');
              return (
              <motion.div 
                layoutId={`gallery-img-${activeGallery.id}-${index}`}
                key={id + index} 
                className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              >
                
                
                {/* 
                  CldImage will attempt to render. If the ID is a placeholder, 
                  it will fail silently or show an alt text. Once real IDs are used, 
                  it works beautifully.
                */}
                <div className="absolute inset-0 bg-slate-800/60 overflow-hidden pointer-events-none"><div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" /></div>
                {isVideo ? (
                  <img 
                    src={`https://res.cloudinary.com/jwuioa0d/video/upload/w_600,q_auto,f_auto,so_0/v1/${realId}.jpg`}
                    alt={`Video thumbnail ${index + 1}`}
                    className="absolute inset-0 w-full h-full text-transparent object-cover transition-transform duration-500 group-hover:scale-110 z-10"
                  />
                ) : (
                  <CldImage
                    src={realId}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    config={CLOUDINARY_CONFIG}
                    priority={index < 4}
                    className="text-transparent object-cover transition-transform duration-500 group-hover:scale-110 z-10"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <PlayCircle className="text-white/80 w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                )}
              </motion.div>
            );
          })
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Layers className="text-slate-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-slate-500 max-w-sm">Media for this event will be uploaded shortly after it concludes.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-navy-950/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all z-10 cursor-pointer"
              onClick={() => setLightboxIndex(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              layoutId={`gallery-img-${activeGallery.id}-${lightboxIndex}`}
              className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const activeId = filteredImages[lightboxIndex];
                const isVid = activeId.endsWith('#video');
                const cleanId = activeId.replace('#video', '');
                
                return isVid ? (
                  <div className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={`https://res.cloudinary.com/jwuioa0d/video/upload/q_auto,f_auto/v1/${cleanId}`}
                      className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg"
                      autoPlay
                      controls
                      playsInline
                    />
                  </div>
                ) : (
                  <CldImage
                    src={cleanId}
                    alt="Enlarged gallery image"
                    width={1920}
                    height={1080}
                    config={CLOUDINARY_CONFIG}
                    className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                    priority
                  />
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
