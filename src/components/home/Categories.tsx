'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import { useTranslation } from '@/lib/i18n';
import { CATEGORY_SHOWCASE_IMAGES } from '@/lib/site-config';

export default function Categories() {
  const { language, t } = useTranslation();
  const categoriesToRender = CATEGORY_SHOWCASE_IMAGES.map((category) => ({
    ...category,
    displayName: category.name[language] || category.name.tr || category.name.en || 'Category',
  }));
  const sectionCopy =
    language === 'tr'
      ? {
          kicker: 'Seckin kategoriler',
          title: 'Mekanlariniza karakter kazandiran koleksiyonlar',
          description:
            'Klasik ihtisami modern sunumla bulusturan secmelerimiz, her odada kalici bir etki birakir.',
        }
      : language === 'fr'
        ? {
            kicker: 'Categories signatures',
            title: 'Des collections qui donnent du caractere a chaque espace',
            description:
              'Nos selections marient une grandeur classique a une presentation contemporaine pour un impact durable.',
          }
        : {
            kicker: 'Signature categories',
            title: 'Collections that shape the character of every room',
            description:
              'Our curated ranges blend classical grandeur with modern presentation to leave a lasting impression.',
          };
  const categoryNotes: Record<string, string> =
    language === 'tr'
      ? {
          'cat-living-room': 'Salonlarda etkileyici bir odak noktasi',
          'cat-dining-room': 'Sofralar icin asil ve gosterisli bir sahne',
          'cat-bedroom': 'Dinlenme alanlari icin saray hissi',
        }
      : language === 'fr'
        ? {
            'cat-living-room': 'Une presence marquante pour les salons',
            'cat-dining-room': 'Une scene noble pour les repas',
            'cat-bedroom': 'Une sensation palatiale pour le repos',
          }
        : {
            'cat-living-room': 'A striking focal point for living spaces',
            'cat-dining-room': 'A noble stage for memorable dining',
            'cat-bedroom': 'A palatial mood for restful rooms',
          };
  const categoryLayout = ['md:col-span-7 md:row-span-2', 'md:col-span-5', 'md:col-span-5'];

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(214,176,102,0.16),transparent_55%)]" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">{sectionCopy.kicker}</p>
            <h2 className="section-title mt-5">{sectionCopy.title}</h2>
            <p className="section-copy mt-5 max-w-2xl">{sectionCopy.description}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.26em] text-primary/70 transition-colors hover:text-accent"
          >
            {t('home.view_all_products')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-[16rem]">
          {categoriesToRender.map((category, index) => {
            const imageUrl = buildCloudinaryImageUrl(category.imageUrl, {
              width: 960,
              height: 960,
              crop: 'fill',
              gravity: 'auto',
              quality: 'auto:eco',
            });

            return (
              <Link key={category.id} href="/products" className={categoryLayout[index]}>
                <Card className="group relative isolate h-[22rem] overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#130d09]/65 shadow-[0_28px_60px_rgba(0,0,0,0.22)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] md:h-full">
                  <div className="absolute inset-0">
                    {canUseNextImage(imageUrl) ? (
                      <Image
                        src={imageUrl}
                        alt={category.displayName}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={category.displayName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,6,4,0.12),rgba(9,6,4,0.34)_45%,rgba(9,6,4,0.82)_100%)]" />
                  <div className="absolute inset-0 border border-white/8" />

                  <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.68rem] uppercase tracking-[0.28em] text-primary/74">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-accent/82">{categoryNotes[category.id]}</p>
                      <h3 className="font-headline text-3xl font-semibold text-primary md:text-4xl">
                        {category.displayName}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
