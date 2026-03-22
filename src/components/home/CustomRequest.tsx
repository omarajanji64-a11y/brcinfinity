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
          kicker: 'Klasik mekan danismanligi',
          title: 'Yalniz urun degil, butun mekanin klasik dengesini birlikte kuralim.',
          description:
            'Ekibimiz mekaninizin olculerine, renk dengesine ve klasik mobilya ihtiyamina gore en dogru kompozisyonu birlikte belirler.',
        }
      : language === 'fr'
        ? {
            kicker: 'Conseil classique',
            title: 'Construisons l equilibre classique de votre espace, pas seulement un produit.',
            description:
              'Notre equipe definit avec vous la bonne composition, les proportions et les details pour un interieur classique coherent.',
          }
        : {
            kicker: 'Classical design guidance',
            title: 'Let us shape the classical balance of the room, not just the product.',
            description:
              'Our team helps define the right composition, proportions, and detailing for a coherent classical interior.',
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
        <div className="mx-auto max-w-5xl">
          <div className="theme-panel classic-shell rounded-[1rem] p-7 sm:p-10 lg:p-12">
            <p className="section-kicker justify-center">{sideCopy.kicker}</p>
            <h2 className="mt-6 text-center font-headline text-4xl font-semibold leading-tight text-primary md:text-5xl">
              {t('home.custom_request_title')}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-lg leading-8 text-primary/70">{t('home.custom_request_desc')}</p>
            <div className="classic-divider mx-auto mt-7 max-w-[10rem]" />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {bulletPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[0.8rem] border border-[rgba(193,148,79,0.18)] bg-[rgba(72,47,29,0.76)] px-4 py-4 text-sm leading-6 text-primary/72"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-[0.45rem] bg-accent/12 text-accent">
                    <Check className="h-4 w-4" />
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="mx-auto mt-8 h-12 px-7 text-[0.78rem] tracking-[0.18em]"
            >
              <Link href="/contact">
                {t('home.custom_request_button')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="mx-auto mt-8 max-w-3xl text-center">
              <h3 className="font-headline text-3xl font-semibold text-primary">{sideCopy.title}</h3>
              <p className="mt-4 text-base leading-7 text-primary/68">{sideCopy.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
