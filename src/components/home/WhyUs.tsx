'use client';

import { Gem, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';


export default function WhyUs() {
  const { t } = useTranslation();
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

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-center font-headline text-4xl font-bold mb-12">{t('home.why_us_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary/30 border-secondary hover:border-accent/50 text-center transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto bg-accent/10 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
