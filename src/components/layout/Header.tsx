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
  const navLinkClass =
    'relative text-[0.78rem] uppercase tracking-[0.16em] text-primary/72 transition-colors duration-300 hover:text-primary';

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-4">
      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-full px-4 py-3 md:px-6">
          <div className="relative grid min-h-[72px] grid-cols-[auto_1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
            <nav className="hidden items-center gap-7 md:flex">
              {navLinksLeft.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-start md:justify-center">
              <Logo />
            </div>

            <div className="hidden items-center justify-end gap-3 md:flex">
              {navLinksRight.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
              <DownloadCatalogButton
                variant="outline"
                className="h-10 rounded-full px-4 text-[0.72rem]"
              />
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-1.5 py-1">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="flex items-center justify-end md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-white/8 bg-white/[0.03] text-primary hover:bg-white/[0.08] hover:text-primary"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] border-l border-white/8 bg-[rgba(9,9,10,0.98)] text-primary sm:w-[380px]"
                >
                  <div className="flex h-full flex-col p-4">
                    <div className="mb-8 flex items-center justify-between">
                      <Logo />
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full border border-white/8 bg-white/[0.03] text-primary hover:bg-white/[0.08] hover:text-primary"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    <div className="theme-panel rounded-[1.2rem] p-5">
                      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent/84">Navigation</p>
                      <nav className="mt-6 flex flex-col gap-5">
                        {[...navLinksLeft, ...navLinksRight].map((link) => (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className="font-headline text-2xl text-primary/88 transition-colors hover:text-primary"
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </nav>
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                      <DownloadCatalogButton
                        variant="outline"
                        className="h-11 rounded-full text-[0.72rem]"
                      />
                      <div className="rounded-full border border-white/8 bg-white/[0.03] p-2">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
