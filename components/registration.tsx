'use client'

import { FormEvent, useState, useRef } from 'react'
import * as anime from 'animejs'

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    teamName: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formRef.current) {
      anime.animate(formRef.current, {
        opacity: [1, 0],
        duration: 400,
        easing: 'easeOutExpo',
      })
    }
    setTimeout(() => {
      setSubmitted(true)
    }, 400)
  }

  return (
    <section className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-dark-bg via-dark-surface/20 to-dark-bg overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wider">Registration</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Register <span className="text-cyan-300">Now</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            Secure your spot at NIBM CodeX 2.0. Limited slots available!
          </p>
        </div>

        {/* Form or Success Message */}
        {!submitted ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 p-8 bg-white/5 border border-white/10 backdrop-blur-sm slanted-corners"
          >
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-300/50 focus:bg-white/10 focus:outline-none transition-all slanted-corners"
                placeholder="Your name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-300/50 focus:bg-white/10 focus:outline-none transition-all slanted-corners"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-300/50 focus:bg-white/10 focus:outline-none transition-all slanted-corners"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Institution
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-300/50 focus:bg-white/10 focus:outline-none transition-all slanted-corners"
                placeholder="Your college/university"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Team Name
              </label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-300/50 focus:bg-white/10 focus:outline-none transition-all slanted-corners"
                placeholder="Your team name"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-dark-bg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 slanted-corners"
            >
              Register for CodeX 2.0
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-3xl font-bold text-white mb-3">Registration Successful!</h3>
            <p className="text-gray-400 mb-8">
              Thanks for registering! We&apos;ll send you more details soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({ name: '', email: '', phone: '', institution: '', teamName: '' })
              }}
              className="px-8 py-3 border border-cyan-300/50 text-cyan-300 hover:bg-cyan-300/10 rounded-lg transition-all"
            >
              Register Another Team
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
