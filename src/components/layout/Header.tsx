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
    'relative text-[0.74rem] font-medium uppercase tracking-[0.28em] text-primary/78 transition-colors duration-300 hover:text-primary';

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-4">
      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-[1.85rem] border border-white/10 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,176,102,0.12),transparent_42%)]" />
          <div className="relative grid min-h-[92px] grid-cols-[auto_1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
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
                className="h-11 rounded-full border-white/14 bg-white/[0.04] px-5 text-[0.72rem] uppercase tracking-[0.26em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09]"
              />
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="flex items-center justify-end md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-white/10 bg-white/[0.05] text-primary hover:bg-white/[0.1] hover:text-primary"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] border-l border-white/10 bg-[#120d09]/95 text-primary backdrop-blur-2xl sm:w-[380px]"
                >
                  <div className="flex h-full flex-col p-4">
                    <div className="mb-8 flex items-center justify-between">
                      <Logo />
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full border border-white/10 bg-white/[0.05] text-primary hover:bg-white/[0.1] hover:text-primary"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-[0.7rem] uppercase tracking-[0.32em] text-accent/80">Navigation</p>
                      <nav className="mt-6 flex flex-col gap-5">
                        {[...navLinksLeft, ...navLinksRight].map((link) => (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className="font-headline text-2xl text-primary/90 transition-colors hover:text-primary"
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
                        className="h-12 rounded-full border-white/14 bg-white/[0.04] text-[0.72rem] uppercase tracking-[0.26em] text-primary hover:bg-white/[0.09]"
                      />
                      <div className="rounded-full border border-white/10 bg-white/[0.04] p-2">
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
