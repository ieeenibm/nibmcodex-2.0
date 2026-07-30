'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What is the team composition for NIBMCodeX 1.0 / IEEEXtreme 19.0?',
    a: 'A team must have 1–3 IEEE Student or Graduate Student members, with a maximum of 2 Graduate Students. You can also join as a solo participant.',
  },
  {
    q: 'Do all team members need to be IEEE members?',
    a: 'Yes, all members must be IEEE Student or Graduate Student members and provide their IEEE Membership numbers during registration.',
  },
  {
    q: 'Is there an age requirement for participants?',
    a: 'Yes, all team members must be over 18 at the time of registration.',
  },
  {
    q: 'Do participants need to be affiliated with NIBM to compete?',
    a: 'No, affiliation is optional; teams can compete independently from any institution.',
  },
  {
    q: 'What resources does NIBMCodeX 1.0 provide during the hackathon?',
    a: 'NIBMCodeX 1.0 provides all the resources you need to compete including a safe environment, proctors, technical support, high-speed internet, power backup, and full round-the-clock support.',
  },
  {
    q: 'Do partial solutions receive credit?',
    a: 'Yes, submissions solving only some test cases receive partial credit proportional to the number of test cases solved.',
  },
  {
    q: 'Are there any browser or technical requirements?',
    a: 'Only specific supported browsers are allowed. Participants should test them 24 hours before the competition to avoid technical issues.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-1" className="py-32 bg-navy-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.03),transparent_50%)] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full glass-panel-light">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Frequently Asked <span className="text-gradient-cyan">Questions</span>
          </h2>
          <p className="text-slate-400 mt-4 font-light tracking-wide max-w-lg mx-auto">
            Everything you need to know about NIBMCodeX 1.0 and IEEEXtreme 19.0.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-panel-light clip-slanted overflow-hidden border border-white/5"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-6 text-left text-white font-medium tracking-tight hover:text-cyan-300 transition-colors group"
              >
                <span className="pr-8 text-sm md:text-base">{faq.q}</span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-400/40 transition-colors">
                  {openIndex === idx ? (
                    <Minus size={14} className="text-cyan-400" strokeWidth={2} />
                  ) : (
                    <Plus size={14} className="text-slate-400 group-hover:text-cyan-400 transition-colors" strokeWidth={2} />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-400 font-light text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
