'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { 
      q: 'What is NIBMCodeX 2.0?', 
      a: (
        <>
          NIBMCodeX 2.0 is a comprehensive tech initiative and event series organized by the IEEE Student Branch of NIBM. Rather than just a single hackathon, it is a multi-phase journey designed to build your skills from the ground up. The series features:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Awareness Sessions across NIBM branches</li>
            <li>AI for Learning Workshop</li>
            <li>Code Grid Summit</li>
            <li>The ultimate finale: competing in the global 24-hour IEEEXtreme 20.0 coding marathon.</li>
          </ul>
        </>
      )
    },
    { 
      q: 'What are the benefits of participating?', 
      a: 'Beyond the thrill of the challenge, participants gain hands-on problem-solving experience, boost their portfolios, and network with industry professionals through the Code Grid Summit and workshops. Top performers in the final marathon stand to win exclusive prizes, trophies, and event goodies.' 
    },
    { 
      q: 'Will certificates be provided?', 
      a: 'Yes. Attendees who actively participate in the series and complete the 24-hour marathon will receive a certificate of participation and exclusive swags.' 
    },
    { 
      q: 'Are food and accommodations provided?', 
      a: 'Yes! For the final 24-hour overnight IEEEXtreme 20.0 marathon, the NIBM Computing Society and our corporate sponsors will fully provide meals, snacks, refreshments, and dedicated resting zones to keep you energized.' 
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-32 bg-navy-950 border-t border-white/5 overflow-hidden overflow-x-clip relative max-w-full">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter">FAQ</h2>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
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
                className="w-full text-left p-5 sm:p-6 md:p-8 flex justify-between items-center text-white hover:text-cyan-400 transition-colors gap-3"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight">{faq.q}</span>
                <motion.span 
                  animate={{ rotate: open === idx ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-cyan-400 text-xl sm:text-2xl font-light shrink-0"
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
                    <div id={`faq-answer-${idx}`} className="px-5 sm:px-6 md:px-8 pb-6 sm:pb-8 text-slate-400 font-light leading-relaxed text-sm sm:text-base md:text-lg">
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