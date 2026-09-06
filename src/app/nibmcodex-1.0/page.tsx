import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PreviousEditionHero from './PreviousEditionHero';
import EditionStats from './EditionStats';
import GalleryGrid from './GalleryGrid';
import Committee from './Committee';
import Partners from './Partners';
import KeyMoments from './KeyMoments';
import WhatWeProvided from './WhatWeProvided';
import FAQ from './FAQ';
import BackToMainCta from './BackToMainCta';

export const metadata: Metadata = {
  title: 'NIBMCodeX 1.0 | The First Edition',
  description: 'Relive the highlights, key moments, and memories from the inaugural NIBMCodeX 1.0 hackathon series across Sri Lanka.',
  alternates: {
    canonical: 'https://nibmcodex.nibmieee.lk/nibmcodex-1.0',
  },
};

export default function NIBMCodeX10() {
  return (
    <main className="min-h-screen bg-navy-950 selection:bg-cyan-400/30 selection:text-cyan-400 relative">
      <Header />
      <PreviousEditionHero />
      <EditionStats />
      <GalleryGrid />
      <Committee />
      <Partners />
      <KeyMoments />
      <WhatWeProvided />
      <FAQ />
      <BackToMainCta />
      <Footer />
    </main>
  );
}
