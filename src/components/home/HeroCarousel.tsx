'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';

import { useTranslation, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type LocalizedCopy = Record<Language, string>;

type HeroSlide = {
  src: string;
  eyebrow: LocalizedCopy;
  title: LocalizedCopy;
  note: LocalizedCopy;
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
    eyebrow: {
      tr: 'Royal yatak odası',
      en: 'Royal bedroom',
      fr: 'Chambre royale',
    },
    title: {
      tr: 'Daha güçlü bir klasik atmosfer',
      en: 'A stronger classical atmosphere',
      fr: 'Une atmosphere classique plus marquante',
    },
    note: {
      tr: 'Derin tonlar, gösterişli başlık çizgileri ve varak detaylarla sahne etkisini yükselten özel bir yorum.',
      en: 'A richer interpretation shaped by deeper tones, sculptural headboard lines, and gilded details.',
      fr: 'Une interpretation plus riche avec des tons profonds, une tete de lit sculpturale et des details dores.',
    },
  },
  {
    src: '/hero-slider/canopy-bedroom.jpg',
    eyebrow: {
      tr: 'Canopy koleksiyonu',
      en: 'Canopy collection',
      fr: 'Collection canopy',
    },
    title: {
      tr: 'Daha yumuşak ve zarif geçişler',
      en: 'Softer and more elegant transitions',
      fr: 'Des transitions plus douces et plus elegantes',
    },
    note: {
      tr: 'Aydınlık yüzeyler, dengeli oranlar ve sakin bir lüks anlayışıyla romantik bir klasik kurgu sunar.',
      en: 'It presents a romantic classical composition through lighter surfaces, balanced proportions, and calm luxury.',
      fr: 'Une composition classique romantique avec des surfaces lumineuses, des proportions equilibrees et un luxe plus calme.',
    },
  },
];

const HERO_TAGS: Record<Language, string[]> = {
  tr: ['Koltuk Takımı', 'Yemek Odası', 'Yatak Odası'],
  en: ['Sofa Sets', 'Dining Rooms', 'Bedrooms'],
  fr: ['Salons', 'Salles a manger', 'Chambres'],
};

const HERO_METRICS: Record<
  Language,
  Array<{ label: string; value: string }>
> = {
  tr: [
    { label: 'Showroom', value: 'Masko' },
    { label: 'Üretim', value: 'Özel' },
    { label: 'Stil', value: 'Klasik' },
  ],
  en: [
    { label: 'Showroom', value: 'Masko' },
    { label: 'Production', value: 'Tailored' },
    { label: 'Style', value: 'Classical' },
  ],
  fr: [
    { label: 'Showroom', value: 'Masko' },
    { label: 'Production', value: 'Sur mesure' },
    { label: 'Style', value: 'Classique' },
  ],
};

const getCopy = (value: LocalizedCopy, language: Language) =>
  value[language] || value.tr || value.en || value.fr;

const SLIDE_DURATION_MS = 6400;

export default function HeroCarousel() {
  const { t, language } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = HERO_SLIDES[activeIndex];
  const heroTags = HERO_TAGS[language] || HERO_TAGS.tr;
  const heroMetrics = HERO_METRICS[language] || HERO_METRICS.tr;

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative isolate overflow-hidden px-3 pb-10 pt-4 md:px-4 md:pb-14">
      <div className="ambient-orb animate-float-slow left-[-6rem] top-10 h-48 w-48 sm:h-64 sm:w-64" />
      <div className="ambient-orb animate-float-slower bottom-8 right-[-4rem] h-56 w-56 sm:h-72 sm:w-72" />

      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-[2.15rem]">
          <div className="hero-ribbon pointer-events-none absolute -top-12 left-[-8%] z-[2] h-40 w-[62%]" />
          <div className="hero-ribbon hero-ribbon-secondary pointer-events-none absolute -top-10 right-[-10%] z-[2] h-32 w-[52%]" />
          <div className="hero-shimmer pointer-events-none absolute inset-x-0 top-0 z-[2] h-28" />

          <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px]">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-[1400ms] ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className="absolute inset-0"
                  style={index === activeIndex ? { animation: 'hero-pan 18s ease-in-out infinite alternate' } : undefined}
                >
                  <Image
                    src={slide.src}
                    alt={getCopy(slide.title, language)}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.10),rgba(5,5,6,0.24)_30%,rgba(5,5,6,0.62)_68%,rgba(5,5,6,0.86)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,175,104,0.22),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.10),transparent_18%)]" />
              </div>
            ))}

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-4 sm:min-h-[640px] sm:p-6 lg:min-h-[720px] lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="glass-badge glass-badge-strong animate-fade-in text-[0.68rem] uppercase tracking-[0.2em] text-primary/78">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  {getCopy(activeSlide.eyebrow, language)}
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/28 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-primary/70 backdrop-blur-md sm:flex">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {getCopy(SHOWROOM_LABEL, language)}
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                <div className="max-w-3xl">
                  <p className="animate-reveal text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-accent">
                    {t('hero.title')}
                  </p>
                  <h1 className="animate-reveal animate-reveal-delay-1 mt-5 max-w-4xl font-headline text-4xl font-semibold leading-[0.94] text-primary sm:text-5xl md:text-7xl">
                    {getCopy(activeSlide.title, language)}
                  </h1>
                  <p className="animate-reveal animate-reveal-delay-2 mt-5 max-w-2xl text-base leading-8 text-primary/76 md:text-lg">
                    {t('hero.subtitle')}
                  </p>
                  <p className="animate-reveal animate-reveal-delay-3 mt-5 max-w-2xl text-sm leading-7 text-primary/58 md:text-base">
                    {getCopy(activeSlide.note, language)}
                  </p>

                  <div className="animate-reveal animate-reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button asChild size="lg" className="h-11 w-full rounded-full px-6 sm:w-auto">
                      <Link href="/products">
                        {t('hero.explore_collections')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-11 w-full rounded-full px-6 sm:w-auto">
                      <Link href="/contact">{getCopy(CONTACT_LABEL, language)}</Link>
                    </Button>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {heroTags.map((tag, index) => (
                      <span
                        key={tag}
                        className="glass-badge animate-reveal text-[0.72rem] uppercase tracking-[0.16em] text-primary/72"
                        style={{ animationDelay: `${0.4 + index * 0.08}s` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 lg:max-w-[320px]">
                  {heroMetrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className="metric-card animate-fade-in-up"
                      style={{ animationDelay: `${0.16 + index * 0.08}s` }}
                    >
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-primary/46">{metric.label}</p>
                      <p className="mt-3 font-headline text-[1.9rem] font-semibold text-primary">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-white/10 bg-black/24 text-primary hover:bg-black/38 hover:text-primary"
                    onClick={goPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-white/10 bg-black/24 text-primary hover:bg-black/38 hover:text-primary"
                    onClick={goNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  {HERO_SLIDES.map((slide, index) => (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`rounded-full transition-all duration-500 ${
                        index === activeIndex ? 'h-2.5 w-10 bg-primary/85' : 'h-2.5 w-2.5 bg-primary/28 hover:bg-primary/48'
                      }`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                  <span className="text-[0.72rem] uppercase tracking-[0.18em] text-primary/54">
                    0{activeIndex + 1} / 0{HERO_SLIDES.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
