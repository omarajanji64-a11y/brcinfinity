'use client';

import Image from 'next/image';
import Link from 'next/link';
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
  return (
    <section className="theme-surface-soft relative overflow-hidden bg-background">
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title mt-5">{sectionCopy.title}</h2>
          <p className="section-copy mt-5">{sectionCopy.description}</p>
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
                <Card className="group overflow-hidden rounded-[1.4rem] p-0">
                  <div className="relative overflow-hidden rounded-[0.75rem] border border-[rgba(193,148,79,0.18)]">
                    {canUseNextImage(imageUrl) ? (
                      <Image
                        src={imageUrl}
                        alt={category.displayName}
                        width={960}
                        height={1180}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[4/4.8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={category.displayName}
                        className="aspect-[4/4.8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.03),rgba(5,5,6,0.1)_38%,rgba(5,5,6,0.34)_100%)]" />
                  </div>

                  <div className="px-6 py-6 text-center">
                    <h3 className="font-headline text-3xl font-semibold text-primary">{category.displayName}</h3>
                    <p className="mt-3 text-sm text-primary/52">{t('home.view_all_products')}</p>
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
