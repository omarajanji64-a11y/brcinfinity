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
      ? 'Masko Mobilyacilar Sitesi 18/B Blok No:35, Istanbul'
      : language === 'fr'
        ? 'Showroom principal a Masko, Istanbul'
        : 'Main showroom at Masko, Istanbul';

  return (
    <footer className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="container mx-auto px-0">
        <div className="theme-panel classic-shell overflow-hidden rounded-[1.1rem] px-5 py-10 md:px-8 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr]">
            <div className="space-y-5">
              <Logo />
              <p className="max-w-sm text-sm leading-7 text-primary/66">{t('footer.tagline')}</p>
              <div className="inline-flex items-center gap-2 rounded-[0.55rem] border border-[rgba(193,148,79,0.24)] bg-[rgba(65,42,27,0.84)] px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-accent/82">
                <MapPin className="h-3.5 w-3.5" />
                {showroomCopy}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="https://www.instagram.com/brcinfinity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[0.55rem] border border-[rgba(193,148,79,0.22)] bg-[rgba(65,42,27,0.84)] text-primary/72 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <DownloadCatalogButton
                  variant="outline"
                  className="h-11 px-5 text-[0.72rem] tracking-[0.16em]"
                />
              </div>
            </div>

            <div>
              <h3 className="font-headline text-2xl font-semibold text-primary">{t('footer.quick_links')}</h3>
              <div className="classic-divider mt-3 max-w-[7rem]" />
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
                    Hakkimizda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-primary/66 transition-colors hover:text-primary">
                    {t('header.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-headline text-2xl font-semibold text-primary">{t('footer.categories')}</h3>
              <div className="classic-divider mt-3 max-w-[7rem]" />
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

            <div className="theme-panel classic-shell rounded-[0.95rem] p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent/82">{t('footer.contact_us')}</p>
              <div className="mt-5 space-y-4 text-sm text-primary/70">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                  <span>{showroomCopy}</span>
                </div>
                <div className="flex items-center gap-3">
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

          <div className="mt-10 flex flex-col gap-3 border-t border-[rgba(193,148,79,0.18)] pt-6 text-sm text-primary/56 md:flex-row md:items-center md:justify-between">
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
