'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { useTranslation } from '@/lib/i18n';
import {
  getLocalizedText,
  getProductCategoryLabel,
  getProductName,
} from '@/lib/products';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const transformCloudinaryUrl = (url: string) => {
  if (!url || !url.includes('/upload/')) {
    return url;
  }

  const parts = url.split('/upload/');
  const transformations = 'w_1400,h_1400,c_fit,f_auto,q_auto';
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, language } = useTranslation();
  const { products, isLoading } = useProducts({ realtime: false });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = useMemo(
    () => products.find((item) => item.id === params.id) ?? null,
    [params.id, products]
  );

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.imageUrls.length > 0 ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  useEffect(() => {
    setCurrentImageIndex((currentIndex) => {
      if (images.length === 0) {
        return 0;
      }

      return currentIndex >= images.length ? 0 : currentIndex;
    });
  }, [images.length]);

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
          <div className="rounded-lg border bg-card p-8 text-center">
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

  const productName = getProductName(product, language);
  const categoryLabel = getProductCategoryLabel(product, language, t);
  const formattedPrice = CURRENCY_FORMATTER.format(product.price);
  const phoneNumber = '905467898968';
  const message = t('whatsapp.order_message', { productName, productImage: images[0] || '' });
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

  const currentImage = images[currentImageIndex];
  const transformedImage = currentImage ? transformCloudinaryUrl(currentImage) : '';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="relative">
            {images.length > 0 ? (
              <>
                <div className="relative flex h-[clamp(320px,60vh,720px)] items-center justify-center overflow-hidden rounded-lg border bg-secondary/30 p-4 shadow-lg">
                  <Image
                    src={transformedImage}
                    alt={productName}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-contain"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white"
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
              <Skeleton className="h-[clamp(320px,60vh,720px)] w-full rounded-lg" />
            )}
          </div>
          <div>
            <h1 className="mb-4 font-headline text-3xl font-bold md:text-4xl">{productName}</h1>
            <div className="mb-2 text-lg text-muted-foreground">{categoryLabel}</div>
            {product.price > 0 && (
              <div className="mb-6 text-xl font-bold text-accent">{formattedPrice.replace('$', '$ ')}</div>
            )}
            <div className="mb-6">
              <div className="mb-1 font-semibold">{t('product_form.long_desc_label')}</div>
              <div>{getLocalizedText(product.description, language)}</div>
            </div>
            <Button asChild className="mt-4 w-full">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('common.order_whatsapp')}
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
