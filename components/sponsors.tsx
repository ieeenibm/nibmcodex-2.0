'use client'

import { useEffect, useRef } from 'react'
import * as anime from 'animejs'

const sponsors = [
  { name: 'TechVision', tier: 'Platinum' },
  { name: 'CloudDynamics', tier: 'Gold' },
  { name: 'QuantumAI', tier: 'Gold' },
  { name: 'DataForce', tier: 'Silver' },
  { name: 'SecureNet', tier: 'Silver' },
  { name: 'DevTools Pro', tier: 'Bronze' },
]

export default function Sponsors() {
  const sponsorsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sponsor = entry.target as HTMLDivElement
            const index = sponsorsRef.current.indexOf(sponsor)
            anime.animate(sponsor, {
              opacity: [0, 1],
              scale: [0.9, 1],
              duration: 800,
              delay: index * 100,
              easing: 'easeOutExpo',
            })
            observer.unobserve(sponsor)
          }
        })
      },
      { threshold: 0.2 }
    )

    sponsorsRef.current.forEach((sponsor) => {
      if (sponsor) observer.observe(sponsor)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-dark-bg via-dark-surface/40 to-dark-bg overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-24 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider">Partners</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-cyan-300">Sponsors</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Powered by incredible organizations that believe in innovation
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              ref={(el) => {
                sponsorsRef.current[index] = el
              }}
              className="opacity-0 group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative p-8 bg-white/5 border border-white/10 group-hover:border-cyan-300/50 group-hover:bg-white/10 transition-all duration-300 backdrop-blur-sm slanted-corners">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sponsor.name}
                    </h3>
                    <div className="mt-2 inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                      <p className="text-xs text-cyan-300 font-semibold">{sponsor.tier}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-300/20 to-cyan-600/20 flex items-center justify-center group-hover:from-cyan-300/40 group-hover:to-cyan-600/40 transition-all">
                      <div className="w-7 h-7 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-gradient-to-r from-white/5 to-white/5 border border-white/10 backdrop-blur-sm slanted-corners">
          <p className="text-gray-400 mb-2">Interested in partnership opportunities?</p>
          <p className="text-sm text-gray-500 mb-6">Join us in shaping the future of innovation</p>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-dark-bg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 slanted-corners">
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  )
}
