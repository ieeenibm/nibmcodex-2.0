'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SpotlightCard from '@/components/ui/SpotlightCard';

const partnerGroups = [
  {
    label: 'Organized By',
    partners: [
      { name: 'IEEE Student Branch of NIBM', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-ieeesb' },
      { name: 'NIBM City University', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-nibm1' },
      { name: 'NIBM Computer Society', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-nibmcs' },
    ],
  },
  {
    label: 'National Partners',
    partners: [
      { name: 'ICTA', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-icta1' },
    ],
  },
  {
    label: 'Collaborative Partners',
    partners: [
      { name: 'Dialog', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-dialog1' },
      { name: 'PickMe', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-pickme1' },
      { name: 'Dilexus', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-dilexus1' },
      { name: 'Toursurv', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-toursurv1' },
      { name: 'NIBM Gavel Club', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-gavel1' },
      { name: 'Maliban Kiri', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-maliban1' },
      { name: 'Lemino Bliss', image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/sponsor-lemino1' },
    ],
  },
];

export default function Partners() {
  return (
    <section className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.03),transparent_50%)] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Partners
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Our <span className="text-gradient-cyan">Partners</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            Supporting innovation and excellence throughout NIBMCodeX 1.0.
          </p>
        </motion.div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {partnerGroups.map((group, gIdx) => (
            <motion.div
              key={gIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: gIdx * 0.1 }}
            >
              <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-8">
                {group.label}
              </h3>
              <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                {group.partners.map((partner, pIdx) => (
                  <motion.div
                    key={pIdx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gIdx * 0.1 + pIdx * 0.05 }}
                    className="w-[180px]"
                  >
                    <SpotlightCard className="bg-white/95 p-6 clip-slanted flex items-center justify-center h-24 group">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={partner.image}
                          alt={partner.name}
                          width={120}
                          height={60}
                          className="w-auto h-auto max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
