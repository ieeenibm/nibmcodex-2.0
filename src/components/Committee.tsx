'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import SpotlightCard from './ui/SpotlightCard';
import EasterEggGame from './EasterEggGame';

import committeeData from '@/data/committee.json';

interface Member {
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
  highlight?: boolean;
}

interface Team {
  name: string;
  members: Member[];
}

const leadership: Member[] = committeeData.leadership;
const execBoard: Member[] = committeeData.execBoard;
const teams: Team[] = committeeData.teams;

function MemberCard({ member, idx, onMemberClick }: { member: Member; idx: number; onMemberClick?: (name: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (idx % 5) * 0.05 }}
      className="h-full"
    >
      <SpotlightCard
        className={`h-full p-6 flex flex-col items-center text-center group ${
          member.highlight ? 'glass-panel border-cyan-400/30' : 'glass-panel'
        } ${onMemberClick ? 'cursor-pointer select-none' : ''}`}
        spotlightColor={
          member.highlight ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.08)'
        }
        onClick={() => onMemberClick?.(member.name)}
      >
        <div className="relative mb-5 mt-2 w-28 h-28 mx-auto">
          <div className="relative w-full h-full rounded-full flex items-center justify-center bg-navy-900 border-2 border-white/5 text-slate-500 overflow-hidden group-hover:border-cyan-400/40 group-hover:ring-4 group-hover:ring-cyan-400/10 transition-all duration-500">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="112px"
                draggable={false}
                className="object-cover transition-transform duration-500 group-hover:scale-110 select-none pointer-events-none"
              />
            ) : (
              <User size={36} strokeWidth={1.5} className="group-hover:text-cyan-400 transition-colors duration-300" />
            )}
          </div>
          
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-0 right-0 translate-x-1 translate-y-1 p-2 rounded-full bg-navy-950 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/50 transition-all duration-300 z-10 shadow-xl"
              aria-label={`LinkedIn of ${member.name}`}
            >
              <FaLinkedin size={16} />
            </a>
          )}
        </div>
        
        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
          {member.name}
        </h4>
        <p className={`text-[10px] font-mono uppercase tracking-widest ${member.highlight ? 'text-cyan-400' : 'text-slate-400'}`}>
          {member.role}
        </p>
      </SpotlightCard>
    </motion.div>
  );
}

export default function Committee() {
  const [activeTeam, setActiveTeam] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const clickCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMemberClick = (name: string) => {
    if (name === 'Supun Hewagamage') {
      clickCountRef.current += 1;
      if (clickCountRef.current === 5) {
        setShowEasterEgg(true);
        clickCountRef.current = 0; // reset
      }
    } else {
      clickCountRef.current = 0; // reset if clicking someone else
    }
  };

  const startAutoSwitch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveTeam((prev) => (prev + 1) % teams.length);
    }, 3000);
  }, []);

  useEffect(() => {
    startAutoSwitch();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [startAutoSwitch]);

  const handleManualClick = (idx: number) => {
    setActiveTeam(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      startAutoSwitch();
    }, 5000);
  };

  const handleHoverStart = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      startAutoSwitch();
    }, 1500);
  }, [startAutoSwitch]);

  return (
    <section id="committee" className="relative py-32 bg-navy-950 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/images/holodeck.webp"
          alt="Holodeck Background"
          fill
          sizes="100vw"
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
            <MemberCard key={member.role} member={member} idx={idx} onMemberClick={handleMemberClick} />
          ))}
        </div>

        {/* Executive Committee */}
        <h3 className="text-center text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-10">
          Executive Committee
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto mb-20">
          {execBoard.map((member, idx) => (
            <MemberCard key={member.role} member={member} idx={idx} onMemberClick={handleMemberClick} />
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
                onClick={() => handleManualClick(idx)}
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
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {teams[activeTeam].members.map((member, idx) => (
                  <MemberCard key={idx} member={member} idx={idx} onMemberClick={handleMemberClick} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showEasterEgg && (
          <EasterEggGame onClose={() => setShowEasterEgg(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
