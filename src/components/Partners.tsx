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
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-ieeesb',
    bgClass: 'bg-white',
  },
  {
    name: 'National Institute of Business Management',
    role: 'Organizer',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-nibm1',
    bgClass: 'bg-white',
  },
  {
    name: 'NIBM Computer Society',
    role: 'Organizer',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-nibmcs',
    bgClass: 'bg-white',
  }
];

const nationalPartner: PartnerData = {
  name: 'Ministry of Digital Economy',
  role: 'Official National Partner',
  image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/partners/mode-logo',
  bgClass: 'bg-white',
};

const partnersRow1: PartnerData[] = [
  {
    name: 'Lanka School on Internet Governance',
    role: 'Official Strategic Partner',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/partners/lksig-logo',
    bgClass: 'bg-white',
  },
  {
    name: 'NIBM Gavel Club',
    role: 'Official Community Partner',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/partners/gavelclub-logo-cropped',
    bgClass: 'bg-white p-2',
  },
  {
    name: 'AZEA Creation',
    role: 'Official Visual Content Partner',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/partners/azeacreation-logo',
    bgClass: 'bg-black border-[1.5px] border-white',
  },
  {
    name: 'EventFrame Productions',
    role: 'Event content production partner',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/partners/eventframe',
    bgClass: 'bg-[#842223]',
  },
];

const partnersRow2: PartnerData[] = [
  {
    name: 'HackSL',
    role: 'Official Digital Media Partner',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/2.0/partners/hacksl-logo',
    bgClass: 'bg-white',
  },
];

function PartnerCard({ partner, idx }: { partner: PartnerData, idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.1 }}
      className="glass-panel-light px-5 py-4 md:px-6 md:py-5 clip-slanted flex flex-col items-center justify-start text-center group hover:border-cyan-400/30 transition-colors w-full max-w-[280px] sm:w-[260px] flex-1"
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
          className={`${partner.imgClass || 'object-contain h-24 sm:h-28 w-auto max-w-[80%]'} select-none pointer-events-none`}
        />
      </div>
      <div className="flex flex-col w-full justify-center flex-grow">
        <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-0 leading-tight group-hover:text-cyan-300 transition-colors">
          {partner.name}
        </h3>
      </div>
    </motion.div>
  );
}

export default function Partners() {
  return (
    <section id="partners" className="py-24 bg-navy-950 relative border-t border-white/5 z-20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
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

        {/* Organizers */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Organized By
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch mb-24">
          {organizers.map((partner, idx) => (
            <PartnerCard key={partner.name} partner={partner} idx={idx} />
          ))}
        </div>

        {/* National Partner */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          National Partner
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch mb-24">
          <PartnerCard key={nationalPartner.name} partner={nationalPartner} idx={0} />
        </div>

        {/* Strategic & Community Partners */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Strategic & Community Partners
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto items-stretch mb-24">
          {partnersRow1.map((partner, idx) => (
            <PartnerCard key={partner.name} partner={partner} idx={idx} />
          ))}
        </div>

        {/* Media Partners */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Media Partners
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto items-stretch mb-10">
          {partnersRow2.map((partner, idx) => (
            <PartnerCard key={partner.name} partner={partner} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
