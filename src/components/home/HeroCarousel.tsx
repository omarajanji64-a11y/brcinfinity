'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, MapPin } from 'lucide-react';

import { useTranslation, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type LocalizedCopy = Record<Language, string>;

type PromiseCard = {
  title: LocalizedCopy;
  description: LocalizedCopy;
};

const CONTACT_LABEL: LocalizedCopy = {
  tr: 'Showroom randevusu al',
  en: 'Book a showroom visit',
  fr: 'Prendre rendez-vous',
};

const HERO_INTRO: LocalizedCopy = {
  tr: 'Masko imza seçkisi',
  en: 'Masko signature selection',
  fr: 'Selection signature Masko',
};

const HERO_SUPPORTING_COPY: LocalizedCopy = {
  tr: 'Koltuk takımı, yemek odası ve yatak odası koleksiyonlarında; gösterişli oranları, rafine malzemeleri ve zamansız klasik çizgileri tek bir güçlü atmosferde buluşturuyoruz.',
  en: 'Across sofa sets, dining rooms, and bedrooms, we bring together grand proportions, refined materials, and timeless classical lines in one confident atmosphere.',
  fr: 'Entre salons, salles a manger et chambres, nous reunissons des proportions majestueuses, des materiaux raffines et des lignes classiques intemporelles dans une seule atmosphere forte.',
};

const HERO_TAGS: Record<Language, string[]> = {
  tr: ['Masko showroom', 'Özel üretim seçenekleri', 'Rafine klasik koleksiyonlar'],
  en: ['Masko showroom', 'Custom production options', 'Refined classical collections'],
  fr: ['Showroom Masko', 'Options de fabrication sur mesure', 'Collections classiques raffinees'],
};

const HERO_PROMISES: PromiseCard[] = [
  {
    title: {
      tr: 'Ölçüye göre uyarlama',
      en: 'Tailored dimensions',
      fr: 'Dimensions sur mesure',
    },
    description: {
      tr: 'Mekanın ölçeğine göre daha dengeli ve özel çözümler hazırlanır.',
      en: 'Each piece can be adjusted for a more balanced and bespoke fit.',
      fr: 'Chaque piece peut etre adaptee pour une harmonie plus precise et plus exclusive.',
    },
  },
  {
    title: {
      tr: 'Malzeme ve kumaş seçimi',
      en: 'Material and fabric curation',
      fr: 'Selection de matieres et tissus',
    },
    description: {
      tr: 'Kumaş, cila ve detay seçimleri proje ruhuna göre birlikte şekillenir.',
      en: 'Fabric, finish, and detail selections are curated around the project mood.',
      fr: 'Les tissus, finitions et details sont choisis selon l esprit du projet.',
    },
  },
  {
    title: {
      tr: 'Showroom danışmanlığı',
      en: 'Showroom consultation',
      fr: 'Conseil en showroom',
    },
    description: {
      tr: 'Ürünleri yakından inceleyip en doğru kombinasyonu birlikte belirleyebilirsiniz.',
      en: 'Clients can review the pieces closely and build the right combination with us.',
      fr: 'Les clients peuvent examiner les pieces et definir la meilleure combinaison avec nous.',
    },
  },
];

const HERO_SCENE_COPY = {
  mainLabel: {
    tr: 'Öne çıkan atmosfer',
    en: 'Featured atmosphere',
    fr: 'Atmosphere mise en avant',
  },
  mainTitle: {
    tr: 'Royal yatak odası',
    en: 'Royal bedroom',
    fr: 'Chambre royale',
  },
  mainDescription: {
    tr: 'Derin tonlar, güçlü başlık tasarımı ve varak detaylarla daha etkileyici bir sahne.',
    en: 'Deeper tones, a stronger headboard presence, and gilded detailing for a richer scene.',
    fr: 'Des tons plus profonds, une presence plus forte et des details dores pour une scene plus marquante.',
  },
  sideKicker: {
    tr: 'Showroom notu',
    en: 'Showroom note',
    fr: 'Note showroom',
  },
  sideTitle: {
    tr: 'Birebir seçim desteği',
    en: 'One-to-one selection support',
    fr: 'Accompagnement personnalise',
  },
  sideDescription: {
    tr: 'Kumaş, ton ve takım eşleşmelerini showroom ziyaretinde birlikte netleştiriyoruz.',
    en: 'We refine fabric, tone, and collection matching together during your showroom visit.',
    fr: 'Nous definissons ensemble les tissus, les tons et les associations lors de votre visite.',
  },
  secondaryLabel: {
    tr: 'İkinci seçki',
    en: 'Second perspective',
    fr: 'Seconde perspective',
  },
  secondaryTitle: {
    tr: 'Canopy koleksiyonu',
    en: 'Canopy collection',
    fr: 'Collection canopy',
  },
  secondaryDescription: {
    tr: 'Daha aydınlık bir klasik yorum, yumuşak geçişler ve romantik bir duruş sunar.',
    en: 'A brighter classical interpretation with softer transitions and a romantic stance.',
    fr: 'Une interpretation classique plus lumineuse, avec des transitions douces et une presence plus romantique.',
  },
  location: {
    tr: 'Masko, İstanbul',
    en: 'Masko, Istanbul',
    fr: 'Masko, Istanbul',
  },
};

const getCopy = (value: LocalizedCopy, language: Language) =>
  value[language] || value.tr || value.en || value.fr;

export default function HeroCarousel() {
  const { t, language } = useTranslation();
  const heroTags = HERO_TAGS[language] || HERO_TAGS.tr;

  return (
    <section className="relative isolate overflow-hidden px-3 pb-10 pt-4 md:px-4 md:pb-14">
      <div className="ambient-orb animate-float-slow left-[-6rem] top-10 h-48 w-48 sm:h-64 sm:w-64" />
      <div className="ambient-orb animate-float-slower bottom-6 right-[-4rem] h-56 w-56 sm:h-72 sm:w-72" />

      <div className="container mx-auto px-0">
        <div className="theme-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-6 lg:p-8">
          <div className="photo-veil opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,175,104,0.16),transparent_24%),linear-gradient(180deg,rgba(4,4,6,0.04),rgba(4,4,6,0.18)_38%,rgba(4,4,6,0.34)_100%)]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
            <div className="max-w-2xl px-2 py-4 sm:px-4">
              <p className="section-kicker animate-reveal">{getCopy(HERO_INTRO, language)}</p>
              <h1 className="animate-reveal animate-reveal-delay-1 mt-5 font-headline text-4xl font-semibold leading-[0.98] text-primary sm:text-5xl md:text-7xl">
                {t('hero.title')}
              </h1>
              <p className="animate-reveal animate-reveal-delay-2 mt-5 max-w-xl text-base leading-8 text-primary/72 md:text-lg">
                {t('hero.subtitle')}
              </p>
              <p className="animate-reveal animate-reveal-delay-3 mt-6 max-w-2xl text-sm leading-7 text-primary/54 md:text-base">
                {getCopy(HERO_SUPPORTING_COPY, language)}
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
                    className="animate-reveal rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-primary/58"
                    style={{ animationDelay: `${0.42 + index * 0.08}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {HERO_PROMISES.map((promise, index) => (
                  <div
                    key={promise.title.tr}
                    className="animate-reveal rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                    style={{ animationDelay: `${0.48 + index * 0.08}s` }}
                  >
                    <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent">
                      <Check className="h-3.5 w-3.5" />
                      <span>{getCopy(promise.title, language)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-primary/58">{getCopy(promise.description, language)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-reveal animate-reveal-delay-2 relative">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.88fr)]">
                <div className="relative min-h-[340px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/30 shadow-[0_24px_48px_rgba(0,0,0,0.34)] sm:min-h-[520px]">
                  <div className="absolute inset-0" style={{ animation: 'hero-pan 18s ease-in-out infinite alternate' }}>
                    <Image
                      src="/hero-slider/royal-bedroom.jpg"
                      alt={getCopy(HERO_SCENE_COPY.mainTitle, language)}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 36vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.05),rgba(5,5,6,0.16)_34%,rgba(5,5,6,0.62)_100%)]" />

                  <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
                    <div className="rounded-full border border-white/10 bg-black/36 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-primary/70 backdrop-blur-md">
                      {getCopy(HERO_SCENE_COPY.mainLabel, language)}
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-primary/58 backdrop-blur-md">
                      01
                    </div>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                    <div className="max-w-sm rounded-[1.4rem] border border-white/10 bg-black/34 p-4 backdrop-blur-md sm:p-5">
                      <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-primary/62">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{getCopy(HERO_SCENE_COPY.location, language)}</span>
                      </div>
                      <p className="mt-3 font-headline text-2xl font-semibold text-primary sm:text-[2rem]">
                        {getCopy(HERO_SCENE_COPY.mainTitle, language)}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-primary/58">
                        {getCopy(HERO_SCENE_COPY.mainDescription, language)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="theme-panel rounded-[1.5rem] p-5 sm:p-6">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-accent">
                      {getCopy(HERO_SCENE_COPY.sideKicker, language)}
                    </p>
                    <h2 className="mt-4 font-headline text-3xl font-semibold leading-tight text-primary">
                      {getCopy(HERO_SCENE_COPY.sideTitle, language)}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-primary/56">
                      {getCopy(HERO_SCENE_COPY.sideDescription, language)}
                    </p>
                  </div>

                  <div className="relative min-h-[230px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 shadow-[0_20px_42px_rgba(0,0,0,0.32)] sm:min-h-[280px]">
                    <Image
                      src="/hero-slider/canopy-bedroom.jpg"
                      alt={getCopy(HERO_SCENE_COPY.secondaryTitle, language)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 24vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.03),rgba(5,5,6,0.12)_32%,rgba(5,5,6,0.62)_100%)]" />

                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                      <div className="rounded-[1.2rem] border border-white/10 bg-black/34 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-primary/62">
                            {getCopy(HERO_SCENE_COPY.secondaryLabel, language)}
                          </p>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-primary/54">
                            02
                          </span>
                        </div>
                        <p className="mt-3 font-headline text-2xl font-semibold text-primary">
                          {getCopy(HERO_SCENE_COPY.secondaryTitle, language)}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-primary/56">
                          {getCopy(HERO_SCENE_COPY.secondaryDescription, language)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
