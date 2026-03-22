import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

import ThemeLoader from '@/components/ThemeLoader';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import ClientProviders from './client-providers';
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
          'font-body antialiased min-h-screen bg-background',
          cormorantGaramond.variable,
          manrope.variable
        )}
      >
        <LanguageProvider>
          <ClientProviders>
            <ThemeLoader />
            {children}
            <WhatsAppButton phoneNumber="905467898968" />
            <Toaster />
          </ClientProviders>
        </LanguageProvider>
      </body>
    </html>
  );
}
