'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { doc } from 'firebase/firestore';
import { Download } from 'lucide-react';

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/shared/ProductCard";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProducts } from '@/hooks/use-products';
import { buildCategoryOptions, type Product } from '@/lib/products';

type Catalog = {
  id: string;
  name: string;
  url: string;
};

type CatalogConfig = {
  catalogs: Catalog[];
};

function DownloadCatalogButton() {
    const { t } = useTranslation();
    const firestore = useFirestore();
    const catalogConfigRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'config/catalog');
    }, [firestore]);

    const { data: catalogConfig, isLoading } = useDoc<CatalogConfig>(catalogConfigRef, { realtime: false });

    if (isLoading) {
        return <Skeleton className="h-10 w-44" />;
    }

    const catalogs = catalogConfig?.catalogs?.filter(c => c.url && c.name) || [];

    if (catalogs.length === 0) {
        return (
             <Button disabled>
                <Download className="mr-2 h-4 w-4" />
                {t('header.download_catalog')}
            </Button>
        );
    }
    
    if (catalogs.length === 1) {
       return (
        <Button onClick={() => window.open(catalogs[0].url, '_blank')}>
            <Download className="mr-2 h-4 w-4" />
            {catalogs[0].name || t('header.download_catalog')}
        </Button>
       )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    {t('header.download_catalog')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {catalogs.map((catalog) => (
                    <DropdownMenuItem key={catalog.id} onClick={() => window.open(catalog.url, '_blank')}>
                        {catalog.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

type StyleFilter = 'all' | 'Modern' | 'Classic';

export default function ProductsPage() {
  const { t, language } = useTranslation();
  const { products, isLoading: isLoadingProducts } = useProducts({ realtime: false });
  const [isClient, setIsClient] = useState(false);
  const categoryOptions = useMemo(() => buildCategoryOptions(products, language, t), [language, products, t]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all');

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
      products.filter((product) => {
        const categoryMatch = activeCategory === 'all' || product.categoryKey === activeCategory;
        const styleMatch = styleFilter === 'all' || product.style === styleFilter;
        return categoryMatch && styleMatch;
      }),
    [activeCategory, products, styleFilter]
  );

  const renderProductGrid = (productsToRender: Product[]) => {
      if (isLoadingProducts) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
            ))}
          </div>
        )
      }
      if (productsToRender.length === 0) {
          return <p className="text-center text-muted-foreground col-span-full">{t('product_page.no_products')}</p>;
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsToRender.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards'}}>
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-secondary">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold animate-fade-in-up">{t('product_page.title')}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'backwards'}}>
              {t('product_page.subtitle')}
            </p>
            <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.6s', animationFillMode: 'backwards'}}>
              <DownloadCatalogButton />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12 p-2 rounded-lg bg-secondary flex flex-col md:flex-row items-center justify-between gap-4">
              <Tabs value={activeCategory} onValueChange={(value) => startTransition(() => setActiveCategory(value))} className="w-full md:w-auto">
                  <TabsList className="flex-wrap h-auto bg-transparent p-0">
                      {isClient && (
                        <>
                          <TabsTrigger value="all" className="data-[state=active]:bg-background/80 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-none rounded-md text-sm md:text-base">
                            {t('product_page.all_products')}
                          </TabsTrigger>
                          {categoryOptions.map((option) => (
                           <TabsTrigger key={option.key} value={option.key} className="data-[state=active]:bg-background/80 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-none rounded-md text-sm md:text-base">
                            {option.label}
                           </TabsTrigger>
                          ))}
                        </>
                      )}
                      {!isClient && (
                        // Render skeletons on the server and initial client render
                        <>
                          <Skeleton className="h-9 w-24 rounded-md" />
                          <Skeleton className="h-9 w-24 rounded-md" />
                          <Skeleton className="h-9 w-24 rounded-md" />
                          <Skeleton className="h-9 w-24 rounded-md" />
                        </>
                      )}
                  </TabsList>
              </Tabs>
              
               <div className="hidden md:block h-6 w-px bg-border" />

               <Tabs value={styleFilter} onValueChange={(value) => startTransition(() => setStyleFilter(value as StyleFilter))} className="w-full md:w-auto">
                    <TabsList className="bg-transparent p-0">
                        <TabsTrigger value="all" className="data-[state=active]:bg-background/80 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-none rounded-md">{t('product_page.style_all')}</TabsTrigger>
                        <TabsTrigger value="Modern" className="data-[state=active]:bg-background/80 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-none rounded-md">{t('product_page.style_modern')}</TabsTrigger>
                        <TabsTrigger value="Classic" className="data-[state=active]:bg-background/80 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-none rounded-md">{t('product_page.style_classic')}</TabsTrigger>
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
