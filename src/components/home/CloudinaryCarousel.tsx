'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/lib/i18n';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  buildCloudinaryImageUrl,
  canUseNextImage,
  isHttpsImageUrl,
  isLocalImagePath,
} from '@/lib/image-utils';
import { HERO_CAROUSEL_IMAGES } from '@/lib/site-config';

export default function CloudinaryCarousel() {
  const { t } = useTranslation();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const fallbackImages = [
    'https://picsum.photos/seed/1/1280/720',
    'https://picsum.photos/seed/2/1280/720',
    'https://picsum.photos/seed/3/1280/720',
  ];

  const validImages = (HERO_CAROUSEL_IMAGES.length > 0 ? HERO_CAROUSEL_IMAGES : fallbackImages)
    .filter((url) => typeof url === 'string' && (isLocalImagePath(url) || isHttpsImageUrl(url)));

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || isPaused || validImages.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const currentIndex = carouselApi.selectedScrollSnap();
      let nextIndex = currentIndex;

      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * validImages.length);
      }

      carouselApi.scrollTo(nextIndex);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, carouselApi, isPaused, validImages.length]);

  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
      <Carousel
        setApi={(api) => {
          setCarouselApi(api);
        }}
        className="h-full w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {validImages.map((url, index) => (
            <CarouselItem key={`${url}-${index}`} className="h-full">
              <div className="relative h-full w-full">
                {canUseNextImage(
                  buildCloudinaryImageUrl(url, {
                    width: 1440,
                    height: 810,
                    crop: 'fill',
                    gravity: 'auto',
                    quality: 'auto:good',
                  })
                ) ? (
                  <Image
                    src={buildCloudinaryImageUrl(url, {
                      width: 1440,
                      height: 810,
                      crop: 'fill',
                      gravity: 'auto',
                      quality: 'auto:good',
                    })}
                    alt={`Slideshow image ${index + 1}`}
                    fill
                    priority={index === 0}
                    unoptimized
                    sizes="100vw"
                    className="h-full w-full object-cover animate-scale-in"
                  />
                ) : (
                  <img
                    src={buildCloudinaryImageUrl(url, {
                      width: 1440,
                      height: 810,
                      crop: 'fill',
                      gravity: 'auto',
                      quality: 'auto:good',
                    })}
                    alt={`Slideshow image ${index + 1}`}
                    className="h-full w-full object-cover animate-scale-in"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                )}
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 md:flex" />
      </Carousel>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
        <h1 className="animate-fade-in-up animate-text-gold-glow font-headline text-5xl font-bold text-accent drop-shadow-2xl md:text-7xl">
          {t('hero.title')}
        </h1>
        <p
          className="mt-6 max-w-3xl animate-fade-in-up text-lg drop-shadow-xl md:text-xl"
          style={{ animationDelay: '0.3s' }}
        >
          {t('hero.subtitle')}
        </p>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="mt-8 animate-fade-in-up animate-button-glow border-accent bg-transparent text-accent transition-transform duration-300 hover:scale-105 hover:bg-accent/10"
          style={{ animationDelay: '0.6s' }}
        >
          <Link href="/products">{t('hero.explore_collections')}</Link>
        </Button>
      </div>
    </div>
  );
}
