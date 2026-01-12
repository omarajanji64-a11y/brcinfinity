'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Heart, Zap } from 'lucide-react';

export default function MissionVisionPage() {
  const { t } = useTranslation();

  const missions = [
    {
      icon: <Sparkles className="h-12 w-12 text-accent" />,
      title: t('mission_vision.mission_excellence'),
      description: t('mission_vision.mission_excellence_desc'),
    },
    {
      icon: <Heart className="h-12 w-12 text-accent" />,
      title: t('mission_vision.mission_craftsmanship'),
      description: t('mission_vision.mission_craftsmanship_desc'),
    },
    {
      icon: <Zap className="h-12 w-12 text-accent" />,
      title: t('mission_vision.mission_innovation'),
      description: t('mission_vision.mission_innovation_desc'),
    },
  ];

  const visions = [
    {
      icon: <Target className="h-12 w-12 text-accent" />,
      title: t('mission_vision.vision_leadership'),
      description: t('mission_vision.vision_leadership_desc'),
    },
    {
      icon: <Sparkles className="h-12 w-12 text-accent" />,
      title: t('mission_vision.vision_heritage'),
      description: t('mission_vision.vision_heritage_desc'),
    },
    {
      icon: <Heart className="h-12 w-12 text-accent" />,
      title: t('mission_vision.vision_community'),
      description: t('mission_vision.vision_community_desc'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-8 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="font-headline text-5xl md:text-7xl font-bold text-white mb-6 animate-text-gold-glow" style={{
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.4)'
              }}>
                {t('mission_vision.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
                {t('mission_vision.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
                {t('mission_vision.our_mission')}
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                {t('mission_vision.mission_intro')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {missions.map((item, index) => (
                <Card 
                  key={index} 
                  className="bg-secondary/30 border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 px-4 bg-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
                {t('mission_vision.our_vision')}
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                {t('mission_vision.vision_intro')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visions.map((item, index) => (
                <Card 
                  key={index}
                  className="bg-background border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-6">
                {t('mission_vision.our_values')}
              </h2>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8 md:p-12 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {t('mission_vision.values_desc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_quality')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_quality_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_integrity')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_integrity_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_passion')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_passion_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_sustainability')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_sustainability_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
