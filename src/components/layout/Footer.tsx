'use client';

import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';

import Logo from '@/components/shared/Logo';
import DownloadCatalogButton from '@/components/shared/DownloadCatalogButton';
import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { t, language } = useTranslation();
  const showroomCopy =
    language === 'tr'
      ? 'Masko Mobilyacılar Sitesi 18/B Blok No:35, İstanbul'
      : language === 'fr'
        ? 'Showroom principal à Masko, Istanbul'
        : 'Main showroom at Masko, Istanbul';
  const aboutUsLabel =
    language === 'tr' ? 'Hakkımızda' : language === 'fr' ? 'À propos' : 'About Us';

  return (
    <footer className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-[1.4rem] px-5 py-10 md:rounded-[1.6rem] md:px-8 md:py-12">
          <div className="section-spotlight" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,175,104,0.5),transparent)]" />
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr]">
            <div className="space-y-5 text-center md:text-left">
              <Logo />
              <p className="mx-auto max-w-sm text-sm leading-7 text-primary/66 md:mx-0">{t('footer.tagline')}</p>
              <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-accent/84 md:justify-start">
                <MapPin className="h-3.5 w-3.5" />
                {showroomCopy}
              </div>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <Link
                  href="https://www.instagram.com/brcinfinity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-primary/72 transition-colors duration-300 hover:border-white/16 hover:text-primary"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <DownloadCatalogButton
                  variant="outline"
                  className="h-10 rounded-full px-4 text-[0.72rem]"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-headline text-2xl font-semibold text-primary">{t('footer.quick_links')}</h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('header.home')}
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('header.products')}
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {aboutUsLabel}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('header.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-headline text-2xl font-semibold text-primary">{t('footer.categories')}</h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/products" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('categories.living_room')}
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('categories.dining_room')}
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('categories.bedroom')}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-headline text-2xl font-semibold text-primary">{t('footer.contact_us')}</h3>
              <div className="mt-5 space-y-4 text-sm text-primary/70">
                <div className="flex items-start justify-center gap-3 md:justify-start">
                  <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                  <span>{showroomCopy}</span>
                </div>
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <Phone className="h-4 w-4 text-accent" />
                  <a
                    href="tel:+905467898968"
                    className="font-medium text-primary transition-colors hover:text-accent"
                  >
                    +90 546 789 89 68
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 text-center text-sm text-primary/56 md:flex-row md:items-center md:justify-between md:text-left">
            <p>&copy; {new Date().getFullYear()} BRC INFINITY. {t('footer.rights_reserved')}</p>
            <Link
              href="/admin"
              className="text-xs uppercase tracking-[0.35em] text-primary/56 transition-colors hover:text-primary"
            >
              Admin Mode
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
