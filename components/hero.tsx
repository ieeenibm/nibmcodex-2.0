'use client'

import { useEffect, useRef } from 'react'
import * as anime from 'animejs'

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      anime.animate(titleRef.current.querySelectorAll('span'), {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        delay: anime.stagger(80),
        easing: 'easeOutExpo',
      })
    }

    if (subtitleRef.current) {
      anime.animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 700,
        easing: 'easeOutExpo',
      })
    }

    if (ctaRef.current) {
      anime.animate(ctaRef.current.querySelectorAll('button'), {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: anime.stagger(120, { start: 1100 }),
        easing: 'easeOutExpo',
      })
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/themereferenceimage-fhWHuSvfGxUcpygQOI3yupTaL3VosT.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-dark-bg/50 to-dark-bg/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center py-20">
        <div ref={titleRef} className="mb-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-4">
            {'NIBM'.split('').map((char, i) => (
              <span key={i} className="inline-block">
                {char}
              </span>
            ))}
          </h1>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-cyan-300 tracking-tighter">
            {'CodeX 2.0'.split('').map((char, i) => (
              <span key={i} className="inline-block">
                {char}
              </span>
            ))}
          </h2>
        </div>

        <p ref={subtitleRef} className="text-lg md:text-xl text-gray-300 mb-16 font-light tracking-wide max-w-2xl mx-auto">
          A 48-hour innovation sprint where brilliant minds converge to build the next generation of tech solutions
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-dark-bg font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            Register Now
          </button>
          <button className="px-8 py-4 border-2 border-white/30 hover:border-cyan-300 text-white hover:text-cyan-300 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            Learn More
          </button>
        </div>

        <div className="mt-20 text-cyan-300/60 text-sm font-light">
          <p>October 22-23, 2026 • NIBM Campus</p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-3">
          <p className="text-cyan-300/60 text-xs uppercase tracking-widest">Scroll</p>
          <div className="w-px h-8 bg-gradient-to-b from-cyan-300 to-transparent animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
