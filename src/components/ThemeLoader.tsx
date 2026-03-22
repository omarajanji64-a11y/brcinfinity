
'use client';

import { useEffect } from 'react';
import { DEFAULT_THEME } from '@/lib/site-config';

export default function ThemeLoader() {
  useEffect(() => {
    const theme = DEFAULT_THEME;
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
  }, []);

  return null; // This component doesn't render anything
}
