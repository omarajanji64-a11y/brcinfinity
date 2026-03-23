'use client';

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

function LanguageFlag({ language }: { language: LanguageCode }) {
  if (language === 'tr') {
    return (
      <svg viewBox="0 0 24 16" className="h-4 w-5 rounded-[4px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" aria-hidden="true">
        <rect width="24" height="16" rx="2" fill="#E11D48" />
        <circle cx="10" cy="8" r="4.1" fill="#FFFFFF" />
        <circle cx="11.3" cy="8" r="3.3" fill="#E11D48" />
        <path d="M14.7 8l1.4.45-.87-1.18 1.33-.56-1.46-.08-.4-1.4-.39 1.4-1.46.08 1.33.56-.87 1.18L14.7 8Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (language === 'fr') {
    return (
      <svg viewBox="0 0 24 16" className="h-4 w-5 rounded-[4px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" aria-hidden="true">
        <rect width="8" height="16" rx="2" fill="#1D4ED8" />
        <rect x="8" width="8" height="16" fill="#F8FAFC" />
        <rect x="16" width="8" height="16" rx="2" fill="#DC2626" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" className="h-4 w-5 rounded-[4px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" aria-hidden="true">
      <rect width="24" height="16" rx="2" fill="#1D4ED8" />
      <path d="M0 1.5 9.2 7.4V16h2.6V7.4L21 1.5V0h-2.3L12 4.2 5.3 0H0v1.5Z" fill="#F8FAFC" />
      <path d="M24 1.5 14.8 7.4V16h-2.6V7.4L3 1.5V0h2.3L12 4.2 18.7 0H24v1.5Z" fill="#F8FAFC" />
      <path d="M10 0h4v16h-4z" fill="#F8FAFC" />
      <path d="M0 6h24v4H0z" fill="#F8FAFC" />
      <path d="M0 0h1.3L9.6 5.2H7.3L0 0Zm22.7 0H24v.9L16.5 5.2h-2.3L22.7 0ZM24 15.1V16h-1.3l-8.5-5.2h2.3L24 15.1ZM1.3 16H0v-.9l7.5-4.3h2.3L1.3 16Z" fill="#DC2626" />
      <path d="M10.8 0h2.4v16h-2.4z" fill="#DC2626" />
      <path d="M0 6.8h24v2.4H0z" fill="#DC2626" />
    </svg>
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
          className="h-9 rounded-full px-3 text-primary/82 transition-colors hover:bg-[rgba(255,245,221,0.06)] hover:text-primary"
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
            className={`cursor-pointer rounded-xl px-3 py-2 text-primary/82 focus:bg-white/[0.08] focus:text-primary ${
              language === option.value ? 'bg-white/[0.06] text-primary' : ''
            }`}
          >
            <LanguageFlag language={option.value} />
            <span className="min-w-[1.9rem] text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
              {option.label}
            </span>
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
