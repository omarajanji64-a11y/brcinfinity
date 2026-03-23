import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import Providers from './providers';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant-garamond',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'BRC INFINITY',
  description: 'Luks, royal ve klasik mobilyalar.',
  icons: {
    icon: [{ url: '/favicon-rounded.png', type: 'image/png' }],
    shortcut: '/favicon-rounded.png',
    apple: '/favicon-rounded.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={cn(
          'relative min-h-screen overflow-x-hidden bg-background font-body antialiased',
          cormorantGaramond.variable,
          manrope.variable
        )}
      >
        <div aria-hidden="true" className="site-background" />
        <LanguageProvider>
          <Providers>
            {children}
            <WhatsAppButton phoneNumber="905467898968" />
            <Toaster />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
