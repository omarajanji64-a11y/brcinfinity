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
      <div className="photo-veil opacity-[0.18]" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker animate-reveal justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title animate-reveal animate-reveal-delay-1 mt-5">{t('home.why_us_title')}</h2>
          <p className="section-copy animate-reveal animate-reveal-delay-2 mt-5">{sectionCopy.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="theme-panel-lift animate-reveal rounded-[1.4rem] px-6 py-7 text-left"
              style={{ animationDelay: `${0.12 + index * 0.1}s` }}
            >
              <CardHeader className="items-start px-0 pb-4 pt-0">
                <div className="animate-float-slow mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]" style={{ animationDelay: `${index * 0.2}s` }}>
                  {feature.icon}
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
    </section>
  );
}
