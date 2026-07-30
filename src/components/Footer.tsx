'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenisScroll } from './SmoothScroll';

export default function Footer() {
  const pathname = usePathname();
  const { scrollTo } = useLenisScroll();
  const isHome = pathname === '/';

  const handleHashClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollTo(href, { offset: -80, duration: 1.2 });
    }
  };

  return (
    <footer className="bg-[#02040a] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-12 lg:gap-16 mb-20">
          <div className="md:col-span-2 lg:pr-8">
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
              <li><Link href={isHome ? '#about' : '/#about'} onClick={(e) => handleHashClick(e, isHome ? '#about' : '/#about')} className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">About Event</Link></li>
              <li><Link href={isHome ? '#timeline' : '/#timeline'} onClick={(e) => handleHashClick(e, isHome ? '#timeline' : '/#timeline')} className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Schedule</Link></li>
              <li><Link href={isHome ? '#faq' : '/#faq'} onClick={(e) => handleHashClick(e, isHome ? '#faq' : '/#faq')} className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">FAQ</Link></li>
              <li><Link href="/nibmcodex-1.0" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Previous Edition</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-slate-400 font-light">
              <div>
                <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Email</h4>
                <ul className="space-y-4">
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                    <a href="mailto:Ieee.sb@nibm.lk">ieee.sb@nibm.lk</a>
                  </li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                    <a href="mailto:sankhajay.work@gmail.com">pradeeshakantha@gmail.com</a>
                  </li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                    <a href="mailto:nibmcodex@gmail.com">chandisarandeni@gmail.com</a>
                  </li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                    <a href="mailto:nibmcodex@gmail.com">nibmcodex@gmail.com</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Phone</h4>
                <div className="hover:text-cyan-400 transition-colors cursor-pointer w-max mb-4">
                  <a href="tel:+94778872879">+94 77 887 2879</a>
                </div>
                <div className="hover:text-cyan-400 transition-colors cursor-pointer w-max">
                  <a href="tel:+94778872879">+94 77 887 2879</a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Address</h4>
                <address className="leading-relaxed not-italic">
                  NIBM World Wide,<br />
                  Vidya Mawatha,<br />
                  Colombo 07
                </address>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Socials</h4>
            <div className="flex flex-col space-y-4 text-sm text-slate-400 font-light">
              <a href="https://www.linkedin.com/company/nibmcodex/" target="_blank" rel="noopener noreferrer" className="self-start hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">LinkedIn</a>
              <a href="https://www.instagram.com/nibmcodex/" target="_blank" rel="noopener noreferrer" className="self-start hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Instagram</a>
              <a href="https://www.facebook.com/nibmcodex/" target="_blank" rel="noopener noreferrer" className="self-start hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">Facebook</a>
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