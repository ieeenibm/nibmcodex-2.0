import type { Metadata } from 'next';
import { Space_Mono, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import PageTransition from '@/components/PageTransition';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import Preloader from '@/components/Preloader';
import ClickSpark from '@/components/ui/ClickSpark';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'NIBMCodeX 2.0 | The Ultimate Hackathon Experience',
    template: '%s | NIBMCodeX 2.0',
  },
  description: 'Join NIBMCodeX 2.0, the premier hackathon experience at NIBM. Showcase your skills, innovate, and compete with the best.',
  keywords: ['Hackathon', 'NIBM', 'NIBMCodeX', 'Coding Competition', 'Sri Lanka', 'Tech Event', 'Software Engineering', 'IT', 'Innovation'],
  authors: [{ name: 'NIBM' }],
  metadataBase: new URL('https://nibmcodex.nibmieee.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nibmcodex.nibmieee.org',
    title: 'NIBMCodeX 2.0 | The Ultimate Hackathon Experience',
    description: 'Join NIBMCodeX 2.0, the premier hackathon experience at NIBM. Showcase your skills, innovate, and compete with the best.',
    images: [
      {
        url: '/images/wide-cityscape.webp',
        width: 1200,
        height: 630,
        alt: 'NIBMCodeX 2.0 Hackathon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NIBMCodeX 2.0 | The Ultimate Hackathon Experience',
    description: 'Join NIBMCodeX 2.0, the premier hackathon experience at NIBM. Showcase your skills, innovate, and compete with the best.',
    images: ['/images/wide-cityscape.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="antialiased bg-navy-950 text-slate-100 font-sans" suppressHydrationWarning>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-GP5FN2R0VN"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GP5FN2R0VN');
          `}
        </Script>
        <Script id="disable-context-menu" strategy="afterInteractive">
          {`
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            });
          `}
        </Script>
        <Preloader />
        <NoiseOverlay />
        <ClickSpark />
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}