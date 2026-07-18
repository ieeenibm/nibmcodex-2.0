import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Timeline from '@/components/Timeline';
import VerticalScrollMoment from '@/components/VerticalScrollMoment';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-900 overflow-x-hidden selection:bg-cyan-300/30 selection:text-cyan-300">
      <Header />
      <Hero />
      <About />
      <Timeline />
      <VerticalScrollMoment />
      <FAQ />
      <Footer />
    </main>
  );
}
