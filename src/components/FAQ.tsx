'use client';
import { useState, useRef, useEffect } from 'react';
import anime from 'animejs';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          anime({
            targets: '.faq-anim',
            translateY: [20, 0],
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

  const faqs = [
    { q: 'Who can participate?', a: 'Any university student with a passion for coding can join.' },
    { q: 'Is there a registration fee?', a: 'No, registration is completely free.' },
    { q: 'What is the team size?', a: 'Teams can have 3-5 members.' },
    { q: 'Will meals be provided?', a: 'Yes, food and beverages will be provided during the 48-hour hackathon.' },
  ];

  return (
    <section className="py-32 bg-navy-900 border-t border-white/5" ref={sectionRef}>
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16 faq-anim opacity-0">
          <span className="inline-block px-3 py-1 mb-4 border border-cyan-300/30 text-cyan-300 text-xs font-mono uppercase tracking-widest clip-slanted">
            Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 clip-slanted faq-anim opacity-0 overflow-hidden">
              <button 
                className="w-full text-left p-6 flex justify-between items-center text-white hover:text-cyan-300 transition-colors"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="font-bold">{faq.q}</span>
                <span className={`transform transition-transform ${open === idx ? 'rotate-180' : ''}`}>↓</span>
              </button>
              <div 
                className="px-6 text-slate-400 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ maxHeight: open === idx ? '100px' : '0', paddingBottom: open === idx ? '1.5rem' : '0' }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}