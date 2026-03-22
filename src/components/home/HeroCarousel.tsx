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
  eyebrow: LocalizedCopy;
  headline: LocalizedCopy;
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
    headline: {
      tr: 'Varak, oyma ve asaletin bir araya geldigi ihtisamli yorumlar',
      en: 'Grand interpretations where carving, gilding, and elegance meet',
      fr: 'Des interpretations majestueuses ou se rencontrent sculpture, dorure et elegance',
    },
    note: {
      tr: 'Salonlardan yatak odalarina kadar her parca, klasik mobilyanin gosterkisini mekanin merkezine tasir.',
      en: 'From salons to bedrooms, each piece brings the grandeur of classical furniture to the heart of the room.',
      fr: 'Du salon a la chambre, chaque piece place la grandeur du mobilier classique au centre de l espace.',
    },
  },
  {
    src: '/hero-slider/canopy-bedroom.jpg',
    eyebrow: {
      tr: 'Saray esintili tasarim',
      en: 'Palatial atmosphere',
      fr: 'Atmosphere palatiale',
    },
    headline: {
      tr: 'Mekanin karakterini belirleyen zamansiz klasik zarafet',
      en: 'Timeless classical elegance that defines the character of a room',
      fr: 'Une elegance classique intemporelle qui definit le caractere de la piece',
    },
    note: {
      tr: 'Ozel olculer, yumusak dokular ve dikkatle secilmis detaylar sayesinde geleneksel bir luks atmosferi kurulur.',
      en: 'Tailored sizing, soft textures, and carefully selected details create a refined traditional atmosphere.',
      fr: 'Des dimensions sur mesure, des textures douces et des details choisis avec soin composent une atmosphere classique raffinee.',
    },
  },
];

const HERO_INSIGHTS: Record<Language, { value: string; label: string }[]> = {
  tr: [
    { value: 'El isciligi', label: 'Oyma ve varak detaylari' },
    { value: 'Ozel uretim', label: 'Mekana gore olculendirme' },
    { value: 'Masko', label: 'Showroom ve danismanlik' },
  ],
  en: [
    { value: 'Craftsmanship', label: 'Carving and gilded details' },
    { value: 'Tailored', label: 'Room-based sizing' },
    { value: 'Masko', label: 'Showroom consultancy' },
  ],
  fr: [
    { value: 'Artisanat', label: 'Sculpture et dorure' },
    { value: 'Sur mesure', label: 'Dimensions adaptees a la piece' },
    { value: 'Masko', label: 'Showroom et conseil' },
  ],
};

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
  const heroInsights = HERO_INSIGHTS[language] || HERO_INSIGHTS.tr;

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
    <section className="relative isolate overflow-hidden px-3 pb-8 pt-2 md:px-4 md:pb-10">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(193,148,79,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,248,231,0.05),_transparent_26%)]" />
      <div className="classic-shell relative mx-auto min-h-[calc(100vh-8.8rem)] max-w-[1480px] overflow-hidden rounded-[1.3rem] border border-[rgba(193,148,79,0.24)] shadow-[0_34px_100px_rgba(0,0,0,0.32)]">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 scale-[1.05]"
                style={index === activeIndex ? { animation: 'hero-pan 22s ease-in-out infinite alternate' } : undefined}
              >
                <Image
                  src={slide.src}
                  alt={`BRC Infinity hero image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,8,0.58),rgba(20,12,8,0.34)_32%,rgba(20,12,8,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(220,187,123,0.14),transparent_22%),linear-gradient(90deg,rgba(34,21,13,0.34),transparent_24%,transparent_76%,rgba(34,21,13,0.34))]" />
        </div>

        <div className="relative container mx-auto flex min-h-[calc(100vh-8.8rem)] items-center px-4 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto w-full max-w-5xl text-center">
            <div className="theme-panel classic-shell mx-auto max-w-4xl rounded-[1.15rem] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="inline-flex items-center gap-3 text-[0.74rem] uppercase tracking-[0.28em] text-accent/92">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                {getCopy(activeSlide.eyebrow, language)}
              </div>

              <h1 className="mt-6 font-headline text-5xl font-semibold leading-[1] text-primary md:text-7xl">
                {t('hero.title')}
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-primary/76 md:text-xl">
                {t('hero.subtitle')}
              </p>
              <div className="classic-divider mx-auto mt-7 max-w-[14rem]" />
              <p className="mx-auto mt-7 max-w-3xl text-sm uppercase tracking-[0.24em] text-accent/88 md:text-base">
                {getCopy(activeSlide.headline, language)}
              </p>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-primary/64 md:text-base">
                {getCopy(activeSlide.note, language)}
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-[0.78rem] tracking-[0.2em]"
                >
                  <Link href="/products">
                    {t('hero.explore_collections')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-[0.78rem] tracking-[0.2em]"
                >
                  <Link href="/contact">{getCopy(CONTACT_LABEL, language)}</Link>
                </Button>
              </div>

              <div className="mt-9 flex items-center justify-center gap-3">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={`${slide.src}-dot`}
                    type="button"
                    aria-label={`Slayt ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-full border transition-all duration-500 ${
                      index === activeIndex
                        ? 'h-3 w-12 border-[rgba(193,148,79,0.62)] bg-accent'
                        : 'h-3 w-3 border-[rgba(255,246,228,0.26)] bg-primary/25 hover:bg-primary/45'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {heroInsights.map((insight) => (
                <div
                  key={`${insight.value}-${insight.label}`}
                  className="theme-panel classic-shell rounded-[0.95rem] px-5 py-6 text-center"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.26em] text-accent/86">{insight.label}</p>
                  <p className="mt-3 font-headline text-3xl font-semibold text-primary">{insight.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/58">
                0{activeIndex + 1} / 0{HERO_SLIDES.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
