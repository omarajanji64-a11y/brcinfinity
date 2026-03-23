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
          kicker: 'Seçkin ürünler',
          description:
            'Klasik mobilya anlayışımızı en iyi yansıtan seçili takımları burada keşfedin.',
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
  const featuredNotes =
    language === 'tr'
      ? [
          { label: 'Seçki anlayışı', value: 'Editoryal', note: 'Marka dilini en net taşıyan parçalar' },
          { label: 'Detay seviyesi', value: 'Yüksek', note: 'Oyma, varak ve yüzey geçişlerinde rafine işçilik' },
          { label: 'İletişim akışı', value: 'Hızlı', note: 'WhatsApp ve showroom üzerinden doğrudan yönlendirme' },
        ]
      : language === 'fr'
        ? [
            { label: 'Selection', value: 'Editoriale', note: 'Les pieces qui representent le mieux la marque' },
            { label: 'Detail', value: 'Eleve', note: 'Sculpture, dorure et finitions plus soignées' },
            { label: 'Contact', value: 'Direct', note: 'Prise de contact rapide via WhatsApp et showroom' },
          ]
        : [
            { label: 'Selection mode', value: 'Editorial', note: 'Pieces that express the brand most clearly' },
            { label: 'Detail level', value: 'High', note: 'Refined carving, gilding, and surface transitions' },
            { label: 'Contact flow', value: 'Direct', note: 'Fast outreach through WhatsApp and showroom support' },
          ];

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-secondary/20">
      <div className="section-spotlight" />
      <div className="photo-veil opacity-15" />
      <div className="ambient-orb animate-float-slower right-[-5rem] top-12 h-64 w-64" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="section-frame mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker animate-reveal justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title animate-reveal animate-reveal-delay-1 mt-5">{t('home.featured_products')}</h2>
          <p className="section-copy animate-reveal animate-reveal-delay-2 mt-5">{sectionCopy.description}</p>
        </div>

        <div className="mx-auto mb-12 grid max-w-5xl gap-3 md:grid-cols-3">
          {featuredNotes.map((item, index) => (
            <div
              key={item.label}
              className="metric-card animate-fade-in-up text-center md:text-left"
              style={{ animationDelay: `${0.08 + index * 0.08}s` }}
            >
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-primary/46">{item.label}</p>
              <p className="mt-3 font-headline text-[1.85rem] font-semibold text-primary">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-primary/56">{item.note}</p>
            </div>
          ))}
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
