'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/hooks/use-product';
import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import { useTranslation } from '@/lib/i18n';
import {
  buildWhatsAppOrderMessage,
  getLocalizedText,
  getProductCategoryLabel,
  getProductName,
} from '@/lib/products';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, language } = useTranslation();
  const { product, isLoading } = useProduct(params.id, { realtime: false });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.imageUrls.length > 0 ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  const transformedImages = useMemo(
    () =>
      images.map((image) =>
        buildCloudinaryImageUrl(image, {
          width: 1200,
          height: 1200,
          crop: 'limit',
          quality: 'auto:good',
        })
      ),
    [images]
  );

  useEffect(() => {
    setCurrentImageIndex((currentIndex) => {
      if (transformedImages.length === 0) {
        return 0;
      }

      return currentIndex >= transformedImages.length ? 0 : currentIndex;
    });
  }, [transformedImages.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || transformedImages.length < 2) {
      return;
    }

    const timerId = window.setTimeout(() => {
      for (const src of transformedImages) {
        if (!src || preloadedImagesRef.current.has(src)) {
          continue;
        }

        preloadedImagesRef.current.add(src);
        const image = new window.Image();
        image.decoding = 'async';
        image.loading = 'eager';
        image.src = src;
      }
    }, 120);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [transformedImages]);

  useEffect(() => {
    if (typeof window === 'undefined' || transformedImages.length < 2) {
      return;
    }

    const indexesToPreload = [
      (currentImageIndex + 1) % transformedImages.length,
      (currentImageIndex + transformedImages.length - 1) % transformedImages.length,
    ];

    for (const index of indexesToPreload) {
      const src = transformedImages[index];
      if (!src || preloadedImagesRef.current.has(src)) {
        continue;
      }

      preloadedImagesRef.current.add(src);
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
    }
  }, [currentImageIndex, transformedImages]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-grow px-4 py-12">
          <Skeleton className="h-[60vh] w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-grow px-4 py-12">
          <div className="theme-panel rounded-lg border bg-card p-8 text-center">
            <h1 className="font-headline text-3xl font-bold">Urun bulunamadi</h1>
            <p className="mt-3 text-muted-foreground">
              Bu urun silinmis olabilir veya baglanti hatali olabilir.
            </p>
            <Button asChild className="mt-6">
              <Link href="/products">Urunlere don</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const productName = getProductName(product, language, '');
  const categoryLabel = getProductCategoryLabel(product, language, t);
  const shortDescription = getLocalizedText(product.shortDescription, language);
  const description = getLocalizedText(product.description, language);
  const imageAlt =
    productName ||
    categoryLabel ||
    (language === 'tr' ? 'Urun gorseli' : language === 'fr' ? 'Image du produit' : 'Product image');
  const phoneNumber = '905467898968';
  const message = buildWhatsAppOrderMessage({
    language,
    productName,
    productImage: images[0] || '',
  });
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const nextImage = () => {
    if (images.length === 0) {
      return;
    }

    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) {
      return;
    }

    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const transformedImage = transformedImages[currentImageIndex] ?? '';
  const canRenderWithNextImage = transformedImage ? canUseNextImage(transformedImage) : false;
  const hasInfo = Boolean(productName || categoryLabel || shortDescription || description);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            {images.length > 0 ? (
              <>
                <div className="theme-panel relative flex h-[clamp(360px,78vh,920px)] items-center justify-center overflow-hidden rounded-[1.8rem] border bg-secondary/20 p-4 shadow-lg">
                  {canRenderWithNextImage ? (
                    <Image
                      src={transformedImage}
                      alt={imageAlt}
                      fill
                      priority={currentImageIndex === 0}
                      sizes="(max-width: 1280px) 100vw, 1152px"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src={transformedImage}
                      alt={imageAlt}
                      className="h-full w-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  )}
                  {images.length > 1 && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        idx === currentImageIndex ? 'bg-accent' : 'bg-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Skeleton className="h-[clamp(360px,78vh,920px)] w-full rounded-[1.8rem]" />
            )}
          </div>

          <div className="mx-auto mt-6 max-w-3xl">
            <Button asChild className="w-full rounded-full">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('common.order_whatsapp')}
              </Link>
            </Button>

            {hasInfo ? (
              <div className="theme-panel mt-6 rounded-[1.6rem] p-6 sm:p-8">
                {productName ? (
                  <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">{productName}</h1>
                ) : null}
                {categoryLabel ? (
                  <div className={`${productName ? 'mt-3' : ''} text-lg text-muted-foreground`}>{categoryLabel}</div>
                ) : null}
                {shortDescription ? (
                  <p className="mt-5 text-base leading-8 text-primary/70">{shortDescription}</p>
                ) : null}
                {description ? (
                  <div className="mt-6 text-base leading-8 text-primary/72">{description}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
