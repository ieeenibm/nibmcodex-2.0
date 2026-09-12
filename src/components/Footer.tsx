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
    <footer className="bg-[#02040a] pt-24 pb-12 border-t border-white/5 relative overflow-hidden overflow-x-clip max-w-full">
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
              <li><a href="https://nibmcodex.nibmieee.org" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">NIBMCodeX 1.0</a></li>
              <li><a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors inline-block relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-cyan-400 after:transition-all">IEEE Membership</a></li>
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
                </ul>
              </div>

              <div>
                <h4 className="text-white font-mono font-bold mb-8 uppercase tracking-[0.2em] text-xs">Phone</h4>
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
            <div className="flex flex-col space-y-4 text-sm font-light">
              <a href="https://www.linkedin.com/company/nibmcodex/" target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-2.5 text-slate-400 hover:text-[#0A66C2] transition-colors group">
                <svg className="w-5 h-5 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <a href="https://www.instagram.com/nibmcodex/" target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-2.5 text-slate-400 hover:text-[#E4405F] transition-colors group">
                <svg className="w-5 h-5 text-[#E4405F]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
                Instagram
              </a>
              <a href="https://www.facebook.com/nibmcodex/" target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-2.5 text-slate-400 hover:text-[#1877F2] transition-colors group">
                <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a href="https://youtube.com/@nibmcodex?si=oOtbvm4svXujQftw" target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-2.5 text-slate-400 hover:text-[#FF0000] transition-colors group">
                <svg className="w-5 h-5 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
              <a href="https://www.tiktok.com/@nibmcodex?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                TikTok
              </a>
              <a href="https://whatsapp.com/channel/0029Vb5p4Uw6buMQ9aWCIp1i" target="_blank" rel="noopener noreferrer" className="self-start flex items-center gap-2.5 text-slate-400 hover:text-[#25D366] transition-colors group">
                <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-0 text-xs text-slate-600 font-light tracking-wide">
          <p className="text-center md:text-left">&copy; 2026 NIBMCodeX. All rights reserved.</p>
          <p className="text-center text-[11px] text-slate-600 tracking-wider">
            Built by{' '}
            <a
              href="https://github.com/supunhg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 transition-colors underline-offset-4 hover:underline"
            >
              Supun Hewagamage
            </a>
          </p>
          <p className="text-center md:text-right uppercase tracking-widest text-slate-500">Designed for the Future.</p>
        </div>
      </div>
    </footer>
  );
}