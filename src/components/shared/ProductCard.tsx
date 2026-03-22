'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

import { getProductName, type Product } from '@/lib/products';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface ProductCardProps {
  product: Product;
}

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
  const transformations = 'w_600,h_600,c_fill,g_auto';
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formattedPrice = CURRENCY_FORMATTER.format(product.price);
  const productName = getProductName(product, language);
  const phoneNumber = '905467898968';
  const images = product.imageUrls.length > 0 ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  const currentImage = images[currentImageIndex] || '';
  const isValidUrl = typeof currentImage === 'string' && currentImage.startsWith('https://');
  const transformedUrl = isValidUrl ? transformCloudinaryUrl(currentImage) : '';
  const message = t('whatsapp.order_message', {
    productName,
    productImage: currentImage || product.imageUrl || '',
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

  return (
    <Card className="overflow-hidden transition-all duration-500 group h-full flex flex-col border-0 shadow-lg hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2 bg-secondary/30">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden group/image">
          {isValidUrl ? (
            <Link href={`/products/${product.id}`} className="relative block h-full group/product-card">
              <Image
                src={transformedUrl}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          {isValidUrl && images.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <CardContent className="p-4 flex-grow flex flex-col text-center">
          <CardTitle className="font-headline text-lg mt-2">{productName}</CardTitle>
          <div className="flex-grow" />
          {product.price > 0 && (
            <CardDescription className="mt-2 text-base text-accent font-bold">
              {formattedPrice.replace('$', '$ ')}
            </CardDescription>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button asChild className="w-full transition-transform duration-300 hover:scale-105">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('common.order_whatsapp')}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default memo(ProductCard);
