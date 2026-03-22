'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useTranslation } from '@/lib/i18n';

const BACKGROUND_IMAGE_URL = '/hero-slider/canopy-bedroom.jpg';

export default function CustomRequest() {
  const { t, language } = useTranslation();
  const bulletPoints =
    language === 'tr'
      ? ['Olculere gore uyarlanan tasarim', 'Malzeme ve finish secimi', 'Proje bazli yonlendirme']
      : language === 'fr'
        ? ['Dimensions adaptees a votre espace', 'Choix de materiaux et de finitions', 'Orientation projet de bout en bout']
        : ['Tailored sizing for your space', 'Material and finish selection', 'Project-led guidance from start to finish'];
  const sideCopy =
    language === 'tr'
      ? {
          kicker: 'Ozel proje destegi',
          title: 'Yalniz urun degil, butun mekan duygusunu birlikte kuralim.',
          description:
            'Ekibimiz ihtiyacinizi anlayip mekaniniza uygun kombinasyonu, oranlari ve detaylari birlikte netlestirir.',
        }
      : language === 'fr'
        ? {
            kicker: 'Accompagnement sur mesure',
            title: 'Construisons ensemble une ambiance complete, pas seulement un produit.',
            description:
              'Notre equipe vous aide a definir la bonne composition, les proportions et les details pour votre interieur.',
          }
        : {
            kicker: 'Tailored project support',
            title: 'Let us shape the full atmosphere of the room, not just the product.',
            description:
              'Our team helps define the right composition, proportions, and finishing details for your interior.',
          };

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 md:py-24">
      <div className="absolute inset-0 -z-20">
        <Image
          src={BACKGROUND_IMAGE_URL}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(8,6,4,0.86)_18%,rgba(8,6,4,0.68)_48%,rgba(8,6,4,0.82)_100%)]" />

      <div className="container relative mx-auto px-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,13,9,0.8),rgba(20,13,9,0.56))] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-10 lg:p-12">
            <p className="section-kicker">{sideCopy.kicker}</p>
            <h2 className="mt-6 font-headline text-4xl font-semibold leading-tight text-primary md:text-5xl">
              {t('home.custom_request_title')}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-primary/70">{t('home.custom_request_desc')}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {bulletPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-6 text-primary/72"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/12 text-accent">
                    <Check className="h-4 w-4" />
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="mt-8 h-12 rounded-full bg-accent px-7 text-[0.78rem] uppercase tracking-[0.26em] text-[#1d130b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
            >
              <Link href="/contact">
                {t('home.custom_request_button')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md lg:block">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-accent/82">{sideCopy.kicker}</p>
            <h3 className="mt-5 font-headline text-3xl font-semibold text-primary">{sideCopy.title}</h3>
            <p className="mt-4 text-base leading-7 text-primary/68">{sideCopy.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
