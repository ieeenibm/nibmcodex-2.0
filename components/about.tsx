'use client'

import { useEffect, useRef } from 'react'
import * as anime from 'animejs'

export default function About() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLDivElement
            const index = cardsRef.current.indexOf(card)
            anime.animate(card, {
              opacity: [0, 1],
              translateY: [60, 0],
              duration: 900,
              delay: index * 120,
              easing: 'easeOutExpo',
            })
            observer.unobserve(card)
          }
        })
      },
      { threshold: 0.15 }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: '48 Hours', value: 'Non-stop coding sprint' },
    { label: '500+ Developers', value: 'From across the nation' },
    { label: '₹500K+ Prizes', value: 'Compete for major rewards' },
    { label: 'Expert Mentors', value: 'Industry leaders guiding you' },
  ]

  return (
    <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-dark-surface/50 via-dark-bg to-dark-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-24">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider">Why Participate</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            About <span className="text-cyan-300">CodeX 2.0</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            NIBM CodeX 2.0 is a 48-hour hackathon where innovation meets opportunity. Following the phenomenal success of CodeX 1.0, we're bringing together brilliant minds to collaborate, create, and compete on real-world challenges.
          </p>
        </div>

        {/* Stats Grid with enhanced styling and uniform sizing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="opacity-0 group relative h-full"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl slanted-corners"></div>
              
              {/* Card content with slanted corners */}
              <div className="relative p-8 h-full flex flex-col justify-between bg-white/5 border border-white/10 hover:border-cyan-300/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm slanted-corners">
                <div>
                  <div className="mb-4 inline-block p-3 bg-cyan-500/20 slanted-corners">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-300 to-cyan-500"></div>
                  </div>
                  <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-3">
                    {stat.label}
                  </p>
                </div>
                <p className="text-gray-300 text-lg group-hover:text-white transition-colors font-medium">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
