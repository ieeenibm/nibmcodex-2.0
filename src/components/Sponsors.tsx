'use client';
import { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          anime({
            targets: '.sponsor-anim',
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const sponsors = [
    { name: 'TechVision', tier: 'Platinum' },
    { name: 'CloudDynamics', tier: 'Gold' },
    { name: 'QuantumAI', tier: 'Gold' },
    { name: 'DataForce', tier: 'Silver' },
    { name: 'SecureNet', tier: 'Silver' },
    { name: 'DevTools Pro', tier: 'Bronze' },
  ];

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Platinum': return 'text-cyan-300 border-cyan-300/50 bg-cyan-300/10';
      case 'Gold': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'Silver': return 'text-slate-300 border-slate-300/50 bg-slate-300/10';
      case 'Bronze': return 'text-orange-400 border-orange-400/50 bg-orange-400/10';
      default: return 'text-white border-white/20 bg-white/5';
    }
  };

  return (
    <section id="sponsors" ref={sectionRef} className="py-32 bg-navy-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <span className="inline-block px-3 py-1 mb-4 border border-cyan-300/30 text-cyan-300 text-xs font-mono uppercase tracking-widest clip-slanted">
            Partners
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Our Sponsors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {sponsors.map((sponsor, idx) => (
            <div key={idx} className="sponsor-anim opacity-0 bg-white/5 border border-white/10 p-8 clip-slanted hover:bg-white/10 transition-all duration-300 group">
              <div className={`inline-block px-2 py-1 text-xs uppercase tracking-wider mb-6 border ${getTierColor(sponsor.tier)}`}>
                {sponsor.tier}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-900 border border-white/20 flex items-center justify-center group-hover:border-cyan-300 transition-colors">
                  <div className="w-4 h-4 bg-slate-400 group-hover:bg-cyan-300 transition-colors"></div>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{sponsor.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center sponsor-anim opacity-0">
          <div className="bg-navy-800 border border-white/10 p-8 max-w-2xl mx-auto clip-slanted">
            <h3 className="text-2xl font-bold text-white mb-4">Want to sponsor us?</h3>
            <p className="text-slate-400 mb-6">Join us in shaping the future of technology by supporting the brightest minds.</p>
            <button className="px-8 py-3 bg-white/10 hover:bg-cyan-500 hover:text-navy-900 text-white font-bold uppercase tracking-wider transition-colors clip-slanted">
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}