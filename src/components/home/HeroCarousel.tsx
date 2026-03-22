'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { useTranslation, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type LocalizedCopy = Record<Language, string>;

type HeroSlide = {
  src: string;
  eyebrow: LocalizedCopy;
  note: LocalizedCopy;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/hero-slider/royal-bedroom.jpg',
    eyebrow: {
      tr: 'Klasik koleksiyon',
      en: 'Classic collection',
      fr: 'Collection classique',
    },
    note: {
      tr: 'Zamansiz klasik cizgiler, derin tonlar ve gosteristen uzak guclu bir sunum.',
      en: 'Timeless classical lines, darker tones, and a restrained but confident presentation.',
      fr: 'Des lignes classiques intemporelles, des tons sombres et une presentation sobre mais forte.',
    },
  },
  {
    src: '/hero-slider/canopy-bedroom.jpg',
    eyebrow: {
      tr: 'Saray esintili tasarim',
      en: 'Palatial atmosphere',
      fr: 'Atmosphere palatiale',
    },
    note: {
      tr: 'Koyu ve sakin bir atmosfer icinde urunun karakteri one cikar, detaylar daha net hissedilir.',
      en: 'In a darker and calmer atmosphere, the product speaks more clearly and the details stand out.',
      fr: 'Dans une atmosphere plus sombre et plus calme, le produit s exprime mieux et les details ressortent.',
    },
  },
];

const CONTACT_LABEL: LocalizedCopy = {
  tr: 'Showroom randevusu al',
  en: 'Book a showroom visit',
  fr: 'Prendre rendez-vous',
};

const getCopy = (value: LocalizedCopy, language: Language) =>
  value[language] || value.tr || value.en || value.fr;

const SLIDE_INTERVAL_MS = 5500;

export default function HeroCarousel() {
  const { t, language } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = HERO_SLIDES[activeIndex];

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
    <section className="relative isolate overflow-hidden px-3 pb-10 pt-4 md:px-4 md:pb-14">
      <div className="container mx-auto px-0">
        <div className="grid items-center gap-8 rounded-[2rem] border border-white/8 bg-[rgba(4,4,5,0.42)] p-4 sm:p-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:p-8">
          <div className="max-w-xl px-2 py-4 sm:px-4">
            <p className="section-kicker">{getCopy(activeSlide.eyebrow, language)}</p>
            <h1 className="mt-5 font-headline text-5xl font-semibold leading-[0.98] text-primary md:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-primary/72 md:text-lg">
              {t('hero.subtitle')}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-primary/52 md:text-base">
              {getCopy(activeSlide.note, language)}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg" className="h-11 rounded-full px-6">
                <Link href="/products">
                  {t('hero.explore_collections')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
                <Link href="/contact">{getCopy(CONTACT_LABEL, language)}</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={`${slide.src}-dot`}
                  type="button"
                  aria-label={`Slayt ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full transition-all duration-500 ${
                    index === activeIndex ? 'h-2.5 w-10 bg-primary/80' : 'h-2.5 w-2.5 bg-primary/25 hover:bg-primary/45'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs uppercase tracking-[0.18em] text-primary/42">
                0{activeIndex + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/30">
            <div className="relative h-[420px] sm:h-[520px]">
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-[1200ms] ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div
                    className="absolute inset-0"
                    style={index === activeIndex ? { animation: 'hero-pan 18s ease-in-out infinite alternate' } : undefined}
                  >
                    <Image
                      src={slide.src}
                      alt={`BRC Infinity hero image ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.08),rgba(5,5,6,0.18)_46%,rgba(5,5,6,0.5)_100%)]" />
            </div>
          </div>
        </div>
      </div>      
    </section>
  );
}
