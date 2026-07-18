import type { Metadata } from 'next';
import { Space_Mono, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'NIBM CodeX 2.0',
  description: 'The ultimate hackathon experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="antialiased bg-navy-900 text-slate-100 font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}