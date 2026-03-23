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
  const { t, language } = useTranslation();
  const navLinksLeft = [
    { href: '/', label: t('header.home') },
    { href: '/products', label: t('header.products') },
    { href: '/about-us', label: 'Hakkımızda' },
  ];
  const navLinksRight = [{ href: '/contact', label: t('header.contact') }];
  const navLinkClass =
    'relative inline-flex h-10 items-center text-[0.74rem] uppercase tracking-[0.13em] text-primary/74 transition-all duration-300 hover:-translate-y-[1px] hover:text-primary after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-[linear-gradient(90deg,transparent,rgba(214,175,104,0.7),transparent)] after:transition-transform after:duration-300 hover:after:scale-x-100';

  return (
    <header className="sticky top-0 z-50 px-3 pt-2.5 md:px-4 md:pt-3">
      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-[1.35rem] px-3.5 py-2.5 md:rounded-full md:px-6 lg:px-7">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,175,104,0.55),transparent)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,175,104,0.16),rgba(214,175,104,0))] blur-2xl" />
          <div className="relative flex min-h-[72px] items-center justify-between gap-3 md:grid md:min-h-[100px] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-6 lg:gap-8">
            <nav className="hidden items-center justify-self-start gap-4 lg:gap-5 md:flex">
              {navLinksLeft.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex min-w-0 flex-1 items-center md:min-w-[220px] md:flex-none md:justify-center">
              <Logo priority />
            </div>

            <div className="hidden items-center justify-self-end gap-2.5 lg:gap-3 md:flex">
              {navLinksRight.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
              <DownloadCatalogButton
                variant="outline"
                className="h-9 rounded-full border-white/10 bg-white/[0.04] px-3.5 text-[0.68rem] shadow-none hover:border-white/14 hover:bg-white/[0.08]"
              />
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-1 py-0.5">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 md:hidden">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-1 py-0.5">
                <LanguageSwitcher />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] text-primary hover:bg-white/[0.08] hover:text-primary"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] border-l border-white/8 bg-[rgba(9,9,10,0.98)] text-primary sm:w-[380px]"
                >
                  <div className="flex h-full flex-col p-4">
                    <div className="mb-8 flex items-center justify-between gap-3">
                      <Logo priority />
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
                      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent/84">
                        {language === 'tr' ? 'Menü' : 'Navigation'}
                      </p>
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
                      <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-2">
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
