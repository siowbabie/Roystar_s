import type { Metadata } from 'next';
import { Cabin } from 'next/font/google';
import './globals.css';

const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cabin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Roystar — Premium Classical Musical Instruments',
  description:
    'Roystar is a premium destination for classical and acoustic musical instruments. Discover handcrafted guitars and pianos built for musicians who demand excellence.',
  keywords: ['classical guitar', 'grand piano', 'acoustic guitar', 'upright piano', 'premium instruments'],
  openGraph: {
    title: 'Roystar — Premium Classical Musical Instruments',
    description: 'Discover handcrafted guitars and pianos built for musicians who demand excellence.',
    type: 'website',
  },
};

import CartDrawer from '@/components/CartDrawer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cabin.variable}>
      <body className="font-cabin antialiased bg-white text-neutral-900">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
