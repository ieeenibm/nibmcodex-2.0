'use client';
import DriftWall, { DriftWallItem } from '@/components/ui/DriftWall';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jwuioa0d';
const getUrl = (id: string) => `https://res.cloudinary.com/${cloudName}/image/upload/w_600,q_auto,f_auto/v1/${id}`;

// Strictly NIBMCodeX 2.0 images
const baseImages = [
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_115108",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_123943",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_123951",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_20260819_124112",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2153",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2180",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_2268",
  "nibmcodex/2.0/gallery/ai-workshop/Copy_of_IMG_7514",
  "nibmcodex/2.0/gallery/ai-workshop/file"
];

// Duplicate the items so the wall looks dense and masonry-like
const items: DriftWallItem[] = [
  ...baseImages,
  ...baseImages,
  ...baseImages,
].map((src) => ({
  image: getUrl(src),
}));

export default function LandingGallery() {
  return (
    <section className="relative w-full h-[600px] md:h-[800px] bg-navy-950 overflow-hidden flex flex-col items-center">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-60 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Title - exactly matching EventSeries and Timeline styles */}
      <div className="relative z-20 text-center max-w-3xl mx-auto px-4 mb-8 pt-12 pointer-events-none">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-cyan-900/30 border border-cyan-500/30 backdrop-blur-sm">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">Visual Journey</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
          Captured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Moments</span>
        </h2>
        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          Explore highlights from our latest workshops and sessions.
        </p>
      </div>

      <div className="relative w-full h-[600px] md:h-[700px] z-10 scale-100 md:scale-125 pointer-events-auto">
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
        />
      </div>
      
    </section>
  );
}
