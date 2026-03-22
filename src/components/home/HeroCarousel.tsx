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
      tr: 'Imza koleksiyon',
      en: 'Signature collection',
      fr: 'Collection signature',
    },
    headline: {
      tr: 'Gorkemli yatak odalari icin heykelsi bir durus',
      en: 'A sculptural statement for grand bedrooms',
      fr: 'Une presence sculpturale pour les chambres majestueuses',
    },
    note: {
      tr: 'Oyma detaylar, artisanal dokular ve sahne etkisi yaratan oranlarla tasarlanir.',
      en: 'Designed with carved details, artisanal textures, and proportions that command attention.',
      fr: 'Concue avec des details sculptes, des textures artisanales et des proportions spectaculaires.',
    },
  },
  {
    src: '/hero-slider/canopy-bedroom.jpg',
    eyebrow: {
      tr: 'Ozel uretim atmosfer',
      en: 'Tailored atmosphere',
      fr: 'Atmosphere sur mesure',
    },
    headline: {
      tr: 'Mekanin karakterini belirleyen zamansiz luks',
      en: 'Timeless luxury that defines the character of a room',
      fr: 'Un luxe intemporel qui definit le caractere de la piece',
    },
    note: {
      tr: 'Ihtisamli siluetler, rafine malzeme secimi ve kusursuz finish bir araya gelir.',
      en: 'Majestic silhouettes, refined material choices, and immaculate finishes come together.',
      fr: 'Des silhouettes majestueuses, des materiaux raffines et une finition irreprochable se rencontrent.',
    },
  },
];

const HERO_INSIGHTS: Record<Language, { value: string; label: string }[]> = {
  tr: [
    { value: 'Masko', label: 'Showroom deneyimi' },
    { value: 'Ozel', label: 'Projeye gore uretim' },
    { value: 'Premium', label: 'Malzeme ve iscilik' },
  ],
  en: [
    { value: 'Masko', label: 'Showroom experience' },
    { value: 'Tailored', label: 'Project-based production' },
    { value: 'Premium', label: 'Materials and craftsmanship' },
  ],
  fr: [
    { value: 'Masko', label: 'Experience showroom' },
    { value: 'Sur mesure', label: 'Production adaptee au projet' },
    { value: 'Premium', label: 'Materiaux et savoir-faire' },
  ],
};

const CONTACT_LABEL: LocalizedCopy = {
  tr: 'Proje gorusmesi iste',
  en: 'Request a design call',
  fr: 'Demander un rendez-vous',
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
    <section className="relative isolate overflow-hidden px-3 pb-6 pt-2 md:px-4 md:pb-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(214,176,102,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_30%)]" />
      <div className="relative mx-auto min-h-[calc(100vh-8.5rem)] max-w-[1480px] overflow-hidden rounded-[2.25rem] border border-white/10 shadow-[0_40px_110px_rgba(0,0,0,0.45)]">
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
                style={index === activeIndex ? { animation: 'hero-pan 18s ease-in-out infinite alternate' } : undefined}
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
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,6,4,0.84)_18%,rgba(9,6,4,0.56)_45%,rgba(9,6,4,0.2)_70%,rgba(9,6,4,0.74)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(232,194,120,0.18),transparent_24%),radial-gradient(circle_at_86%_74%,rgba(255,255,255,0.08),transparent_18%)]" />
        </div>

        <div className="relative container mx-auto flex min-h-[calc(100vh-8.5rem)] items-center px-4 py-12 md:px-8 lg:px-10 lg:py-16">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,13,9,0.82),rgba(20,13,9,0.56))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.72rem] uppercase tracking-[0.32em] text-primary/78">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                {getCopy(activeSlide.eyebrow, language)}
              </div>

              <div className="mt-8 space-y-6">
                <h1 className="font-headline text-5xl font-semibold leading-[0.95] text-primary md:text-7xl">
                  {t('hero.title')}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-primary/72 md:text-xl">
                  {t('hero.subtitle')}
                </p>
                <p className="max-w-2xl text-sm uppercase tracking-[0.26em] text-accent/85 md:text-base">
                  {getCopy(activeSlide.headline, language)}
                </p>
                <p className="max-w-2xl text-sm leading-7 text-primary/60 md:text-base">
                  {getCopy(activeSlide.note, language)}
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-accent px-7 text-[0.78rem] uppercase tracking-[0.26em] text-[#1d130b] shadow-[0_18px_40px_rgba(203,154,73,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
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
                  className="h-12 rounded-full border-white/14 bg-white/[0.04] px-7 text-[0.78rem] uppercase tracking-[0.26em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  <Link href="/contact">{getCopy(CONTACT_LABEL, language)}</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-3">
                  {HERO_SLIDES.map((slide, index) => (
                    <button
                      key={`${slide.src}-dot`}
                      type="button"
                      aria-label={`Slayt ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`rounded-full transition-all duration-500 ${
                        index === activeIndex
                          ? 'h-2.5 w-12 bg-accent shadow-[0_0_24px_rgba(203,154,73,0.5)]'
                          : 'h-2.5 w-2.5 bg-white/35 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs uppercase tracking-[0.34em] text-primary/52">
                  0{activeIndex + 1} / 0{HERO_SLIDES.length}
                </p>
              </div>
            </div>

            <div className="hidden gap-5 lg:grid">
              {heroInsights.map((insight, index) => (
                <div
                  key={`${insight.value}-${insight.label}`}
                  className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur-md"
                  style={{ animation: `float-slow ${6 + index}s ease-in-out infinite` }}
                >
                  <p className="text-xs uppercase tracking-[0.32em] text-accent/80">{insight.label}</p>
                  <p className="mt-3 font-headline text-3xl font-semibold text-primary">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
