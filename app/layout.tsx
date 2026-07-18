import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Mono } from 'next/font/google'
import './globals.css'
import LenisScroll from '@/components/lenis-scroll'

const spaceMono = Space_Mono({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NIBM CodeX 2.0 - Hackathon',
  description: 'National Institute of Business Management Hackathon 2.0 - Innovation Unleashed',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e27' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-dark-bg">
      <body className="antialiased bg-dark-bg text-white">
        <LenisScroll>
          {children}
        </LenisScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
