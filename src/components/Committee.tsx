'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';

interface Member {
  role: string;
  highlight?: boolean;
}

interface Team {
  name: string;
  members: Member[];
}

function buildTeam(): Member[] {
  return [
    { role: 'Lead', highlight: true },
    { role: 'Co-Lead', highlight: true },
    ...Array.from({ length: 8 }, () => ({ role: 'Member' }) as Member),
  ];
}

const leadership: Member[] = [
  { role: 'Counselor' },
  { role: 'Ambassador' },
];

const execBoard: Member[] = [
  { role: 'Chairperson' },
  { role: 'Vice Chair' },
  { role: 'Secretary' },
  { role: 'Treasurer' },
  { role: 'Webmaster' },
];

const teams: Team[] = [
  { name: 'Program & Proctor Team', members: buildTeam() },
  { name: 'Delegates Handling & Guest Relations Team', members: buildTeam() },
  { name: 'Finance & Logistics Team', members: buildTeam() },
  { name: 'Digital Systems & Marketing Team', members: buildTeam() },
];

function MemberCard({ member, idx }: { member: Member; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (idx % 5) * 0.05 }}
    >
      <SpotlightCard
        className={`p-6 flex flex-col items-center text-center group ${
          member.highlight ? 'glass-panel border-cyan-400/30' : 'glass-panel'
        }`}
        spotlightColor={
          member.highlight ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.08)'
        }
      >
        <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center bg-navy-950 border border-white/10 text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-400/40 transition-colors duration-300">
          <User size={32} strokeWidth={1.5} />
        </div>
        <p className={`text-xs font-mono uppercase tracking-widest ${member.highlight ? 'text-cyan-400' : 'text-slate-400'}`}>
          {member.role}
        </p>
      </SpotlightCard>
    </motion.div>
  );
}

export default function Committee() {
  const [activeTeam, setActiveTeam] = useState(0);

  return (
    <section id="committee" className="relative py-32 bg-navy-950 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/images/holodeck.webp"
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
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Leadership
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Organizing <span className="text-gradient-cyan">Committee</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            The team driving NIBMCodeX 2.0 from vision to reality.
          </p>
        </motion.div>

        {/* Leadership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
          {leadership.map((member, idx) => (
            <MemberCard key={member.role} member={member} idx={idx} />
          ))}
        </div>

        {/* Executive Committee */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Executive Committee
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto mb-20">
          {execBoard.map((member, idx) => (
            <MemberCard key={member.role} member={member} idx={idx} />
          ))}
        </div>

        {/* OC Teams */}
        <div>
          <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
            OC Teams
          </h3>

          {/* Team Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {teams.map((team, idx) => (
              <button
                key={team.name}
                onClick={() => setActiveTeam(idx)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider clip-slanted transition-all duration-300 ${
                  activeTeam === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-300'
                }`}
              >
                {team.name}
                <span className="ml-1.5 opacity-50">({team.members.length})</span>
              </button>
            ))}
          </div>

          {/* Active Team Members Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {teams[activeTeam].members.map((member, idx) => (
                  <MemberCard key={idx} member={member} idx={idx} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
