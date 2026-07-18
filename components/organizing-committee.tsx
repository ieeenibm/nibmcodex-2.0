'use client'

import { useEffect, useRef } from 'react'
import * as anime from 'animejs'

const ocMembers = [
  {
    name: 'Alex Chen',
    role: 'Chief Organizer',
    initials: 'AC',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Sarah Johnson',
    role: 'Co-Organizer',
    initials: 'SJ',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Mike Rodriguez',
    role: 'Technical Lead',
    initials: 'MR',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Emma Wilson',
    role: 'Logistics Lead',
    initials: 'EW',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'James Park',
    role: 'Marketing Head',
    initials: 'JP',
    linkedin: 'https://linkedin.com',
  },
]

export default function OrganizingCommittee() {
  const membersRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const member = entry.target as HTMLDivElement
            const index = membersRef.current.indexOf(member)
            anime.animate(member, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              delay: index * 120,
              easing: 'easeOutExpo',
            })
            observer.unobserve(member)
          }
        })
      },
      { threshold: 0.2 }
    )

    membersRef.current.forEach((member) => {
      if (member) observer.observe(member)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-dark-surface/50 via-dark-bg to-dark-surface/30 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-24 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider">Leadership</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Meet the <span className="text-cyan-300">Team</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The brilliant minds driving CodeX 2.0 to success
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {ocMembers.map((member, index) => (
            <div
              key={index}
              ref={(el) => {
                membersRef.current[index] = el
              }}
              className="opacity-0 group cursor-default"
            >
              <div className="text-center p-6 bg-white/5 border border-white/10 hover:border-cyan-300/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm slanted-corners">
                {/* Avatar */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-cyan-600/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-600 flex items-center justify-center text-dark-bg font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                      {member.initials}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6 font-medium">{member.role}</p>

                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-cyan-300/40 hover:border-cyan-300 hover:bg-cyan-300/20 transition-all group/btn"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <svg
                    className="w-5 h-5 text-cyan-300 group-hover/btn:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
