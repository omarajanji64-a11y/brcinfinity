'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useTranslation } from '@/lib/i18n';

export default function CustomRequest() {
  const { t, language } = useTranslation();
  const supportPoints =
    language === 'tr'
      ? ['Ölçüye göre uyarlama', 'Malzeme seçimi', 'Proje yönlendirmesi']
      : language === 'fr'
        ? ['Dimensions adaptees', 'Choix des materiaux', 'Orientation projet']
        : ['Tailored sizing', 'Material selection', 'Project guidance'];
  const sideCopy =
    language === 'tr'
      ? {
          kicker: 'Klasik mekan danışmanlığı',
          title: 'Daha sakin, daha güçlü bir mekan dili birlikte kurulsun.',
          description:
            'Ekibimiz, mekanınızın ölçülerine ve ihtiyacına göre ürün, oran ve genel atmosfer kararlarını birlikte netleştirir.',
        }
      : language === 'fr'
        ? {
          kicker: 'Conseil classique',
          title: 'Creons ensemble une ambiance plus sobre et plus forte.',
          description:
              'Notre equipe vous aide a definir les bonnes pieces, les proportions et l ambiance generale de votre espace.',
          }
        : {
          kicker: 'Classical design guidance',
            title: 'Let us build a calmer and stronger atmosphere together.',
            description:
              'Our team helps define the right products, proportions, and overall mood for your space.',
          };

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 md:py-24">
      <div className="ambient-orb animate-float-slow left-[-5rem] top-12 h-56 w-56" />
      <div className="ambient-orb animate-float-slower bottom-6 right-[-5rem] h-64 w-64" />
      <div className="container relative mx-auto px-0">
        <div className="mx-auto max-w-4xl">
          <div className="theme-panel relative overflow-hidden rounded-[1.8rem] p-8 text-center sm:p-10 lg:p-12">
            <div className="photo-veil opacity-35" />
            <p className="section-kicker animate-reveal justify-center">{sideCopy.kicker}</p>
            <h2 className="animate-reveal animate-reveal-delay-1 mt-6 font-headline text-4xl font-semibold leading-tight text-primary md:text-5xl">
              {t('home.custom_request_title')}
            </h2>
            <p className="animate-reveal animate-reveal-delay-2 mx-auto mt-5 max-w-3xl text-lg leading-8 text-primary/68">{t('home.custom_request_desc')}</p>
            <p className="animate-reveal animate-reveal-delay-2 mx-auto mt-6 max-w-2xl text-sm leading-7 text-primary/50">{sideCopy.description}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-primary/56">
              {supportPoints.map((item, index) => (
                <span
                  key={item}
                  className="animate-reveal rounded-full border border-white/8 bg-white/[0.03] px-4 py-2"
                  style={{ animationDelay: `${0.28 + index * 0.08}s` }}
                >
                  {item}
                </span>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="animate-reveal animate-reveal-delay-3 mx-auto mt-8 h-11 rounded-full px-7"
            >
              <Link href="/contact">
                {t('home.custom_request_button')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <h3 className="animate-reveal animate-reveal-delay-3 mt-8 font-headline text-3xl font-semibold text-primary">{sideCopy.title}</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
