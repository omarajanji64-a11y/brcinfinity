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

const LANGUAGE_OPTIONS = [
  { value: 'tr', label: 'TR', name: 'Turkce', flag: '\uD83C\uDDF9\uD83C\uDDF7' },
  { value: 'en', label: 'EN', name: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { value: 'fr', label: 'FR', name: 'Francais', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
] as const;

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const activeLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ?? LANGUAGE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 rounded-full px-3 text-primary/78 transition-colors hover:bg-[rgba(255,245,221,0.06)] hover:text-primary"
        >
          <span className="text-base leading-none">{activeLanguage.flag}</span>
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
            <span className="text-base leading-none">{option.flag}</span>
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
