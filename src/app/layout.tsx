import type { Metadata } from 'next';
import { Space_Mono, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import Preloader from '@/components/Preloader';
import ClickSpark from '@/components/ui/ClickSpark';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'NIBMCodeX 2.0',
  description: 'The ultimate hackathon experience',
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
        <Preloader />
        <NoiseOverlay />
        <ClickSpark />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}