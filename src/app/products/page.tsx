'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import DownloadCatalogButton from '@/components/shared/DownloadCatalogButton';
import ProductCard from '@/components/shared/ProductCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/use-products';
import { useTranslation } from '@/lib/i18n';
import { buildCategoryOptions, type Product } from '@/lib/products';

export default function ProductsPage() {
  const { t, language } = useTranslation();
  const { products, isLoading: isLoadingProducts } = useProducts({ realtime: false });
  const [isClient, setIsClient] = useState(false);
  const categoryOptions = useMemo(() => buildCategoryOptions(products, language, t), [language, products, t]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      return;
    }

    const hasActiveCategory = categoryOptions.some((option) => option.key === activeCategory);
    if (!hasActiveCategory) {
      setActiveCategory('all');
    }
  }, [activeCategory, categoryOptions]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) => activeCategory === 'all' || product.categoryKeys.includes(activeCategory) || product.categoryKey === activeCategory
      ),
    [activeCategory, products]
  );

  const renderProductGrid = (productsToRender: Product[]) => {
    if (isLoadingProducts) {
      return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
            >
              <Card className="group flex h-full flex-col overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-square w-full" />
                </CardHeader>
                <CardContent className="flex flex-grow flex-col p-4 text-center">
                  <Skeleton className="mx-auto mt-2 h-6 w-3/4" />
                  <div className="flex-grow" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      );
    }

    if (productsToRender.length === 0) {
      return <p className="col-span-full text-center text-muted-foreground">{t('product_page.no_products')}</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {productsToRender.map((product, i) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <div className="theme-surface relative overflow-hidden bg-secondary">
          <div className="photo-veil opacity-25" />
          <div className="ambient-orb animate-float-slow left-[-5rem] top-10 h-56 w-56 sm:h-72 sm:w-72" />
          <div className="ambient-orb animate-float-slower bottom-0 right-[-5rem] h-64 w-64 sm:h-80 sm:w-80" />
          <div className="container relative mx-auto px-4 py-12 text-center">
            <h1 className="animate-fade-in-up font-headline text-4xl font-bold md:text-5xl">
              {t('product_page.title')}
            </h1>
            <p
              className="mx-auto mt-4 max-w-2xl animate-fade-in-up text-lg text-muted-foreground"
              style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
            >
              {t('product_page.subtitle')}
            </p>
            <div
              className="mt-8 animate-fade-in-up"
              style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
            >
              <DownloadCatalogButton />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="theme-panel-lift theme-panel mb-12 flex flex-col items-center justify-between gap-4 rounded-[1.4rem] bg-secondary p-3 md:flex-row">
            <Tabs
              value={activeCategory}
              onValueChange={(value) => startTransition(() => setActiveCategory(value))}
              className="w-full md:w-auto"
            >
              <TabsList className="h-auto flex-wrap bg-transparent p-0">
                {isClient && (
                  <>
                    <TabsTrigger
                      value="all"
                      className="rounded-md text-sm text-muted-foreground transition-none hover:text-foreground data-[state=active]:bg-background/80 data-[state=active]:text-foreground md:text-base"
                    >
                      {t('product_page.all_products')}
                    </TabsTrigger>
                    {categoryOptions.map((option) => (
                      <TabsTrigger
                        key={option.key}
                        value={option.key}
                        className="rounded-md text-sm text-muted-foreground transition-none hover:text-foreground data-[state=active]:bg-background/80 data-[state=active]:text-foreground md:text-base"
                      >
                        {option.label}
                      </TabsTrigger>
                    ))}
                  </>
                )}
                {!isClient && (
                  <>
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </>
                )}
              </TabsList>
            </Tabs>
          </div>

          {renderProductGrid(filteredProducts)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
