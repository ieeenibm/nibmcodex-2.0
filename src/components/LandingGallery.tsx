'use client';
import DriftWall, { DriftWallItem } from '@/components/ui/DriftWall';
import Link from 'next/link';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jwuioa0d';
const getUrl = (id: string) => `https://res.cloudinary.com/${cloudName}/image/upload/w_600,q_auto,f_auto/v1/${id}`;

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
  "nibmcodex/2.0/memories/awareness-sessions-1/1",
  "nibmcodex/2.0/memories/awareness-sessions-1/2",
  "nibmcodex/2.0/memories/awareness-sessions-1/3",
  "nibmcodex/2.0/memories/awareness-sessions-1/4",
  "nibmcodex/2.0/memories/awareness-sessions-1/5",
  "nibmcodex/2.0/memories/awareness-sessions-1/6",
  "nibmcodex/2.0/memories/awareness-sessions-1/7",
  "nibmcodex/2.0/memories/awareness-sessions-1/8",
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

      <div className="relative w-full h-[500px] md:h-[600px] z-10 scale-100 md:scale-125 pointer-events-auto">
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
          turn={0}
          tilt={10}
        />
      </div>

      <div className="relative z-20 mt-12 flex justify-center w-full px-4">
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/50 rounded-full text-base font-semibold text-slate-300 hover:text-cyan-400 transition-all duration-300 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
        >
          View Full Gallery
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </section>
  );
}
