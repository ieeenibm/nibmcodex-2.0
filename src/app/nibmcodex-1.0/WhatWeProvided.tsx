'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { Wifi, Users, Lightbulb, Moon } from 'lucide-react';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';

const provides = [
  {
    icon: Wifi,
    title: 'Technical Environment',
    desc: 'High-speed internet, power backup, and tech support available throughout the event.',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/gain1',
  },
  {
    icon: Users,
    title: 'Networking & Community',
    desc: 'Meet fellow developers, share ideas, and collaborate on projects in a vibrant atmosphere.',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/gain2',
  },
  {
    icon: Lightbulb,
    title: 'Innovation & Learning',
    desc: 'Opportunities to brainstorm, learn, and implement cutting-edge solutions with mentors.',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/gain3',
  },
  {
    icon: Moon,
    title: '24-Hour Safe Stay',
    desc: 'Comfortable accommodations available round-the-clock for all participants.',
    image: 'https://res.cloudinary.com/jwuioa0d/image/upload/v1/nibmcodex/1.0/gain4',
  },
];

const gains = [
  {
    title: 'Sharpen Skills',
    desc: 'Tackle complex challenges and enhance your problem-solving abilities.',
  },
  {
    title: 'Global Experience',
    desc: 'Collaborate in an international competitive coding environment with IEEEXtreme.',
  },
  {
    title: 'Networking',
    desc: 'Connect with top developers and industry leaders worldwide.',
  },
  {
    title: 'Career Growth',
    desc: 'Boost your portfolio with a recognized global competition.',
  },
];

export default function WhatWeProvided() {
  return (
    <section className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.03),transparent_50%)] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* What We Provided */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            What We Provided
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            The <span className="text-gradient-cyan">Experience</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            NIBMCodeX 1.0 provided everything participants needed to compete, innovate, and excel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-32">
          {provides.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <SpotlightCard className="group h-full glass-panel-light clip-slanted overflow-hidden flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-full md:min-h-[160px] md:w-48 shrink-0 overflow-hidden">
                    <Image
                      src={getOptimizedCloudinaryUrl(item.image, { width: 500, crop: 'fill' })}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 to-transparent"></div>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-navy-950 border border-cyan-400/20 flex items-center justify-center group-hover:border-cyan-400/60 transition-colors flex-shrink-0">
                        <Icon size={18} className="text-cyan-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* What Participants Gained */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Beyond the Hackathon
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            What You <span className="text-gradient-cyan">Gained</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            Joining IEEEXtreme 19.0 was more than competing - an opportunity to grow, connect, and showcase talent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {gains.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <SpotlightCard className="group h-full glass-panel-light p-8 clip-slanted text-center">
                <div className="text-3xl mb-4 text-cyan-400 font-mono font-bold opacity-60">0{idx + 1}</div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
