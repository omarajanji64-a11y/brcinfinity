'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { useTranslation, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type LocalizedCopy = Record<Language, string>;

type HeroSlide = {
  src: string;
  title: LocalizedCopy;
};

const CONTACT_LABEL: LocalizedCopy = {
  tr: 'Showroom randevusu al',
  en: 'Book a showroom visit',
  fr: 'Prendre rendez-vous',
};

const SHOWROOM_LABEL: LocalizedCopy = {
  tr: 'Masko, İstanbul',
  en: 'Masko, Istanbul',
  fr: 'Masko, Istanbul',
};

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/hero-slider/royal-bedroom.jpg',
    title: {
      tr: 'Daha güçlü bir klasik atmosfer',
      en: 'A stronger classical atmosphere',
      fr: 'Une atmosphère classique plus marquante',
    },
  },
  {
    src: '/hero-slider/canopy-bedroom.jpg',
    title: {
      tr: 'Daha yumuşak ve zarif geçişler',
      en: 'Softer and more elegant transitions',
      fr: 'Des transitions plus douces et plus élégantes',
    },
  },
];

const getCopy = (value: LocalizedCopy, language: Language) =>
  value[language] || value.tr || value.en || value.fr;

const MESSAGE_DURATION_MS = 3200;

export default function HeroCarousel() {
  const { t, language } = useTranslation();
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const animatedMessages = HERO_SLIDES.map((slide) => getCopy(slide.title, language));
  const heroBackground = HERO_SLIDES[0];

  useEffect(() => {
    setActiveMessageIndex(0);
  }, [language]);

  useEffect(() => {
    if (animatedMessages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveMessageIndex((current) => (current + 1) % animatedMessages.length);
    }, MESSAGE_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, [animatedMessages.length]);

  return (
    <section className="relative isolate overflow-hidden px-3 pb-10 pt-4 md:px-4 md:pb-14">
      <div className="ambient-orb animate-float-slower left-[-5rem] top-12 h-40 w-40 sm:h-56 sm:w-56" />
      <div className="ambient-orb animate-float-slow bottom-10 right-[-3rem] h-44 w-44 sm:h-60 sm:w-60" />

      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-[2.15rem]">
          <div className="absolute inset-0">
            <Image
              src={heroBackground.src}
              alt={t('hero.title')}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,8,0.34),rgba(6,6,8,0.56)_38%,rgba(6,6,8,0.84)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,175,104,0.18),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_34%)]" />
          </div>

          <div className="relative z-10 flex min-h-[540px] items-center justify-center px-6 py-16 sm:min-h-[620px] sm:px-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="glass-badge glass-badge-strong animate-fade-in text-[0.72rem] uppercase tracking-[0.22em] text-primary/80">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                BRC Infinity
              </div>

              <p className="animate-reveal animate-reveal-delay-1 mt-8 text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-primary/56">
                {getCopy(SHOWROOM_LABEL, language)}
              </p>

              <h1 className="animate-reveal animate-reveal-delay-1 mt-5 max-w-4xl font-headline text-4xl font-semibold leading-[0.95] text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                {t('hero.title')}
              </h1>

              <div className="relative mt-6 h-[3.25rem] w-full sm:h-[4rem] md:h-[4.75rem]" aria-hidden="true">
                {animatedMessages.map((message, index) => (
                  <p
                    key={`${language}-${index}`}
                    className={`hero-copy-line absolute inset-0 flex items-center justify-center px-4 font-headline text-xl font-medium leading-tight text-primary transition-all duration-700 sm:text-2xl md:text-3xl ${
                      index === activeMessageIndex
                        ? 'hero-copy-line-active translate-y-0 opacity-100 blur-0'
                        : 'pointer-events-none translate-y-8 opacity-0 blur-sm'
                    }`}
                  >
                    {message}
                  </p>
                ))}
              </div>

              <p className="animate-reveal animate-reveal-delay-2 mt-6 max-w-2xl text-sm leading-7 text-primary/72 sm:text-base md:text-lg md:leading-8">
                {t('hero.subtitle')}
              </p>

              <div className="animate-reveal animate-reveal-delay-3 mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 rounded-full px-6">
                  <Link href="/products">
                    {t('hero.explore_collections')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full border-white/16 bg-black/20 px-6 text-primary hover:bg-black/32 hover:text-primary"
                >
                  <Link href="/contact">{getCopy(CONTACT_LABEL, language)}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
