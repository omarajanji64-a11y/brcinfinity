
'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseProvider } from '@/firebase/client-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <FirebaseProvider>
        {children}
      </FirebaseProvider>
    </ThemeProvider>
  );
}
