'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

const HERO_SLIDES = ['/hero-slider/royal-bedroom.jpg', '/hero-slider/canopy-bedroom.jpg'];
const SLIDE_INTERVAL_MS = 5000;

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((imageSrc, index) => (
          <div
            key={imageSrc}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={imageSrc}
              alt={`BRC Infinity hero image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
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

        {HERO_SLIDES.length > 1 ? (
          <div className="mt-8 flex items-center gap-2">
            {HERO_SLIDES.map((imageSrc, index) => (
              <button
                key={`${imageSrc}-dot`}
                type="button"
                aria-label={`Slayt ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'bg-accent w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
