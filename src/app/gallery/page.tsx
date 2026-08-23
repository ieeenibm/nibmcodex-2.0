import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryHub from '@/components/gallery/GalleryHub';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gallery | NIBMCodeX 2.0',
  description: 'Memories and highlights from NIBMCodeX events.',
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-navy-950 selection:bg-cyan-400/30 selection:text-cyan-400 relative">
      <Header />
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">NIBMCodeX Gallery</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mb-12">
          A centralized hub for all the memories, highlights, and behind-the-scenes moments from NIBMCodeX 2.0 and previous editions.
        </p>
        <Suspense fallback={<div className="h-[60vh] w-full animate-pulse bg-white/5 rounded-2xl border border-white/10" />}>
          <GalleryHub />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
