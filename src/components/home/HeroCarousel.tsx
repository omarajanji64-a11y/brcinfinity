'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

const HERO_IMAGE_SRC = '/hero-static/adsiz-tasarim-15.jpg';

export default function HeroCarousel() {
  const { t } = useTranslation();

  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE_SRC}
          alt="BRC Infinity hero image"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
        <h1 className="animate-fade-in-up animate-text-gold-glow font-headline text-5xl font-bold text-accent drop-shadow-2xl md:text-7xl">
          {t('hero.title')}
        </h1>
        <p
          className="mt-6 max-w-3xl animate-fade-in-up text-lg drop-shadow-xl md:text-xl"
          style={{ animationDelay: '0.3s' }}
        >
          {t('hero.subtitle')}
        </p>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="mt-8 animate-fade-in-up animate-button-glow border-accent bg-transparent text-accent transition-transform duration-300 hover:scale-105 hover:bg-accent/10"
          style={{ animationDelay: '0.6s' }}
        >
          <Link href="/products">{t('hero.explore_collections')}</Link>
        </Button>
      </div>
    </div>
  );
}
