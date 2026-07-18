'use client';
import { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.timeline-item',
              translateX: [-50, 0],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(200),
              easing: 'easeOutQuad'
            });
            anime({
              targets: '.timeline-line',
              height: ['0%', '100%'],
              duration: 1500,
              easing: 'easeInOutQuad'
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    { title: 'Branch Awareness Sessions', date: 'Coming Soon', desc: 'Roadshow events across NIBM branches to raise awareness and inspire participation.' },
    { title: 'Galle & Matara', date: 'Coming Soon', desc: 'Awareness sessions and workshops at NIBM Galle and Matara campuses.' },
    { title: 'Kandy & Kurunegala KIC', date: 'Coming Soon', desc: 'Engaging the Kandy and Kurunegala innovation communities with hands-on sessions.' },
    { title: 'AI/ML Workshop', date: 'Coming Soon', desc: 'An immersive workshop exploring artificial intelligence and machine learning technologies.' },
    { title: 'Summit', date: 'Coming Soon', desc: 'The main summit — where the brightest minds gather to innovate and compete.' },
    { title: 'IEEE Xtreme 20.0', date: 'Coming Soon', desc: '24-Hour Coding Challenge — a global hackathon experience right here at NIBM.' },
  ];

  return (
    <section id="timeline" ref={sectionRef} className="py-32 bg-navy-900 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <span className="inline-block px-3 py-1 mb-4 border border-cyan-300/30 text-cyan-300 text-xs font-mono uppercase tracking-widest clip-slanted">
            Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Event Timeline</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical dotted line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-white/20 timeline-line origin-top -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div key={idx} className={`relative flex items-center md:justify-between flex-col md:flex-row timeline-item opacity-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Marker */}
                <div className="absolute left-[15px] md:left-1/2 w-6 h-6 rounded-full bg-navy-900 border-2 border-cyan-300 -translate-x-1/2 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(103,232,249,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-cyan-300"></div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="bg-white/5 border border-white/10 p-6 clip-slanted hover:bg-white/10 transition-colors">
                    <div className="text-cyan-300 font-mono text-sm mb-2">{step.date}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.desc}</p>
                  </div>
                </div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-[45%]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
