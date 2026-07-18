import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-950 pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-mono font-bold text-cyan-300 block mb-6">
              CodeX <span className="text-white">2.0</span>
            </Link>
            <p className="text-slate-400 text-sm">
              The ultimate 48-hour hackathon experience pushing the boundaries of innovation and technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#about" className="hover:text-cyan-300 transition-colors">About Event</Link></li>
              <li><Link href="#timeline" className="hover:text-cyan-300 transition-colors">Schedule</Link></li>
              <li><Link href="#committee" className="hover:text-cyan-300 transition-colors">Committee</Link></li>
              <li><Link href="#sponsors" className="hover:text-cyan-300 transition-colors">Sponsors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>contact@nibmcodex.com</li>
              <li>+94 77 123 4567</li>
              <li>NIBM, Colombo 07</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Socials</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-cyan-300 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2026 NIBM CodeX. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed for the Future.</p>
        </div>
      </div>
    </footer>
  );
}