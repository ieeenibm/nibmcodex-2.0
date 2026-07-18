'use client';
import { useRef, useEffect } from 'react';
import anime from 'animejs';

export default function Registration() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          anime({
            targets: '.reg-anim',
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

  return (
    <section id="register" ref={sectionRef} className="py-32 relative bg-navy-900 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 reg-anim opacity-0">
            <span className="inline-block px-3 py-1 mb-4 border border-cyan-300/30 text-cyan-300 text-xs font-mono uppercase tracking-widest clip-slanted">
              Registration
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join CodeX 2.0</h2>
            <p className="text-slate-400">Secure your spot. Limited slots available for the 48-hour sprint.</p>
          </div>

          <form className="bg-navy-800/50 p-8 md:p-12 border border-white/10 clip-slanted reg-anim opacity-0" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-mono text-cyan-300 mb-2 uppercase">Full Name</label>
                <input type="text" className="w-full bg-navy-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-300 transition-colors clip-slanted" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-mono text-cyan-300 mb-2 uppercase">Email Address</label>
                <input type="email" className="w-full bg-navy-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-300 transition-colors clip-slanted" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-mono text-cyan-300 mb-2 uppercase">Phone Number</label>
                <input type="tel" className="w-full bg-navy-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-300 transition-colors clip-slanted" placeholder="+94 7X XXX XXXX" />
              </div>
              <div>
                <label className="block text-sm font-mono text-cyan-300 mb-2 uppercase">Institution</label>
                <input type="text" className="w-full bg-navy-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-300 transition-colors clip-slanted" placeholder="University / Campus" />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-mono text-cyan-300 mb-2 uppercase">Team Name (Optional)</label>
              <input type="text" className="w-full bg-navy-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-300 transition-colors clip-slanted" placeholder="Enter team name" />
            </div>

            <button type="submit" className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold uppercase tracking-widest transition-colors clip-slanted text-lg">
              Submit Registration
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}