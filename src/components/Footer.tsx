import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#02040a] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="text-3xl font-bold tracking-tighter block mb-6">
              <span className="text-white">NIBM</span>
              <span className="text-cyan-400">CodeX</span>
              <span className="text-white ml-1 font-light opacity-80">2.0</span>
            </Link>
            <p className="text-slate-500 text-sm font-light leading-relaxed pr-4">
              The ultimate 24-hour hackathon experience pushing the boundaries of innovation and technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-light">
              <li><Link href="#about" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">About Event</Link></li>
              <li><Link href="#timeline" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Schedule</Link></li>
              <li><Link href="#faq" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-light">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                <a href="mailto:nibmcodex@gmail.com">nibmcodex@gmail.com</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                &lt;&lt;contact number still not decided&gt;&gt;
              </li>
              <li className="leading-relaxed">
                NIBM World Wide,<br />
                Vidya Mawatha,<br />
                Colombo 07
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Socials</h4>
            <div className="flex flex-col space-y-4 text-sm text-slate-400 font-light">
              <a href="#" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">LinkedIn</a>
              <a href="#" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Instagram</a>
              <a href="#" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Facebook</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-light tracking-wide">
          <p>&copy; 2026 NIBMCodeX. All rights reserved.</p>
          <p className="mt-4 md:mt-0 uppercase tracking-widest text-slate-500">Designed for the Future.</p>
        </div>
      </div>
    </footer>
  );
}