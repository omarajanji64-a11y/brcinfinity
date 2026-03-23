'use client';

import { Gem, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

export default function WhyUs() {
  const { t, language } = useTranslation();
  const features = [
    {
      icon: <Gem className="h-10 w-10 text-accent" />,
      title: t('home.why_us_1_title'),
      description: t('home.why_us_1_desc'),
    },
    {
      icon: <Sparkles className="h-10 w-10 text-accent" />,
      title: t('home.why_us_2_title'),
      description: t('home.why_us_2_desc'),
    },
    {
      icon: <Crown className="h-10 w-10 text-accent" />,
      title: t('home.why_us_3_title'),
      description: t('home.why_us_3_desc'),
    },
  ];
  const sectionCopy =
    language === 'tr'
      ? {
          kicker: 'Klasik ustalik',
          description:
            'Her takim, geleneksel ihtisami korurken uzun omurlu kullanim ve rafine detay anlayisiyla tamamlanir.',
        }
      : language === 'fr'
        ? {
            kicker: 'Savoir-faire classique',
            description:
              'Chaque ensemble preserve la grandeur classique tout en offrant une execution durable et raffinee.',
          }
        : {
            kicker: 'Classical craftsmanship',
            description:
              'Each set preserves classical grandeur while delivering durable execution and refined detailing.',
          };
  const assurances =
    language === 'tr'
      ? [
          { label: 'Malzeme seçimi', value: 'Rafine', note: 'Proje karakterine uygun kumaş ve yüzey kararları' },
          { label: 'Üretim yaklaşımı', value: 'Seçkin', note: 'Detay ve oran dengesini öne çıkaran uygulama' },
          { label: 'Danışmanlık', value: 'Birebir', note: 'Showroom üzerinden yönlendirme ve karar desteği' },
        ]
      : language === 'fr'
        ? [
            { label: 'Materiaux', value: 'Raffines', note: 'Des tissus et finitions choisis selon le projet' },
            { label: 'Production', value: 'Selective', note: 'Une execution attentive aux proportions et details' },
            { label: 'Conseil', value: 'Personnalise', note: 'Un accompagnement direct depuis le showroom' },
          ]
        : [
            { label: 'Materials', value: 'Refined', note: 'Fabrics and finishes shaped around the project mood' },
            { label: 'Production', value: 'Selective', note: 'Execution focused on proportion and detailing' },
            { label: 'Guidance', value: 'One-to-one', note: 'Direct consultation through the showroom process' },
          ];

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-background">
      <div className="section-spotlight" />
      <div className="photo-veil opacity-[0.18]" />
      <div className="ambient-orb animate-float-medium left-[-4rem] top-16 h-48 w-48" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
          <div className="theme-panel animate-reveal rounded-[1.85rem] p-7 sm:p-8 lg:sticky lg:top-28">
            <p className="section-kicker">{sectionCopy.kicker}</p>
            <h2 className="section-title mt-5">{t('home.why_us_title')}</h2>
            <p className="section-copy mt-5">{sectionCopy.description}</p>

            <div className="mt-8 grid gap-3">
              {assurances.map((item, index) => (
                <div
                  key={item.label}
                  className="metric-card animate-fade-in-up"
                  style={{ animationDelay: `${0.12 + index * 0.08}s` }}
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-primary/44">{item.label}</p>
                  <p className="mt-3 font-headline text-[1.7rem] font-semibold text-primary">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-primary/56">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-1">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="theme-panel-lift card-sheen animate-fade-in-up rounded-[1.5rem] px-6 py-7 text-left"
                style={{ animationDelay: `${0.16 + index * 0.1}s` }}
              >
                <CardHeader className="items-start px-0 pb-4 pt-0">
                  <div className="mb-5 flex w-full items-start justify-between gap-4">
                    <div
                      className="animate-float-medium inline-flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04]"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {feature.icon}
                    </div>
                    <span className="glass-badge text-[0.66rem] uppercase tracking-[0.18em] text-primary/66">
                      0{index + 1}
                    </span>
                  </div>
                  <CardTitle className="font-headline text-2xl text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 pt-0">
                  <p className="leading-7 text-primary/66">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
