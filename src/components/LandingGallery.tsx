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
      <div className="absolute top-12 left-0 right-0 z-20 px-4 text-center pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter drop-shadow-2xl">
          Captured Moments
        </h2>
      </div>

      <div className="w-[120vw] h-[120vh] -top-[10%] -left-[10%] absolute z-10 scale-100 md:scale-125">
        <DriftWall
          items={items}
          columns={4}
          gap={16}
          tileWidth={280}
          tileHeight={210}
          direction="down"
          speed={0.15}
          parallax={0.03}
          dim={1}
          grayscale={true}
          overlayColor="#020617"
        />
      </div>
      
    </section>
  );
}
