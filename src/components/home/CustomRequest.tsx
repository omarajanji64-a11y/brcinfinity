'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

export default function CustomRequest() {
  const { t, language } = useTranslation();

  const supportPoints =
    language === 'tr'
      ? ['Ölçüye göre uyarlama', 'Malzeme seçimi', 'Proje yönlendirmesi']
      : language === 'fr'
        ? ['Dimensions adaptées', 'Choix des matériaux', 'Orientation projet']
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
            title: 'Créons ensemble une ambiance plus sobre et plus forte.',
            description:
              'Notre équipe vous aide à définir les bonnes pièces, les proportions et l’ambiance générale de votre espace.',
          }
        : {
            kicker: 'Classical design guidance',
            title: 'Let us build a calmer and stronger atmosphere together.',
            description:
              'Our team helps define the right products, proportions, and overall mood for your space.',
          };

  const consultationFacts =
    language === 'tr'
      ? [
          { label: 'İlk dönüş', value: '48 Saat', note: 'Talep sonrası hızlı değerlendirme ve yönlendirme' },
          { label: 'Destek modeli', value: 'Birebir', note: 'Showroom veya WhatsApp üzerinden doğrudan iletişim' },
        ]
      : language === 'fr'
        ? [
            { label: 'Premier retour', value: '48 Heures', note: 'Évaluation rapide après la demande' },
            { label: 'Accompagnement', value: 'Direct', note: 'Échanges via showroom ou WhatsApp' },
          ]
        : [
            { label: 'First reply', value: '48 Hours', note: 'Fast review and guidance after the inquiry' },
            { label: 'Support model', value: 'Direct', note: 'One-to-one contact via showroom or WhatsApp' },
          ];

  const processSteps =
    language === 'tr'
      ? [
          'Mekan ölçüsü ve ihtiyaçların kısa değerlendirmesi',
          'Kategori, takım ve ton alternatiflerinin belirlenmesi',
          'Showroom ziyareti veya uzaktan yönlendirme ile karar netleştirme',
        ]
      : language === 'fr'
        ? [
            'Évaluation rapide des dimensions et besoins du lieu',
            'Sélection des catégories, ensembles et tonalités adaptées',
            'Décision finale via showroom ou accompagnement à distance',
          ]
        : [
            'A quick review of dimensions and spatial needs',
            'A refined shortlist of collections, tones, and categories',
            'Final alignment through showroom or remote guidance',
          ];

  return (
    <section className="relative isolate overflow-hidden px-4 py-20 md:py-24">
      <div className="section-spotlight" />
      <div className="ambient-orb animate-float-slow left-[-5rem] top-12 h-56 w-56" />
      <div className="ambient-orb animate-float-slower bottom-6 right-[-5rem] h-64 w-64" />
      <div className="container relative mx-auto px-0">
        <div className="mx-auto max-w-6xl">
          <div className="theme-panel relative overflow-hidden rounded-[1.95rem] p-8 sm:p-10 lg:p-12">
            <div className="photo-veil opacity-35" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] lg:items-center">
              <div className="max-w-3xl">
                <p className="section-kicker animate-reveal">{sideCopy.kicker}</p>
                <h2 className="animate-reveal animate-reveal-delay-1 mt-6 font-headline text-4xl font-semibold leading-tight text-primary md:text-5xl">
                  {t('home.custom_request_title')}
                </h2>
                <p className="animate-reveal animate-reveal-delay-2 mt-5 max-w-3xl text-lg leading-8 text-primary/68">
                  {t('home.custom_request_desc')}
                </p>
                <h3 className="animate-reveal animate-reveal-delay-2 mt-7 font-headline text-3xl font-semibold leading-tight text-primary">
                  {sideCopy.title}
                </h3>
                <p className="animate-reveal animate-reveal-delay-3 mt-5 max-w-2xl text-sm leading-7 text-primary/52">
                  {sideCopy.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-primary/56">
                  {supportPoints.map((item, index) => (
                    <span
                      key={item}
                      className="glass-badge animate-reveal text-sm"
                      style={{ animationDelay: `${0.28 + index * 0.08}s` }}
                    >
                      <Check className="h-3.5 w-3.5 text-accent" />
                      {item}
                    </span>
                  ))}
                </div>

                <Button
                  asChild
                  size="lg"
                  className="animate-reveal animate-reveal-delay-3 mt-8 h-11 rounded-full px-7"
                >
                  <Link href="/contact">
                    {t('home.custom_request_button')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="theme-panel animate-fade-in-up rounded-[1.55rem] p-6 sm:p-7">
                  <p className="text-[0.72rem] uppercase tracking-[0.2em] text-accent">
                    {language === 'tr' ? 'Proje akışı' : language === 'fr' ? 'Processus projet' : 'Project flow'}
                  </p>
                  <div className="mt-5 space-y-4">
                    {processSteps.map((step, index) => (
                      <div key={step} className="flex items-start gap-4">
                        <div className="glass-badge glass-badge-strong min-w-[2.5rem] justify-center px-0 text-[0.68rem] uppercase tracking-[0.18em] text-primary/76">
                          0{index + 1}
                        </div>
                        <p className="pt-1 text-sm leading-6 text-primary/58">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {consultationFacts.map((fact, index) => (
                    <div
                      key={fact.label}
                      className="metric-card animate-fade-in-up"
                      style={{ animationDelay: `${0.18 + index * 0.08}s` }}
                    >
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-primary/44">{fact.label}</p>
                      <p className="mt-3 font-headline text-[1.8rem] font-semibold text-primary">{fact.value}</p>
                      <p className="mt-2 text-sm leading-6 text-primary/56">{fact.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
