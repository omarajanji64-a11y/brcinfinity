'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import { getProductCategoryLabel, getProductName, type Product } from '@/lib/products';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productName = getProductName(product, language);
  const productCategory = getProductCategoryLabel(product, language, t);
  const phoneNumber = '905467898968';
  const images = product.imageUrls.length > 0 ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  const currentImage = images[currentImageIndex] || '';
  const isValidUrl = typeof currentImage === 'string' && currentImage.startsWith('https://');
  const transformedUrl = isValidUrl
    ? buildCloudinaryImageUrl(currentImage, {
        width: 560,
        height: 560,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto:eco',
      })
    : '';
  const canRenderWithNextImage = transformedUrl ? canUseNextImage(transformedUrl) : false;
  const message = t('whatsapp.order_message', {
    productName,
    productImage: currentImage || product.imageUrl || '',
  });
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const detailLabel =
    language === 'tr' ? 'Incele' : language === 'fr' ? 'Decouvrir' : 'Explore';

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

  return (
    <Card className="theme-panel group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#130d09]/72 shadow-[0_22px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(0,0,0,0.3)]">
      <CardHeader className="p-0">
        <div className="group/image relative aspect-[4/4.35] overflow-hidden">
          {isValidUrl ? (
            <Link href={`/products/${product.id}`} className="relative block h-full group/product-card">
              {canRenderWithNextImage ? (
                <Image
                  src={transformedUrl}
                  alt={productName}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={transformedUrl}
                  alt={productName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </Link>
          ) : (
            <div className="theme-surface-soft flex h-full w-full items-center justify-center bg-secondary">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,6,4,0.1),rgba(9,6,4,0.28)_55%,rgba(9,6,4,0.75)_100%)]" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.66rem] uppercase tracking-[0.26em] text-primary/82">
              {productCategory}
            </span>
            <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[0.66rem] uppercase tracking-[0.26em] text-accent">
              {product.style}
            </span>
          </div>
          {isValidUrl && images.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 text-primary opacity-0 transition-all duration-300 hover:bg-black/55 hover:text-primary group-hover/image:opacity-100"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 text-primary opacity-0 transition-all duration-300 hover:bg-black/55 hover:text-primary group-hover/image:opacity-100"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-6 bg-accent' : 'w-1.5 bg-white/45'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <CardContent className="flex flex-grow flex-col gap-4 p-5 text-left">
          <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.66rem] uppercase tracking-[0.26em] text-primary/62">
            BRC Infinity Selection
          </div>
          <CardTitle className="mt-1 font-headline text-2xl leading-tight text-primary">{productName}</CardTitle>
          <div className="flex-grow" />
          <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-accent/84">
            {detailLabel}
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="grid gap-3 p-5 pt-0 sm:grid-cols-[1fr_auto]">
        <Button
          asChild
          className="h-12 rounded-full bg-accent text-[0.76rem] uppercase tracking-[0.24em] text-[#1d130b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            {t('common.order_whatsapp')}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-white/14 bg-white/[0.04] px-5 text-[0.72rem] uppercase tracking-[0.24em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
        >
          <Link href={`/products/${product.id}`}>{detailLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default memo(ProductCard);
