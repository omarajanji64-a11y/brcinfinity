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
          kicker: 'One cikan secimler',
          description:
            'BRC Infinity dunyasini ilk bakista hissettiren ozel seckiyi burada gorun.',
        }
      : language === 'fr'
        ? {
            kicker: 'Selection en vedette',
            description: 'Decouvrez une selection qui resume instantanement l univers BRC Infinity.',
          }
        : {
            kicker: 'Featured selection',
            description: 'Explore a curated edit that captures the BRC Infinity world at a glance.',
          };

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-secondary/20">
      <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_center,rgba(214,176,102,0.12),transparent_55%)]" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">{sectionCopy.kicker}</p>
            <h2 className="section-title mt-5">{t('home.featured_products')}</h2>
            <p className="section-copy mt-5 max-w-2xl">{sectionCopy.description}</p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-white/14 bg-white/[0.04] px-6 text-[0.74rem] uppercase tracking-[0.26em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
          >
            <Link href="/products">
              {t('home.view_all_products')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingProducts ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
              >
                <Card className="h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#130d09]/65 shadow-none">
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
              <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards'}}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
