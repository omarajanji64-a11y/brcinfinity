'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n';

type LanguageCode = 'tr' | 'en' | 'fr';

const LANGUAGE_OPTIONS = [
  { value: 'tr', label: 'TR', name: 'Türkçe' },
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'fr', label: 'FR', name: 'Français' },
] as const;

function FlagFrame({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex h-[18px] w-[28px] shrink-0 overflow-hidden rounded-[0.45rem] border border-white/14 bg-black/20 shadow-[0_8px_18px_rgba(0,0,0,0.24)] ring-1 ring-black/10 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]">
      {children}
    </span>
  );
}

function LanguageFlag({ language }: { language: LanguageCode }) {
  if (language === 'tr') {
    return (
      <FlagFrame>
        <svg viewBox="0 0 28 18" className="h-full w-full" aria-hidden="true">
          <rect width="28" height="18" fill="#D31245" />
          <circle cx="11.2" cy="9" r="4.35" fill="#FFFFFF" />
          <circle cx="12.55" cy="9" r="3.45" fill="#D31245" />
          <path d="m16.95 9 1.48.48-.92-1.24 1.41-.62-1.55-.08-.42-1.47-.42 1.47-1.55.08 1.41.62-.92 1.24 1.48-.48Z" fill="#FFFFFF" />
        </svg>
      </FlagFrame>
    );
  }

  if (language === 'fr') {
    return (
      <FlagFrame>
        <svg viewBox="0 0 28 18" className="h-full w-full" aria-hidden="true">
          <rect width="9.34" height="18" fill="#1C4ED8" />
          <rect x="9.33" width="9.34" height="18" fill="#F8FAFC" />
          <rect x="18.66" width="9.34" height="18" fill="#D5232C" />
        </svg>
      </FlagFrame>
    );
  }

  return (
    <FlagFrame>
      <svg viewBox="0 0 28 18" className="h-full w-full" aria-hidden="true">
        <rect width="28" height="18" fill="#1846B7" />
        <path d="M0 0h3.05l8.17 5.3V0h5.56v5.3L24.95 0H28v2.05l-7.99 5.07H28v3.76h-7.99L28 15.95V18h-3.05l-8.17-5.3V18h-5.56v-5.3L3.05 18H0v-2.05l7.99-5.07H0V7.12h7.99L0 2.05V0Z" fill="#FFFFFF" />
        <path d="M0 0h1.58l9.64 6.16h-2.3L0 0Zm26.42 0H28v.92l-9.01 5.24h-2.3L26.42 0ZM28 17.08V18h-1.58l-9.73-6.16h2.3L28 17.08ZM1.58 18H0v-.92l9.01-5.24h2.3L1.58 18Z" fill="#D92332" />
        <path d="M11.78 0h4.44v18h-4.44z" fill="#FFFFFF" />
        <path d="M0 6.78h28v4.44H0z" fill="#FFFFFF" />
        <path d="M12.67 0h2.66v18h-2.66z" fill="#D92332" />
        <path d="M0 7.67h28v2.66H0z" fill="#D92332" />
      </svg>
    </FlagFrame>
  );
}

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const activeLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ?? LANGUAGE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 rounded-full gap-2.5 px-2.5 pr-2.5 text-primary/82 transition-colors hover:bg-[rgba(255,245,221,0.06)] hover:text-primary"
        >
          <LanguageFlag language={activeLanguage.value} />
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
            {activeLanguage.label}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[11rem] rounded-[0.8rem] border border-[rgba(193,148,79,0.22)] bg-[rgba(35,22,14,0.98)] p-1.5 text-primary"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLanguage(option.value)}
            className={`cursor-pointer rounded-xl px-3 py-2.5 text-primary/82 focus:bg-white/[0.08] focus:text-primary ${
              language === option.value ? 'bg-white/[0.06] text-primary' : ''
            }`}
          >
            <LanguageFlag language={option.value} />
            <span className="min-w-[1.9rem] text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary/72">
              {option.label}
            </span>
            <span className="text-[0.92rem]">{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
