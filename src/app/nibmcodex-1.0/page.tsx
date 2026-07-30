import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PreviousEditionHero from './PreviousEditionHero';
import EditionStats from './EditionStats';
import GalleryGrid from './GalleryGrid';
import Committee from './Committee';
import Partners from './Partners';
import KeyMoments from './KeyMoments';
import FAQ from './FAQ';

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
      <FAQ />
      <Footer />
    </main>
  );
}
