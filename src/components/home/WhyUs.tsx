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
          kicker: 'Neden BRC Infinity',
          description:
            'Her urun, estetik etkisi kadar uygulama kalitesi ve uzun omurlu deneyimiyle de fark yaratir.',
        }
      : language === 'fr'
        ? {
            kicker: 'Pourquoi BRC Infinity',
            description:
              'Chaque piece se distingue autant par sa presence visuelle que par la qualite de son execution.',
          }
        : {
            kicker: 'Why BRC Infinity',
            description:
              'Every piece stands out not only visually, but also through its execution quality and lasting presence.',
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
              className="group rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
            >
              <CardHeader className="items-center pb-4">
                <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full border border-accent/20 bg-accent/10 transition-transform duration-500 group-hover:scale-105">
                  {feature.icon}
                </div>
                <span className="text-[0.72rem] uppercase tracking-[0.3em] text-accent/76">0{index + 1}</span>
                <CardTitle className="font-headline text-2xl text-primary">{feature.title}</CardTitle>
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
