'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const organizers = [
  {
    name: 'National Institute of Business Management',
    role: 'Organizer',
    image: '/images/nibmcodex-1.0/sponsor-nibm1.png',
    bgClass: 'bg-white',
  },
  {
    name: 'NIBM Computing Society',
    role: 'Organizer',
    image: '/images/nibmcodex-1.0/sponsor-nibmcs.png',
    bgClass: 'bg-white',
  },
  {
    name: 'IEEE Student Branch',
    role: 'Organizer',
    image: '/images/nibmcodex-1.0/sponsor-ieeesb.png',
    bgClass: 'bg-white',
  }
];

const partners = [
  {
    name: 'Ministry of Digital Economy',
    role: 'Official National Partner',
    image: '/images/partners/mode-logo.png',
    bgClass: 'bg-white',
  },
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
    bgClass: 'bg-black',
  },
  {
    name: 'HackSL',
    role: 'Official Digital Media Partner',
    image: '/images/partners/hacksl-logo.jpg',
    bgClass: 'bg-white',
  },
];

export default function Partners() {
  return (
    <section className="py-24 bg-navy-950 relative border-t border-white/5 z-20">
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

        {/* Organized By */}
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
              className="glass-panel-light p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-cyan-400/30 transition-colors w-[160px] md:w-[220px]"
            >
              <div className={`relative w-full aspect-square mb-4 rounded-xl flex items-center justify-center overflow-hidden shadow-inner ${partner.bgClass}`}>
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={200}
                  height={200}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              <div className="flex flex-col flex-grow justify-start w-full h-full">
                <h3 className="text-sm md:text-base font-bold text-white mb-2 leading-tight group-hover:text-cyan-300 transition-colors">
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
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel-light p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-cyan-400/30 transition-colors w-[160px] md:w-[220px]"
            >
              <div className={`relative w-full aspect-square mb-4 rounded-xl flex items-center justify-center overflow-hidden shadow-inner ${partner.bgClass}`}>
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={200}
                  height={200}
                  className="object-contain max-h-[85%] max-w-[85%]"
                />
              </div>
              <div className="flex flex-col flex-grow justify-start w-full h-full">
                <h3 className="text-sm md:text-base font-bold text-white mb-2 leading-tight group-hover:text-cyan-300 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-[10px] md:text-xs text-cyan-400/80 font-mono uppercase tracking-wider mt-auto">
                  {partner.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
