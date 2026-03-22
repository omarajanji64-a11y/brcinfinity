'use client';

import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-[0.45rem] text-primary/78 transition-colors hover:bg-[rgba(255,245,221,0.06)] hover:text-primary"
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[9rem] rounded-[0.8rem] border border-[rgba(193,148,79,0.22)] bg-[rgba(35,22,14,0.98)] text-primary"
      >
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          disabled={language === 'en'}
          className="cursor-pointer rounded-xl text-primary/82 focus:bg-white/[0.08] focus:text-primary"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('fr')}
          disabled={language === 'fr'}
          className="cursor-pointer rounded-xl text-primary/82 focus:bg-white/[0.08] focus:text-primary"
        >
          Francais
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('tr')}
          disabled={language === 'tr'}
          className="cursor-pointer rounded-xl text-primary/82 focus:bg-white/[0.08] focus:text-primary"
        >
          Turkce
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
