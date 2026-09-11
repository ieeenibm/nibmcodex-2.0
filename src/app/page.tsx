import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CountdownSection from '@/components/CountdownSection';
import SectionSeparator from '@/components/SectionSeparator';
import LandingGallery from '@/components/LandingGallery';
import EventSeries from '@/components/EventSeries';
import AISummitSection from '@/components/AISummitSection';
import Timeline from '@/components/Timeline';
import VerticalScrollMoment from '@/components/VerticalScrollMoment';
// import About from '@/components/About';
import Committee from '@/components/Committee';
import Partners from '@/components/Partners';
// import Sponsors from '@/components/Sponsors';
import FAQ from '@/components/FAQ';
// import Registration from '@/components/Registration';
import Footer from '@/components/Footer';
import RegistrationPill from '@/components/ui/RegistrationPill';
import LivePlayBubble from '@/components/LivePlayBubble';
import WhatsAppBubble from '@/components/WhatsAppBubble';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-950 selection:bg-cyan-400/30 selection:text-cyan-400 relative w-full max-w-full overflow-x-clip">
      <Header />
      <Hero />
      <CountdownSection />
      <SectionSeparator />
      <LandingGallery />
      <EventSeries />
      <AISummitSection />
      <Timeline />
      <Committee />
      <Partners />
      <VerticalScrollMoment />
      {/* <About /> */}
      {/* <Sponsors /> */}
      <FAQ />
      {/* <Registration /> */}
      <Footer />
      <RegistrationPill />
      <LivePlayBubble />
      <WhatsAppBubble />
    </main>
  );
}