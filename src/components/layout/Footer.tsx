
'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-secondary/50 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">{t('footer.tagline')}</p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://www.instagram.com/brcinfinity/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-transform duration-300 hover:scale-110"><Instagram /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-white">{t('footer.quick_links')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors">{t('header.home')}</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-white transition-colors">{t('header.products')}</Link></li>
              <li><Link href="/about-us" className="text-sm text-muted-foreground hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-white transition-colors">{t('header.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-white">{t('footer.categories')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-white transition-colors">{t('categories.living_room')}</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-white transition-colors">{t('categories.bedroom')}</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-white transition-colors">{t('categories.dining_room')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-white">{t('footer.contact_us')}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Masko mobilyacılar sitesi 18/B No 35 Istanbul, Turkey</li>
              <li className="font-code">+90 546 789 89 68</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
            <p>&copy; {new Date().getFullYear()} BRC INFINITY. {t('footer.rights_reserved')}</p>
            <Link
              href="/admin"
              className="text-xs uppercase tracking-[0.35em] text-muted-foreground transition-colors hover:text-white"
            >
              Admin Mode
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
