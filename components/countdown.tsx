'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2026-10-22T00:00:00').getTime()
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-5xl md:text-6xl font-bold text-cyan-300 font-mono tracking-wider">
        {String(value).padStart(2, '0')}
      </div>
      <p className="text-sm text-gray-400 uppercase tracking-widest mt-2">{label}</p>
    </div>
  )

  return (
    <div className="flex justify-center gap-3 md:gap-6 flex-wrap items-end">
      <CountdownBox value={timeLeft.days} label="Days" />
      <div className="text-4xl md:text-5xl text-cyan-300/50 font-light pb-2">:</div>
      <CountdownBox value={timeLeft.hours} label="Hours" />
      <div className="text-4xl md:text-5xl text-cyan-300/50 font-light pb-2">:</div>
      <CountdownBox value={timeLeft.minutes} label="Minutes" />
      <div className="text-4xl md:text-5xl text-cyan-300/50 font-light pb-2">:</div>
      <CountdownBox value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}
