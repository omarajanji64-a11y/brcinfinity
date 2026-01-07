import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Playfair_Display, Raleway } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/lib/i18n';
import ThemeLoader from '@/components/ThemeLoader';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

const Providers = dynamic(() => import('./providers'), {
  ssr: false,
});

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
  description: 'Lüks, royal ve klasik mobilyalar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <Providers>
            <ThemeLoader />
            {children}
            <WhatsAppButton phoneNumber="905467898968" />
            <Toaster />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
