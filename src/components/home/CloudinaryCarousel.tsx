'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import Autoplay from 'embla-carousel-autoplay';
import { AlertTriangle } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface CarouselDoc {
  carouselImages: string[];
}

const transformCloudinaryUrl = (url: string) => {
    if (!url.includes('/upload/')) {
        return url;
    }
    const parts = url.split('/upload/');
    // w_1280 = width 1280, h_720 = height 720, c_fill = fill crop mode, g_auto = auto gravity
    const transformations = 'w_1280,h_720,c_fill,g_auto';
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}


export default function CloudinaryCarousel() {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const carouselRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'carousel', 'main');
  }, [firestore]);

  const { data, isLoading, error } = useDoc<CarouselDoc>(carouselRef, { realtime: false });

  const fallbackImages = [
    'https://picsum.photos/seed/1/1280/720',
    'https://picsum.photos/seed/2/1280/720',
    'https://picsum.photos/seed/3/1280/720',
  ];

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (error) {
    console.error("Firestore Error fetching Carousel data:", error);
    return <CarouselErrorState message={error.message} />;
  }

  const imagesSource = (data?.carouselImages?.length ?? 0) > 0 ? data!.carouselImages : fallbackImages;
  
  const validImages = imagesSource
    .map(item => {
        if (typeof item === 'string' && item.startsWith('https://')) return item;
        return null;
    })
    .filter((url): url is string => !!url);


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
          {validImages.map((url, index) => (
            <CarouselItem key={`${url}-${index}`} className="h-full">
              <div className="relative h-full w-full">
                <img
                  src={transformCloudinaryUrl(url)}
                  alt={`Slideshow image ${index + 1}`}
                  className="object-cover w-full h-full animate-scale-in"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
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
        <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-2xl animate-fade-in-up animate-text-gold-glow text-accent">
          {t('hero.title')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-xl drop-shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {t('hero.subtitle')}
        </p>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="mt-8 animate-fade-in-up animate-button-glow border-accent text-accent bg-transparent hover:bg-accent/10 transition-transform duration-300 hover:scale-105"
          style={{ animationDelay: '0.6s' }}
        >
          <Link href="/products">{t('hero.explore_collections')}</Link>
        </Button>
      </div>
    </div>
  );
}

function CarouselSkeleton() {
  return (
      <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
          <Skeleton className="h-full w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <Skeleton className="h-16 w-3/4 max-w-2xl" />
              <Skeleton className="h-6 w-full max-w-3xl mt-6" />
          </div>
      </div>
  );
}

function CarouselErrorState({ message }: { message: string }) {
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
