'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase/client-provider';
import type { Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const transformCloudinaryUrl = (url: string) => {
  if (!url || !url.includes('/upload/')) {
    return url;
  }
  const parts = url.split('/upload/');
  const transformations = 'w_1200,h_900,c_fill,g_auto';
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, language } = useTranslation();
  const firestore = useFirestore();
  const productRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'products', params.id);
  }, [firestore, params.id]);

  const { data: product, isLoading, error } = useDoc<Product>(productRef);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <Skeleton className="h-[60vh] w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : (product.imageUrl ? [product.imageUrl] : []);
  const productName = product.name[language] ?? product.name.en;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);
  const phoneNumber = '905467898968';
  const message = t('whatsapp.order_message', { productName, productImage: images[0] || '' });
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];
  const transformedImage = currentImage ? transformCloudinaryUrl(currentImage) : '';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative">
            {images.length > 0 ? (
              <>
                <img
                  src={transformedImage}
                  alt={productName}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
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
                <div className="flex gap-2 justify-center mt-4">
                  {images.map((_, idx) => (
                    <div key={idx} className={`h-2 w-2 rounded-full ${idx === currentImageIndex ? 'bg-accent' : 'bg-muted-foreground'}`} />
                  ))}
                </div>
              </>
            ) : (
              <Skeleton className="w-full h-[400px]" />
            )}
          </div>
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-4">{productName}</h1>
            <div className="text-lg text-muted-foreground mb-2">{product.category[language] ?? product.category.en}</div>
            {product.price > 0 && <div className="text-xl font-bold text-accent mb-6">{formattedPrice.replace('$', '$ ')}</div>}
            <div className="mb-6">
              <div className="font-semibold mb-1">{t('product_page.description')}</div>
              <div>{product.description[language] ?? product.description.en}</div>
            </div>
            <Button asChild className="w-full mt-4">
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
