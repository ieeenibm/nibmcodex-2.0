'use client';
import { useState } from 'react';
import DriftWall, { DriftWallItem } from '@/components/ui/DriftWall';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jwuioa0d';
const getUrl = (id: string) => `https://res.cloudinary.com/${cloudName}/image/upload/w_600,q_auto,f_auto/v1/${id}`;
const getFullUrl = (id: string) => `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/v1/${id}`;

// Strictly NIBMCodeX 2.0 images (AI Workshop + Awareness Sessions)
const baseImages = [
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_115108",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_123943",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_123951",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_124112",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2153",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2180",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2268",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_7514",
  "nibmcodex/2.0/gallery/ai-workshop/file",
  "nibmcodex/awareness-sessions-1/1",
  "nibmcodex/awareness-sessions-1/2",
  "nibmcodex/awareness-sessions-1/3",
  "nibmcodex/awareness-sessions-1/4",
  "nibmcodex/awareness-sessions-1/5",
  "nibmcodex/awareness-sessions-1/6",
  "nibmcodex/awareness-sessions-1/7",
  "nibmcodex/awareness-sessions-1/8",
];

// Duplicate the items so the wall looks dense and masonry-like
const items: DriftWallItem[] = [
  ...baseImages,
  ...baseImages,
  ...baseImages,
].map((src) => ({
  id: src,
  image: getUrl(src),
}));

export default function LandingGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="relative w-full pt-20 pb-10 bg-navy-950 overflow-hidden flex flex-col items-center">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-60 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Title - exactly matching EventSeries and Timeline styles */}
      <div className="relative z-20 text-center max-w-3xl mx-auto px-4 mb-8 pt-12 pointer-events-none">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-cyan-900/30 border border-cyan-500/30 backdrop-blur-sm">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">Visual Journey</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
          Captured <span className="text-gradient-cyan">Moments</span>
        </h2>
        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          Explore highlights from our latest workshops and sessions.
        </p>
      </div>

      <div className="relative w-full h-[800px] md:h-[900px] z-10 scale-100 md:scale-125 pointer-events-auto">
        <DriftWall
          items={items}
          columns={4}
          gap={16}
          tileWidth={280}
          tileHeight={210}
          direction="up"
          speed={40}
          parallax={0.6}
          dim={1}
          grayscale={true}
          overlayColor="#020617"
          onItemClick={(item) => setSelectedImage(item.id || null)}
        />
      </div>
      
      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={getFullUrl(selectedImage)}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
}
