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
  const { t, language } = useTranslation();
  const { products, isLoading: isLoadingProducts } = useProducts({ realtime: false });
  const featuredProducts = products.slice(0, 3);
  const sectionCopy =
    language === 'tr'
      ? {
          kicker: 'Seckin urunler',
          description:
            'Klasik mobilya anlayisimizi en iyi yansitan secili takimlari burada kesfedin.',
        }
      : language === 'fr'
        ? {
            kicker: 'Pieces choisies',
            description: 'Decouvrez des ensembles qui expriment pleinement notre vision du mobilier classique.',
          }
        : {
            kicker: 'Selected pieces',
            description: 'Explore pieces that best represent our interpretation of classical furniture.',
          };

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-secondary/20">
      <div className="photo-veil opacity-15" />
      <div className="ambient-orb animate-float-slower right-[-5rem] top-12 h-64 w-64" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker animate-reveal justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title animate-reveal animate-reveal-delay-1 mt-5">{t('home.featured_products')}</h2>
          <p className="section-copy animate-reveal animate-reveal-delay-2 mt-5">{sectionCopy.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingProducts ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
              >
                <Card className="h-full overflow-hidden rounded-[1.4rem] shadow-none">
                  <CardHeader className="p-0">
                    <Skeleton className="aspect-[4/4.35] w-full" />
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col gap-4 p-5">
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex-grow" />
                    <Skeleton className="h-12 w-full rounded-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            featuredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        <div className="animate-reveal animate-reveal-delay-3 mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 px-7 text-[0.74rem] tracking-[0.16em]">
            <Link href="/products">
              {t('home.view_all_products')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
