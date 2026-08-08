'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const partners = [
  {
    name: 'Ministry of Digital Economy',
    role: 'Official National Partner',
    image: '/images/partners/mode-logo.png',
  },
  {
    name: 'Lanka School on Internet Governance',
    role: 'Official Strategic Partner',
    image: '/images/partners/lksig-logo.jpg',
  },
  {
    name: 'NIBM Gavel Club',
    role: 'Official Community Partner',
    image: '/images/partners/gavelclub-logo.png',
  },
  {
    name: 'AZEA Creation',
    role: 'Official Visual Content Partner',
    image: '/images/partners/azeacreation-logo.jpg',
  },
  {
    name: 'HackSL',
    role: 'Official Digital Media Partner',
    image: '/images/partners/hacksl-logo.jpg',
  },
];

export default function Partners() {
  return (
    <section className="py-24 bg-navy-950 relative border-t border-white/5 z-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron tracking-wider">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PARTNERS</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-500/50 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto items-stretch">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel-light p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-cyan-400/30 transition-colors"
            >
              <div className="relative w-full aspect-square mb-4 bg-white/5 rounded-xl p-4 flex items-center justify-center group-hover:bg-white/10 transition-colors overflow-hidden">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={200}
                  height={200}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              <div className="flex flex-col flex-grow justify-between w-full h-full">
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
