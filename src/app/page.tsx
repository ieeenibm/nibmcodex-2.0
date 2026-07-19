import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SectionSeparator from '@/components/SectionSeparator';
import Timeline from '@/components/Timeline';
import VerticalScrollMoment from '@/components/VerticalScrollMoment';
// import Committee from '@/components/Committee';
// import Sponsors from '@/components/Sponsors';
import FAQ from '@/components/FAQ';
// import Registration from '@/components/Registration';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-950 selection:bg-cyan-400/30 selection:text-cyan-400 relative">
      <Header />
      <Hero />
      <About />
      <SectionSeparator />
      <Timeline />
      <VerticalScrollMoment />
      {/* <Committee /> */}
      {/* <Sponsors /> */}
      <FAQ />
      {/* <Registration /> */}
      <Footer />
    </main>
  );
}