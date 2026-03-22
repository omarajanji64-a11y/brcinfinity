'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/lib/i18n';
import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import {
  DEFAULT_HERO_SLIDE_DURATION_SECONDS,
  isValidHeroCarouselImageUrl,
} from '@/lib/hero-carousel';
import { useHeroCarouselConfig } from '@/hooks/use-hero-carousel-config';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

export default function HeroCarousel() {
  const { t } = useTranslation();
  const { config } = useHeroCarouselConfig();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(
    () => config.slides.filter((slide) => isValidHeroCarouselImageUrl(slide.imageUrl)),
    [config.slides]
  );

  const activeSlide = slides[activeIndex] ?? slides[0];
  const currentDelayMs = (activeSlide?.durationSeconds ?? DEFAULT_HERO_SLIDE_DURATION_SECONDS) * 1000;

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
    if (activeIndex < slides.length) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (!carouselApi || isPaused || !config.autoplay || slides.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (config.randomOrder) {
        const currentIndex = carouselApi.selectedScrollSnap();
        let nextIndex = currentIndex;

        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * slides.length);
        }

        carouselApi.scrollTo(nextIndex);
        return;
      }

      carouselApi.scrollNext();
    }, currentDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, carouselApi, config.autoplay, config.randomOrder, currentDelayMs, isPaused, slides.length]);

  const renderHeroImage = (imageUrl: string, index: number) => {
    const resolvedUrl = buildCloudinaryImageUrl(imageUrl, {
      width: 1440,
      height: 810,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto:good',
    });

    if (canUseNextImage(resolvedUrl)) {
      return (
        <Image
          src={resolvedUrl}
          alt={`Hero slide ${index + 1}`}
          fill
          priority={index === 0}
          unoptimized
          sizes="100vw"
          className="h-full w-full object-cover animate-scale-in"
        />
      );
    }

    return (
      <img
        src={resolvedUrl}
        alt={`Hero slide ${index + 1}`}
        className="h-full w-full object-cover animate-scale-in"
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  };

  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
      {slides.length > 0 ? (
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
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="h-full">
                <div className="relative h-full w-full">
                  {renderHeroImage(slide.imageUrl, index)}
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {slides.length > 1 ? (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 md:flex" />
              <CarouselNext className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 md:flex" />
            </>
          ) : null}
        </Carousel>
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.28),_transparent_45%),linear-gradient(135deg,_rgba(17,17,17,0.92),_rgba(32,24,14,0.96))]" />
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/brc-theme-bg.jpg"
              alt="BRC Infinity hero background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/45" />
        </div>
      )}

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
