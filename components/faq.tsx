'use client'

import { useState, useEffect, useRef } from 'react'
import * as anime from 'animejs'

const faqs = [
  {
    id: 1,
    question: 'When and where is CodeX 2.0 happening?',
    answer: 'October 22-23, 2026 at NIBM Campus, Colombo. Event starts at 9 AM on Day 1.',
  },
  {
    id: 2,
    question: 'What is the registration fee?',
    answer: 'Registration is completely FREE for all participants! We provide meals, swag, and prizes throughout the event.',
  },
  {
    id: 3,
    question: 'Can I form a team on the spot?',
    answer: 'Yes! While pre-formed teams are encouraged, you can find teammates during the team formation session on Day 1 morning.',
  },
  {
    id: 4,
    question: 'What technologies can I use?',
    answer: 'You can use any programming language or framework. The only requirement is that your project must be open-source compatible.',
  },
  {
    id: 5,
    question: 'Are there prizes?',
    answer: 'Yes! We have a ₹500K+ prize pool with awards across multiple categories including innovation, design, and social impact.',
  },
  {
    id: 6,
    question: 'Do I need prior experience?',
    answer: 'No! CodeX welcomes beginners and experts alike. We have workshops and mentoring throughout the event for all skill levels.',
  },
]

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
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
              translateY: [40, 0],
              duration: 800,
              delay: index * 100,
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
    <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-dark-surface/50 via-dark-bg to-dark-surface/30 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider">Questions</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-cyan-300">Questions</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about CodeX 2.0
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              className="opacity-0 group"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full text-left p-6 bg-white/5 border border-white/10 hover:border-cyan-300/50 hover:bg-white/10 transition-all backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-cyan-500/10 slanted-corners"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`flex-shrink-0 w-5 h-5 text-cyan-300 transform transition-transform ${
                      expandedId === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {expandedId === faq.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 p-8 bg-gradient-to-r from-white/5 to-white/5 border border-white/10 backdrop-blur-sm text-center slanted-corners">
          <p className="text-gray-400 mb-2">Still have questions?</p>
          <p className="text-sm text-gray-500 mb-6">Get in touch with our team directly</p>
          <a
            href="mailto:info@codex.nibm.edu"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-dark-bg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 slanted-corners"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
