'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const organizers = [
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
  }
];

const nationalPartner = {
  name: 'Ministry of Digital Economy',
  role: 'Official National Partner',
  image: '/images/partners/mode-logo.png',
  bgClass: 'bg-white',
};

const partnersRow1 = [
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
  },
];

const partnersRow2 = [
  {
    name: 'HackSL',
    role: 'Official Digital Media Partner',
    image: '/images/partners/hacksl-logo.jpg',
    bgClass: 'bg-white',
  },
];

export default function Partners() {
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
              className="glass-panel-light px-5 py-4 md:px-6 md:py-5 rounded-2xl flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-full max-w-[280px] sm:w-[260px] flex-1"
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

        {/* National Partner - Temporarily Hidden */}
        <div className="hidden">
          <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
            Official National Partner
          </h3>
          <div className="flex justify-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="glass-panel-light px-5 py-4 md:px-6 md:py-5 rounded-2xl flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-[200px] md:w-[280px]"
            >
              <div className={`relative w-full aspect-[16/9] md:aspect-[21/9] mb-3 rounded-xl flex items-center justify-center overflow-hidden shadow-inner ${nationalPartner.bgClass}`}>
                <Image
                  src={nationalPartner.image}
                  alt={nationalPartner.name}
                  width={400}
                  height={200}
                  draggable={false}
                  className="object-contain max-h-[80%] max-w-[80%] select-none pointer-events-none"
                />
              </div>
              <div className="flex flex-col w-full justify-center flex-grow">
                <h3 className="text-lg md:text-xl font-bold text-white mb-0 leading-tight group-hover:text-cyan-300 transition-colors">
                  {nationalPartner.name}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Partners */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Official Partners
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch">
          {partnersRow1.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel-light px-5 py-4 md:px-6 md:py-5 rounded-2xl flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-full max-w-[280px] sm:w-[260px] flex-1"
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
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch mt-6 md:mt-8">
          {partnersRow2.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel-light px-5 py-4 md:px-6 md:py-5 rounded-2xl flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-full max-w-[280px] sm:w-[260px]"
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
      </div>
    </section>
  );
}
