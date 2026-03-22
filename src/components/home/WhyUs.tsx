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

  return (
    <section className="theme-surface-soft bg-background">
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title mt-5">{t('home.why_us_title')}</h2>
          <p className="section-copy mt-5">{sectionCopy.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group rounded-[1rem] px-2 pb-2 text-center transition-colors duration-500 hover:border-[rgba(193,148,79,0.34)]"
            >
              <CardHeader className="items-center pb-4">
                <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-[0.7rem] border border-[rgba(193,148,79,0.24)] bg-[rgba(74,49,31,0.76)] transition-transform duration-500 group-hover:scale-105">
                  {feature.icon}
                </div>
                <span className="text-[0.72rem] uppercase tracking-[0.22em] text-accent/76">0{index + 1}</span>
                <CardTitle className="font-headline text-2xl text-primary">{feature.title}</CardTitle>
                <div className="classic-divider mt-4 max-w-[6rem]" />
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-primary/66">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
