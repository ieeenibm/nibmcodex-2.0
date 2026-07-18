'use client'

import { useEffect, useRef } from 'react'
import * as anime from 'animejs'

const timelineSteps = [
  {
    step: 1,
    title: 'Registration Opens',
    description: 'Delegates start registering for the hackathon',
  },
  {
    step: 2,
    title: 'Team Formation',
    description: 'Teams are formed and participants finalize their ideas',
  },
  {
    step: 3,
    title: 'Hackathon Begins',
    description: '48-hour coding sprint kicks off with team pitches',
  },
  {
    step: 4,
    title: 'Continuous Hacking',
    description: 'Mentorship, networking, and non-stop building',
  },
  {
    step: 5,
    title: 'Presentations & Awards',
    description: 'Teams showcase projects and winners are announced',
  },
]

export default function Timeline() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target as HTMLDivElement
            const index = itemsRef.current.indexOf(item)
            anime.animate(item, {
              opacity: [0, 1],
              translateX: [-60, 0],
              duration: 900,
              delay: index * 150,
              easing: 'easeOutExpo',
            })
            observer.unobserve(item)
          }
        })
      },
      { threshold: 0.2 }
    )

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-dark-bg via-dark-surface/30 to-dark-bg overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-24">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider">Journey</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Event <span className="text-cyan-300">Timeline</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Follow the journey from registration to the grand finale
          </p>
        </div>

        {/* Timeline Steps with enhanced cards */}
        <div className="relative space-y-8">
          {/* Animated vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent"></div>

          {timelineSteps.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              className="opacity-0 flex gap-8 group"
            >
              {/* Step number */}
              <div className="flex flex-col items-center relative z-20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-dark-bg flex items-center justify-center font-bold text-lg group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                  {index + 1}
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 pt-2 pb-4">
                <div className="p-6 bg-white/5 border border-white/10 group-hover:border-cyan-300/50 group-hover:bg-white/10 transition-all duration-300 backdrop-blur-sm slanted-corners">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
