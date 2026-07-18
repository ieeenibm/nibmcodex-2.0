'use client'

import { useEffect, useRef } from 'react'

export default function VerticalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const scrollPosition = window.scrollY
      const element = containerRef.current

      // Parallax effect
      element.style.backgroundPosition = `center ${scrollPosition * 0.5}px`
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-cover bg-fixed bg-center"
      style={{
        backgroundImage:
          'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%2012%2C%202026%20at%2004_07_26%20PM%201-hz0GyMLmoyJgRRQYMiI25vNeD6I39T.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/50 to-dark-bg"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h2 className="text-5xl md:text-6xl font-bold text-cyan-300 mb-4">Innovation</h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Scroll through the future of technology. Experience a transformative 48-hour hackathon where creativity meets code.
        </p>
        <div className="mt-8 text-cyan-300 text-sm font-mono tracking-wider">
          // Building tomorrow&apos;s solutions
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cyan-300 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
