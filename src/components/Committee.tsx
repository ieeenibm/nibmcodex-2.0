'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

import anime from 'animejs';

export default function Committee() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          anime({
            targets: '.oc-card',
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(150),
            easing: 'easeOutBack'
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const team = [
    { name: 'Alex Johnson', role: 'Chief Organizer', pos: 'center' },
    { name: 'Sarah Miller', role: 'Co-Organizer', pos: 'top-left' },
    { name: 'David Chen', role: 'Tech Lead', pos: 'top-right' },
    { name: 'Emily Davis', role: 'Marketing Head', pos: 'bottom-left' },
    { name: 'Michael Brown', role: 'Logistics Lead', pos: 'bottom-right' },
  ];

  return (
    <section id="committee" ref={sectionRef} className="relative py-32 bg-navy-900 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/images/holodeck.png"
          alt="Holodeck Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/80 to-navy-900"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <span className="inline-block px-3 py-1 mb-4 border border-cyan-300/30 text-cyan-300 text-xs font-mono uppercase tracking-widest clip-slanted">
            Leadership
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Organizing Committee</h2>
        </div>

        {/* Tree Structure Desktop */}
        <div className="hidden lg:block relative max-w-5xl mx-auto h-[600px]">
          {/* SVG Branches */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
          </svg>

          {/* Center Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-64 oc-card opacity-0">
            <TeamCard member={team[0]} primary />
          </div>

          {/* Corner Cards */}
          <div className="absolute top-[10%] left-[10%] w-56 oc-card opacity-0"><TeamCard member={team[1]} /></div>
          <div className="absolute top-[10%] right-[10%] w-56 oc-card opacity-0"><TeamCard member={team[2]} /></div>
          <div className="absolute bottom-[10%] left-[10%] w-56 oc-card opacity-0"><TeamCard member={team[3]} /></div>
          <div className="absolute bottom-[10%] right-[10%] w-56 oc-card opacity-0"><TeamCard member={team[4]} /></div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {team.map((member, idx) => (
            <div key={idx} className="oc-card opacity-0">
              <TeamCard member={member} primary={idx === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, primary = false }: { member: any, primary?: boolean }) {
  return (
    <div className={`bg-navy-800/80 backdrop-blur-md border ${primary ? 'border-cyan-300' : 'border-white/10'} p-6 clip-slanted flex flex-col items-center text-center hover:bg-white/5 transition-colors`}>
      <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold bg-navy-900 border ${primary ? 'border-cyan-300 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-white/20 text-slate-300'}`}>
        {member.name.charAt(0)}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
      <p className="text-cyan-300 text-sm mb-4">{member.role}</p>
      <a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors">
        LinkedIn
      </a>
    </div>
  );
}