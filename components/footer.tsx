'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-bg border-t border-white/10 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Content Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">NIBM CodeX 2.0</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Innovation Unleashed. A 48-hour hackathon where brilliant minds collaborate to build the future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-gray-400 hover:text-cyan-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-cyan-300 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#sponsors" className="text-gray-400 hover:text-cyan-300 transition-colors">
                  Sponsors
                </a>
              </li>
              <li>
                <a href="#register" className="text-gray-400 hover:text-cyan-300 transition-colors">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:info@codex.nibm.edu" className="hover:text-cyan-300 transition-colors">
                  info@codex.nibm.edu
                </a>
              </li>
              <li>
                <a href="tel:+94112345678" className="hover:text-cyan-300 transition-colors">
                  +94 11 234 5678
                </a>
              </li>
              <li>NIBM Campus, Colombo</li>
            </ul>
          </div>

          {/* Event Info */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Event</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <span className="text-cyan-300">Date:</span> Oct 22-23, 2026
              </li>
              <li>
                <span className="text-cyan-300">Time:</span> 9 AM onwards
              </li>
              <li>
                <span className="text-cyan-300">Entry:</span> FREE
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-500 text-sm">
              © {currentYear} NIBM CodeX 2.0. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
