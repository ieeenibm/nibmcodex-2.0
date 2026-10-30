import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RulebookView from '@/components/rulebook/RulebookView';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Physical Participation Rulebook | NIBMCodeX 2.0 // IEEEXTREME 20.0',
  description:
    'Official physical participation guidelines, competition rules, registration credentials, venue amenities, and pre-arrival checklist for IEEEXtreme 20.0 at NIBM Auditorium Colombo.',
  keywords: [
    'IEEEXtreme 20.0',
    'Rulebook',
    'NIBMCodeX 2.0',
    'IEEE Student Branch of NIBM',
    'Physical Participation',
    'Hackathon Rules',
    'NIBM Auditorium',
    'Coding Competition',
  ],
  openGraph: {
    title: 'IEEEXtreme 20.0 Physical Participation Rulebook | NIBMCodeX 2.0',
    description:
      'Official physical participation guidelines, rules, credentials, and checklist for IEEEXtreme 20.0 at NIBM Auditorium.',
    url: 'https://nibmcodex.nibmieee.lk/rulebook',
    type: 'article',
    images: [
      {
        url: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/misc/wide-cityscape',
        width: 1200,
        height: 630,
        alt: 'NIBMCodeX 2.0 IEEEXtreme Rulebook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IEEEXtreme 20.0 Physical Participation Rulebook | NIBMCodeX 2.0',
    description:
      'Official physical participation guidelines, rules, credentials, and checklist for IEEEXtreme 20.0 at NIBM Auditorium.',
    images: ['https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/misc/wide-cityscape'],
  },
  alternates: {
    canonical: 'https://nibmcodex.nibmieee.lk/rulebook',
  },
};

export default function RulebookPage() {
  return (
    <main className="min-h-screen bg-navy-950 selection:bg-[#7bdfff]/30 selection:text-[#7bdfff] relative">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-[#7bdfff] transition-colors mb-6 font-mono text-xs sm:text-sm uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <RulebookView />
      </div>
      <Footer />
    </main>
  );
}
