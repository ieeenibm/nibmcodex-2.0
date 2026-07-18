'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import anime from 'animejs';

export default function VerticalScrollMoment() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = 1 - (rect.bottom / (window.innerHeight + rect.height));
        
        if (scrollProgress >= 0 && scrollProgress <= 1) {
          containerRef.current.style.transform = `translateY(${scrollProgress * 100 - 50}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 scale-110" ref={containerRef}>
        <Image
          src="/images/holodeck.png"
          alt="Holodeck Core"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/60 mix-blend-multiply"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-widest font-mono drop-shadow-2xl">
          Enter The <span className="text-cyan-300">Core</span>
        </h2>
      </div>
    </section>
  );
}