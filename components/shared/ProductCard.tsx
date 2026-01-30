'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardProps {
  product: Product;
}

const transformCloudinaryUrl = (url: string) => {
  if (!url || !url.includes('/upload/')) return url;
  const parts = url.split('/upload/');
  return `${parts[0]}/upload/w_600,h_600,c_fill,g_auto/${parts[1]}`;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useTranslation();

  const productName = product.name[language] ?? product.name.en;

  const showPrice =
    typeof product.price === 'number' && product.price > 0;

  const formattedPrice = showPrice
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(product.price!)
    : null;

  const phoneNumber = '905467898968';
  const message = t('whatsapp.order_message', {
    productName,
    productImage: product.imageUrl || '',
  });

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const isValidUrl =
    typeof product.imageUrl === 'string' &&
    product.imageUrl.startsWith('https://');

  const imageUrl = isValidUrl
    ? transformCloudinaryUrl(product.imageUrl)
    : '';

  return (
    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-lg hover:shadow-xl transition">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          {isValidUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow text-center">
        <CardTitle className="text-lg font-headline">
          {productName}
        </CardTitle>

        {showPrice && (
          <CardDescription className="mt-2 font-bold text-accent">
            {formattedPrice!.replace('$', '$ ')}
          </CardDescription>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('common.order_whatsapp')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
