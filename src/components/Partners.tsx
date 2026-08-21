'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

type PartnerData = {
  name: string;
  role: string;
  image: string;
  bgClass: string;
  imgClass?: string;
};

const organizers: PartnerData[] = [
  {
    name: 'IEEE Student Branch of NIBM',
    role: 'Organizer',
    image: '/images/nibmcodex-1.0/sponsor-ieeesb.png',
    bgClass: 'bg-white',
  },
  {
    name: 'National Institute of Business Management',
    role: 'Organizer',
    image: '/images/nibmcodex-1.0/sponsor-nibm1.png',
    bgClass: 'bg-white',
  },
  // {
  //   name: 'NIBM Computer Society',
  //   role: 'Organizer',
  //   image: '/images/nibmcodex-1.0/sponsor-nibmcs.png',
  //   bgClass: 'bg-white',
  // }
];

const nationalPartner: PartnerData = {
  name: 'Ministry of Digital Economy',
  role: 'Official National Partner',
  image: '/images/partners/mode-logo.png',
  bgClass: 'bg-white',
};

const partnersRow1: PartnerData[] = [
  {
    name: 'Lanka School on Internet Governance',
    role: 'Official Strategic Partner',
    image: '/images/partners/lksig-logo.jpg',
    bgClass: 'bg-white',
  },
  {
    name: 'NIBM Gavel Club',
    role: 'Official Community Partner',
    image: '/images/partners/gavelclub-logo-cropped.png',
    bgClass: 'bg-white p-2',
  },
  {
    name: 'AZEA Creation',
    role: 'Official Visual Content Partner',
    image: '/images/partners/azeacreation-logo.jpg',
    bgClass: 'bg-black border-[1.5px] border-white',
  },
  {
    name: 'EventFrame Productions',
    role: 'Event content production partner',
    image: '/images/partners/eventframe.jpg',
    bgClass: 'bg-[#842223]',
    imgClass: 'object-contain max-h-[75%] max-w-[75%]',
  },
];

const partnersRow2: PartnerData[] = [
  {
    name: 'HackSL',
    role: 'Official Digital Media Partner',
    image: '/images/partners/hacksl-logo.jpg',
    bgClass: 'bg-white',
  },
];

import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, PanInfo } from 'framer-motion';

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

function InteractiveMarquee({ items }: { items: PartnerData[] }) {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef<number>(-1);

  useAnimationFrame((t, delta) => {
    // ~3% of the container width per second
    const moveBy = directionFactor.current * 3 * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative w-full overflow-hidden py-4 -mx-6 px-6 md:-mx-12 md:px-12 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] cursor-grab active:cursor-grabbing">
      <motion.div
        className="flex w-max items-stretch gap-6 md:gap-8"
        style={{ x }}
        onPan={(e, info: PanInfo) => {
          // Adjust drag sensitivity
          baseX.set(baseX.get() + (info.delta.x * 0.03));
          
          if (info.velocity.x > 50) {
            directionFactor.current = 1;
          } else if (info.velocity.x < -50) {
            directionFactor.current = -1;
          }
        }}
      >
        {/* Repeat the items 4 times so 50% is 2 sets, matching the wrap(-50, 0) logic */}
        {[...items, ...items, ...items, ...items].map((partner, idx) => (
          <div
            key={`${partner.name}-${idx}`}
            className="glass-panel-light px-5 py-4 md:px-6 md:py-5 clip-slanted flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-[260px] md:w-[280px] shrink-0 pointer-events-none"
          >
            <div className="w-full flex flex-col items-center mb-4">
              <div className="h-8 md:h-10 flex items-center justify-center w-full px-2">
                <p className="text-[10px] md:text-xs text-cyan-400/80 font-mono uppercase tracking-wider text-center leading-snug">
                  {partner.role}
                </p>
              </div>
              <div className="w-16 h-px bg-cyan-500/40 mt-2" />
            </div>
            <div className={`relative w-full aspect-[4/3] mb-3 rounded-xl flex items-center justify-center overflow-hidden shadow-inner ${partner.bgClass}`}>
              <Image
                src={partner.image}
                alt={partner.name}
                width={240}
                height={180}
                draggable={false}
                className={`${partner.imgClass || 'object-contain max-h-[85%] max-w-[85%]'} select-none pointer-events-none`}
              />
            </div>
            <div className="flex flex-col w-full justify-center flex-grow">
              <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-0 leading-tight group-hover:text-cyan-300 transition-colors">
                {partner.name}
              </h3>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Partners() {
  const allPartners = [...partnersRow1, ...partnersRow2];

  return (
    <section id="partners" className="py-24 bg-navy-950 relative border-t border-white/5 z-20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header matching Committee.tsx */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Collaborators
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Organizers & <span className="text-gradient-cyan">Partners</span>
          </h2>
        </motion.div>

        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Organized By
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch mb-20">
          {organizers.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel-light px-5 py-4 md:px-6 md:py-5 clip-slanted flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-full max-w-[280px] sm:w-[260px] flex-1"
            >
              <div className={`relative w-full aspect-[4/3] mb-3 rounded-xl flex items-center justify-center overflow-hidden shadow-inner ${partner.bgClass}`}>
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={240}
                  height={180}
                  draggable={false}
                  className="object-contain max-h-[85%] max-w-[85%] select-none pointer-events-none"
                />
              </div>
              <div className="flex flex-col w-full justify-center flex-grow">
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-0 leading-tight group-hover:text-cyan-300 transition-colors">
                  {partner.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Official Partners
        </h3>
        
        {/* Interactive Marquee */}
        <InteractiveMarquee items={allPartners} />

      </div>
    </section>
  );
}
