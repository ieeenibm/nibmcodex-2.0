'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Timeline', href: '#timeline' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-mono font-bold text-white">
          NIBM<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">CodeX</span>
          <sup className="ml-0.5 text-xs md:text-sm text-cyan-300 font-mono">2.0</sup>
        </Link>
        
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy-900/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm uppercase tracking-wider text-slate-300 hover:text-cyan-300 transition-colors py-2 border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
