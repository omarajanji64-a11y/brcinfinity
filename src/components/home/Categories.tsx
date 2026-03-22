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
          kicker: 'Klasik kategoriler',
          title: 'Klasik yasam alanlari icin seckin koleksiyonlar',
          description:
            'Salon, yemek odasi ve yatak odasi icin hazirlanan secmelerimiz; oyma, varak ve zamansiz oranlarla klasik bir butunluk kurar.',
        }
      : language === 'fr'
        ? {
            kicker: 'Categories classiques',
            title: 'Des collections raffinees pour des interieurs classiques',
            description:
              'Salon, salle a manger et chambre trouvent une harmonie classique a travers la sculpture, la dorure et des proportions intemporelles.',
          }
        : {
            kicker: 'Classic categories',
            title: 'Refined collections for classical interiors',
            description:
              'Living, dining, and bedroom pieces come together through carving, gilding, and timeless proportions.',
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

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(214,176,102,0.16),transparent_55%)]" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title mt-5">{sectionCopy.title}</h2>
          <p className="section-copy mt-5">{sectionCopy.description}</p>
          <div className="classic-divider mx-auto mt-7 max-w-[10rem]" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categoriesToRender.map((category) => {
            const imageUrl = buildCloudinaryImageUrl(category.imageUrl, {
              width: 960,
              height: 1180,
              crop: 'fill',
              gravity: 'auto',
              quality: 'auto:eco',
            });

            return (
              <Link key={category.id} href="/products">
                <Card className="group rounded-[1rem] p-4 md:p-5">
                  <div className="relative overflow-hidden rounded-[0.75rem] border border-[rgba(193,148,79,0.18)]">
                    <div className="absolute left-4 top-4 z-10 rounded-[0.4rem] border border-[rgba(193,148,79,0.25)] bg-[rgba(46,29,18,0.86)] px-3 py-1 text-[0.66rem] uppercase tracking-[0.22em] text-accent/88">
                      {categoryNotes[category.id]}
                    </div>
                    {canUseNextImage(imageUrl) ? (
                      <Image
                        src={imageUrl}
                        alt={category.displayName}
                        width={960}
                        height={1180}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={category.displayName}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,8,0.06),rgba(20,12,8,0.1)_40%,rgba(20,12,8,0.5)_100%)]" />
                  </div>

                  <div className="px-3 pb-2 pt-6 text-center">
                    <h3 className="font-headline text-3xl font-semibold text-primary">{category.displayName}</h3>
                    <div className="classic-divider mx-auto mt-4 max-w-[7rem]" />
                    <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-accent/86">
                      {t('home.view_all_products')}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary/72 transition-colors hover:text-accent"
          >
            {t('home.view_all_products')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
