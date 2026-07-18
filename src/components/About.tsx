'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import anime from 'animejs';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.about-anim',
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 1000,
              delay: anime.stagger(150),
              easing: 'easeOutQuart'
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Dates', value: 'Oct 22-23' },
    { label: 'Venue', value: 'NIBM Auditorium' },
    { label: 'Prize Pool', value: 'Rs 100K+' },
    { label: 'Participants', value: '200+' }
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-32 w-full flex items-center min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/symmetrical-corridor.png"
          alt="Symmetrical Corridor"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 about-anim opacity-0">
            Welcome to the <span className="text-cyan-300">Next Frontier</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-300 mb-16 leading-relaxed about-anim opacity-0">
            NIBM CodeX 2.0 is more than just a hackathon. It's a 48-hour sprint of pure innovation, 
            collaboration, and technological breakthrough. Join the brightest minds as we build 
            solutions that push the boundaries of what's possible.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 clip-slanted backdrop-blur-sm about-anim opacity-0 hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-mono font-bold text-cyan-300 mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-wider text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}