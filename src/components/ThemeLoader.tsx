
'use client';

import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';

type HSLColor = {
  h: number;
  s: number;
  l: number;
};

type ThemeConfig = {
  background: HSLColor;
  primary: HSLColor;
  accent: HSLColor;
};

const defaultTheme: ThemeConfig = {
  background: { h: 10, s: 10, l: 8 },
  primary: { h: 0, s: 0, l: 98 },
  accent: { h: 38, s: 82, l: 62 },
};

export default function ThemeLoader() {
  const firestore = useFirestore();

  const themeConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/theme');
  }, [firestore]);

  const { data: themeConfig } = useDoc<ThemeConfig>(themeConfigRef, { realtime: false });

  useEffect(() => {
    const theme = themeConfig || defaultTheme;
    const root = document.documentElement;

    root.style.setProperty('--background', `${theme.background.h} ${theme.background.s}% ${theme.background.l}%`);
    root.style.setProperty('--primary', `${theme.primary.h} ${theme.primary.s}% ${theme.primary.l}%`);
    root.style.setProperty('--accent', `${theme.accent.h} ${theme.accent.s}% ${theme.accent.l}%`);
    
    // You may need to adjust other colors based on the new theme.
    // For example, foreground colors should contrast with background colors.
    // This is a simplified example.
    const primaryForeground = theme.primary.l > 50 ? '10 10% 8%' : '0 0% 98%';
    root.style.setProperty('--primary-foreground', primaryForeground);
    
    const accentForeground = theme.accent.l > 50 ? '10 10% 8%' : '0 0% 98%';
    root.style.setProperty('--accent-foreground', accentForeground);


  }, [themeConfig]);

  return null; // This component doesn't render anything
}
