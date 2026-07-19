'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';

export default function Committee() {
  const team = [
    { name: 'Alex Johnson', role: 'Chief Organizer', pos: 'center' },
    { name: 'Sarah Miller', role: 'Co-Organizer', pos: 'top-left' },
    { name: 'David Chen', role: 'Tech Lead', pos: 'top-right' },
    { name: 'Emily Davis', role: 'Marketing Head', pos: 'bottom-left' },
    { name: 'Michael Brown', role: 'Logistics Lead', pos: 'bottom-right' },
  ];

  return (
    <section id="committee" className="relative py-32 bg-navy-950 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/images/holodeck.png"
          alt="Holodeck Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full">
            Leadership
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">Organizing Committee</h2>
        </motion.div>

        {/* Tree Structure Desktop */}
        <div className="hidden lg:block relative max-w-5xl mx-auto h-[600px]">
          {/* SVG Branches */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="25%" y2="25%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="75%" y2="25%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="25%" y2="75%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="75%" y2="75%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
          </svg>

          {/* Center Card */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-72"
          >
            <TeamCard member={team[0]} primary />
          </motion.div>

          {/* Corner Cards */}
          <div className="absolute top-[8%] left-[10%] w-64"><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}><TeamCard member={team[1]} /></motion.div></div>
          <div className="absolute top-[8%] right-[10%] w-64"><motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}><TeamCard member={team[2]} /></motion.div></div>
          <div className="absolute bottom-[8%] left-[10%] w-64"><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}><TeamCard member={team[3]} /></motion.div></div>
          <div className="absolute bottom-[8%] right-[10%] w-64"><motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}><TeamCard member={team[4]} /></motion.div></div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {team.map((member, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <TeamCard member={member} primary={idx === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, primary = false }: { member: any, primary?: boolean }) {
  return (
    <SpotlightCard className={`glass-panel p-6 flex flex-col items-center text-center transition-colors group ${primary ? 'border-cyan-400/30' : ''}`} spotlightColor={primary ? "rgba(34, 211, 238, 0.2)" : "rgba(255, 255, 255, 0.1)"}>
      <div className={`w-24 h-24 rounded-full mb-5 flex items-center justify-center text-3xl font-bold bg-navy-950 border transition-all duration-500 group-hover:scale-105 ${primary ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/10 text-slate-300'}`}>
        {member.name.charAt(0)}
      </div>
      <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{member.name}</h3>
      <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6">{member.role}</p>
      <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm uppercase tracking-widest border-b border-transparent hover:border-cyan-400 pb-1">
        LinkedIn
      </a>
    </SpotlightCard>
  );
}