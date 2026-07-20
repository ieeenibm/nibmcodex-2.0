'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: 'Who can participate?', a: 'Any university student with a passion for coding can join.' },
    { q: 'Is there a registration fee?', a: 'No, registration is completely free.' },
    { q: 'What is the team size?', a: 'Teams can have 3-5 members.' },
    { q: 'Will meals be provided?', a: 'Yes, food and beverages will be provided during the 24-hour hackathon.' },
  ];

  return (
    <section id="faq" className="py-32 bg-navy-950 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full">
            Questions
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">FAQ</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel-light clip-slanted overflow-hidden"
            >
              <button 
                className="w-full text-left p-6 md:p-8 flex justify-between items-center text-white hover:text-cyan-400 transition-colors"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-lg md:text-xl font-bold tracking-tight">{faq.q}</span>
                <motion.span 
                  animate={{ rotate: open === idx ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-cyan-400 text-2xl font-light"
                >
                  ↓
                </motion.span>
              </button>
              <AnimatePresence>
                {open === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <div className="px-6 md:px-8 pb-8 text-slate-400 font-light leading-relaxed text-lg">
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