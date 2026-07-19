'use client';

export default function SectionSeparator() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full py-28 bg-navy-950 overflow-hidden z-10">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-40 bg-cyan-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Curved Text Loop (React Bits Inspiration) - Ambient Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center scale-150 md:scale-100">
        <svg className="w-[300%] md:w-[150%] h-[300px]" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path id="curve" d="M0,100 Q250,200 500,100 T1000,100 T1500,100 T2000,100" fill="transparent" />
          <text className="text-xl md:text-3xl font-mono uppercase tracking-[0.3em] fill-cyan-400">
            <textPath href="#curve" startOffset="0%">
              <animate attributeName="startOffset" from="0%" to="-50%" dur="20s" repeatCount="indefinite" />
              CODEX CORE ONLINE ✦ ENTER THE NEXT FRONTIER ✦ INITIATE SPRINT ✦ CODEX CORE ONLINE ✦ ENTER THE NEXT FRONTIER ✦ INITIATE SPRINT ✦
            </textPath>
          </text>
        </svg>
      </div>

      {/* Tilted Marquee Foreground */}
      <div className="relative w-[110vw] -left-[5vw] -rotate-3 flex flex-col gap-4 z-10">
        
        {/* Top Row - Moves Left */}
        <div className="flex w-max animate-marquee-left whitespace-nowrap bg-white/5 border-y border-white/10 py-5 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter mx-8 drop-shadow-lg">
                NIBMCodeX 2.0
              </span>
              <span className="text-cyan-400 mx-4 text-2xl">✦</span>
              <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 uppercase tracking-tighter mx-8">
                48-Hour Sprint
              </span>
              <span className="text-cyan-400 mx-4 text-2xl">✦</span>
            </div>
          ))}
        </div>

        {/* Bottom Row - Moves Right */}
        <div className="flex w-max animate-marquee-right whitespace-nowrap bg-navy-900/90 border-y border-white/5 py-4 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-lg md:text-2xl font-mono text-slate-400 uppercase tracking-widest mx-8">
                Push Boundaries
              </span>
              <span className="text-slate-600 mx-4">///</span>
              <span className="text-lg md:text-2xl font-mono text-slate-400 uppercase tracking-widest mx-8">
                Innovate & Conquer
              </span>
              <span className="text-slate-600 mx-4">///</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}