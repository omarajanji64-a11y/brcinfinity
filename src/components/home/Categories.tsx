'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import { useTranslation } from '@/lib/i18n';
import { CATEGORY_SHOWCASE_IMAGES } from '@/lib/site-config';

export default function Categories() {
  const { language } = useTranslation();
  const categoriesToRender = CATEGORY_SHOWCASE_IMAGES.map((category) => ({
    ...category,
    displayName: category.name[language] || category.name.tr || category.name.en || 'Category',
  }));

  return (
    <div className="theme-surface-soft bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categoriesToRender.map((category) => (
            <Link key={category.id} href="/products">
              <Card className="group relative overflow-hidden rounded-lg border-none shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10">
                <div className="relative aspect-w-1 aspect-h-1 h-80 w-full overflow-hidden">
                  {canUseNextImage(
                    buildCloudinaryImageUrl(category.imageUrl, {
                      width: 640,
                      height: 640,
                      crop: 'fill',
                      gravity: 'auto',
                      quality: 'auto:eco',
                    })
                  ) ? (
                    <Image
                      src={buildCloudinaryImageUrl(category.imageUrl, {
                        width: 640,
                        height: 640,
                        crop: 'fill',
                        gravity: 'auto',
                        quality: 'auto:eco',
                      })}
                      alt={category.displayName}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={buildCloudinaryImageUrl(category.imageUrl, {
                        width: 640,
                        height: 640,
                        crop: 'fill',
                        gravity: 'auto',
                        quality: 'auto:eco',
                      })}
                      alt={category.displayName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-headline text-2xl font-bold text-white">{category.displayName}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
