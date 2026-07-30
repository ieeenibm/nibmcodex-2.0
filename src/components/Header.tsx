'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { useLenisScroll } from './SmoothScroll';

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useLenisScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  const isHome = pathname === '/';

  const navLinks = [
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'Timeline', href: isHome ? '#timeline' : '/#timeline' },
    { name: 'FAQ', href: isHome ? '#faq' : '/#faq' },
    { name: '1.0 Gallery', href: '/nibmcodex-1.0' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? 'bg-navy-950/70 backdrop-blur-xl border-white/5 py-4' : 'bg-transparent border-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-white">NIBM</span>
          <span className="text-cyan-400">CodeX</span>
          <span className="text-white ml-1 font-light opacity-80">2.0</span>
        </Link>
        
        <nav className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-cyan-300 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
            {isOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-navy-950/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm uppercase tracking-[0.2em] text-slate-300 hover:text-cyan-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}