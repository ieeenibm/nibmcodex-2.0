'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import anime from 'animejs';

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      el.style.opacity = '1';
      anime({
        targets: '.hero-anim',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
      });
    }
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/wide-cityscape.png"
          alt="Tron Cityscape"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/40 to-navy-900"></div>
      </div>

      {/* Content */}
      <div 
        ref={textRef} 
        className="relative z-10 container mx-auto px-6 text-center opacity-0 flex flex-col items-center mt-20"
      >
        <div className="inline-block px-4 py-1.5 mb-6 border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 text-xs font-mono uppercase tracking-widest clip-slanted hero-anim">
          October 22-23, 2026 • NIBM
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-6 text-white hero-anim">
          NIBM<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">CodeX</span>
          <sup className="text-3xl md:text-4xl lg:text-5xl ml-1 text-cyan-300 font-mono">2.0</sup>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 hero-anim">
          The ultimate 48-hour hackathon experience. Build, innovate, and conquer the digital frontier.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 hero-anim">
          <a href="#about" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold uppercase tracking-wider transition-colors clip-slanted">
            Learn More
          </a>
          <a href="#timeline" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-wider transition-colors clip-slanted">
            View Timeline
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
        <span className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Scroll</span>
        <ChevronDown className="text-cyan-300" size={24} />
      </div>
    </section>
  );
}
