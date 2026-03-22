'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader } from '../ui/card';

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { products, isLoading: isLoadingProducts } = useProducts();
  
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="bg-secondary/20">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-center font-headline text-4xl font-bold mb-4">{t('home.featured_products')}</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingProducts ? (
             [...Array(3)].map((_, i) => (
              <div key={i} className="animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards'}}>
                <Card className="overflow-hidden transition-all duration-300 group h-full flex flex-col border-0 shadow-none bg-transparent">
                    <CardHeader className="p-0">
                        <Skeleton className="aspect-square w-full" />
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col text-center">
                        <Skeleton className="h-6 w-3/4 mx-auto mt-2" />
                        <div className='flex-grow' />
                        <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
                    </CardContent>
                </Card>
              </div>
            ))
          ) : (
            featuredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards'}}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="transition-transform duration-300 hover:scale-105">
            <Link href="/products">
              {t('home.view_all_products')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
