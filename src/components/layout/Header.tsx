'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import Logo from '@/components/shared/Logo';
import DownloadCatalogButton from '@/components/shared/DownloadCatalogButton';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import LanguageSwitcher from '../shared/LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const navLinksLeft = [
    { href: '/', label: t('header.home') },
    { href: '/products', label: t('header.products') },
    { href: '/about-us', label: 'Hakkimizda' },
  ];
  const navLinksRight = [{ href: '/contact', label: t('header.contact') }];

  return (
    <header className="theme-panel sticky top-0 z-50 border-b border-white/10 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto grid h-40 grid-cols-2 items-center px-4 md:grid-cols-3">
        <nav className="hidden items-center gap-6 md:flex">
          {navLinksLeft.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-white transition-colors hover:text-white/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-1 flex items-center justify-start md:col-start-2 md:justify-center">
          <Logo />
        </div>

        <div className="hidden items-center justify-end gap-2 md:flex">
          {navLinksRight.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-white transition-colors hover:text-white/80"
            >
              {link.label}
            </Link>
          ))}
          <DownloadCatalogButton
            variant="outline"
            className="text-white transition-transform duration-300 hover:scale-105"
          />
          <LanguageSwitcher />
        </div>

        <div className="col-start-2 flex items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="p-4">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center justify-center">
                    <Logo />
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-6 text-lg">
                  {[...navLinksLeft, ...navLinksRight].map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="font-medium text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-4">
                  <DownloadCatalogButton
                    variant="outline"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
