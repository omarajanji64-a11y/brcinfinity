'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import Autoplay from 'embla-carousel-autoplay';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslation, type Language } from '@/lib/i18n';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { Card, CardContent } from '@/components/ui/card';

type HeroImage = {
  id: string;
  imageUrl: string;
  description: string;
};

type LocalizedString = {
  en?: string;
  fr?: string;
  tr?: string;
};

type HomepageConfig = {
  title: LocalizedString;
  subtitle: LocalizedString;
  heroImages: HeroImage[];
};

const defaultHomepageData: HomepageConfig = {
    title: {
      en: 'Experience True Luxury',
      fr: 'Vivez le vrai luxe',
      tr: 'Gerçek Lüksü Deneyimleyin',
    },
    subtitle: {
      en: 'Discover our collection of royal and classic furniture, where timeless elegance meets unparalleled craftsmanship.',
      fr: 'Découvrez notre collection de meubles royaux et classiques, où l\\\'élégance intemporelle rencontre un savoir-faire inégalé.',
      tr: 'Zamansız zarafetin benzersiz işçilikle buluştuğu royal ve klasik mobilya koleksiyonumuzu keşfedin.',
    },
    heroImages: placeholderImagesData.placeholderImages.filter(p => p.id.startsWith("hero-"))
};


export default function Hero() {
  const { t, language } = useTranslation();
  const firestore = useFirestore();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const homepageConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/homepage');
  }, [firestore]);

  const { data: homepageConfig, isLoading, error } = useDoc<HomepageConfig>(homepageConfigRef);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (error) {
    console.error("Firestore Error fetching Hero data:", error);
    return <HeroErrorState message={error.message} />;
  }
  
  const config = homepageConfig || defaultHomepageData;
  const images = (config.heroImages && config.heroImages.length > 0)
    ? config.heroImages
    : defaultHomepageData.heroImages;

  const title = (config.title?.[language as Language] || config.title?.en) || defaultHomepageData.title[language as Language] || defaultHomepageData.title.en;
  const subtitle = (config.subtitle?.[language as Language] || config.subtitle?.en) || defaultHomepageData.subtitle[language as Language] || defaultHomepageData.subtitle.en;


  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="h-full w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
            loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {images.map((image) => (
            <CarouselItem key={image.id} className="h-full">
              <div className="relative h-full w-full">
                <img
                  src={image.imageUrl}
                  alt={image.description}
                  className="object-cover w-full h-full animate-scale-in"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-2xl animate-fade-in-up animate-text-gold-glow">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-xl drop-shadow-xl animate-fade-in-up text-shadow-[0_0_10px_rgba(255,255,255,0.7)]" style={{ animationDelay: '0.3s' }}>
          {subtitle}
        </p>
        <Button asChild size="lg" className="mt-8 animate-fade-in-up animate-gold-glow transition-transform duration-300 hover:scale-105" style={{ animationDelay: '0.6s' }}>
          <Link href="/products">{t('hero.explore_collections')}</Link>
        </Button>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
      <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
          <Skeleton className="h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <Skeleton className="h-16 w-3/4 max-w-2xl" />
              <Skeleton className="h-6 w-full max-w-3xl mt-6" />
              <Skeleton className="h-12 w-48 mt-8" />
          </div>
      </div>
  );
}

function HeroErrorState({ message }: { message: string }) {
    const { t } = useTranslation();
    return (
        <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden bg-destructive/10 flex items-center justify-center">
            <Card className="max-w-lg bg-background/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                    <h2 className="mt-4 text-xl font-headline font-bold text-destructive-foreground">{t('common.error_title')}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{t('common.error_desc_slideshow')}</p>
                    <pre className="mt-4 p-2 bg-muted rounded-md text-xs text-left text-destructive overflow-auto">{message}</pre>
                </CardContent>
            </Card>
        </div>
    );
}
