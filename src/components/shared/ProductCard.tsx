'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import { buildWhatsAppOrderMessage, getProductCategoryLabel, getProductName, type Product } from '@/lib/products';
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

  const productName = getProductName(product, language, '');
  const productCategory = getProductCategoryLabel(product, language, t);
  const imageAlt = productName || productCategory || (language === 'tr' ? 'Urun gorseli' : language === 'fr' ? 'Image du produit' : 'Product image');
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
  const message = buildWhatsAppOrderMessage({
    language,
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
    <Card className="theme-panel-lift group flex h-full flex-col overflow-hidden rounded-[1.4rem] p-0 transition-colors duration-500 hover:border-white/14">
      <CardHeader className="p-0">
        <div className="group/image relative overflow-hidden rounded-t-[1.4rem] border-b border-white/8">
          {isValidUrl ? (
            <Link href={`/products/${product.id}`} className="relative block h-full group/product-card">
              {canRenderWithNextImage ? (
                <Image
                  src={transformedUrl}
                  alt={imageAlt}
                  width={560}
                  height={610}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="aspect-[4/4.3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <img
                  src={transformedUrl}
                  alt={imageAlt}
                  className="aspect-[4/4.3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.02),rgba(5,5,6,0.08)_50%,rgba(5,5,6,0.28)_100%)]" />
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
        <CardContent className="flex flex-grow flex-col gap-3 p-5 text-left">
          <p className="text-[0.72rem] uppercase tracking-[0.16em] text-primary/42">{productCategory}</p>
          {productName ? (
            <CardTitle className="font-headline text-2xl leading-tight text-primary">{productName}</CardTitle>
          ) : null}
          <div className="flex-grow" />
          <div className="inline-flex items-center gap-2 text-sm text-primary/54">
            {detailLabel}
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="grid gap-3 p-5 pt-0 sm:grid-cols-[1fr_auto]">
        <Button
          asChild
          className="h-10 rounded-full text-[0.78rem]"
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            {t('common.order_whatsapp')}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full px-5 text-[0.78rem]"
        >
          <Link href={`/products/${product.id}`}>{detailLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default memo(ProductCard);
