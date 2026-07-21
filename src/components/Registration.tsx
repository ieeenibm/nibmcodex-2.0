'use client';
import { motion } from 'framer-motion';
import Magnetic from './ui/Magnetic';

export default function Registration() {
  return (
    <section id="register" className="py-32 relative bg-navy-950 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.05),transparent_50%)] z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1 mb-6 border border-white/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] rounded-full">
              Registration
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">Join NIBMCodeX 2.0</h2>
            <p className="text-slate-400 text-lg font-light">Secure your spot. Limited slots available for the 24-hour sprint.</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-8 md:p-16 clip-slanted" 
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-navy-950/50 border border-white/10 p-4 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all duration-300 clip-slanted" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-navy-950/50 border border-white/10 p-4 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all duration-300 clip-slanted" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">Phone Number</label>
                <input type="tel" className="w-full bg-navy-950/50 border border-white/10 p-4 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all duration-300 clip-slanted" placeholder="+94 7X XXX XXXX" />
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">Institution</label>
                <input type="text" className="w-full bg-navy-950/50 border border-white/10 p-4 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all duration-300 clip-slanted" placeholder="University / Campus" />
              </div>
            </div>

            <div className="mb-12">
              <label className="block text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest">Team Name (Optional)</label>
              <input type="text" className="w-full bg-navy-950/50 border border-white/10 p-4 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all duration-300 clip-slanted" placeholder="Enter team name" />
            </div>

            <Magnetic>
              <button type="submit" className="w-full py-6 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold uppercase tracking-[0.2em] transition-colors clip-slanted text-lg active:scale-95">
                Submit Registration
              </button>
            </Magnetic>
          </motion.form>
        </div>
      </div>
    </section>
  );
}