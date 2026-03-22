import type { Metadata } from 'next';
import { Playfair_Display, Raleway } from 'next/font/google';

import ThemeLoader from '@/components/ThemeLoader';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import ClientProviders from './client-providers';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-playfair-display',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-raleway',
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
      <body
        className={cn(
          'font-body antialiased min-h-screen bg-background',
          playfairDisplay.variable,
          raleway.variable
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
