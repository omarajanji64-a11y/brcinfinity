'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { useHomepageCategoryShowcase } from '@/hooks/use-homepage-category-showcase';
import { buildCloudinaryImageUrl, canUseNextImage } from '@/lib/image-utils';
import { useTranslation } from '@/lib/i18n';

export default function Categories() {
  const { language, t } = useTranslation();
  const { categoryShowcaseImages } = useHomepageCategoryShowcase({ realtime: false });

  const categoriesToRender = categoryShowcaseImages.map((category) => ({
    ...category,
    displayName: category.name[language] || category.name.tr || category.name.en || 'Category',
  }));

  const sectionCopy =
    language === 'tr'
      ? {
          kicker: 'Klasik kategoriler',
          title: 'Klasik yaşam alanları için seçkin koleksiyonlar',
          description:
            'Salon, yemek odası ve yatak odası için hazırlanan seçmelerimiz; oyma, varak ve zamansız oranlarla klasik bir bütünlük kurar.',
        }
      : language === 'fr'
        ? {
            kicker: 'Catégories classiques',
            title: 'Des collections raffinées pour des intérieurs classiques',
            description:
              'Salon, salle à manger et chambre trouvent une harmonie classique à travers la sculpture, la dorure et des proportions intemporelles.',
          }
        : {
            kicker: 'Classic categories',
            title: 'Refined collections for classical interiors',
            description:
              'Living, dining, and bedroom pieces come together through carving, gilding, and timeless proportions.',
          };

  const categoryDescriptions =
    language === 'tr'
      ? {
          'living-room': 'Geniş oturumlar, oyma detaylar ve gösterişli salon dili bir araya gelir.',
          'dining-room': 'Davet sofraları için güçlü oranlar ve zengin yüzey geçişleri sunar.',
          bedroom: 'Daha sakin ama etkileyici bir klasik atmosfer için tasarlanır.',
        }
      : language === 'fr'
        ? {
            'living-room': 'Des assises généreuses, des détails sculptés et une présence plus majestueuse.',
            'dining-room': 'Des proportions fortes et des surfaces riches pour des mises en scène raffinées.',
            bedroom: 'Une ambiance plus calme mais toujours imposante pour la chambre classique.',
          }
        : {
            'living-room': 'Generous seating, carved details, and a stronger salon presence.',
            'dining-room': 'Bold proportions and richer surfaces for memorable hosting settings.',
            bedroom: 'A calmer yet still striking interpretation of the classical bedroom.',
          };

  const sectionMetrics =
    language === 'tr'
      ? [
          { label: 'Koleksiyon dili', value: 'Klasik', note: 'Tutarlı oran ve detay yaklaşımı' },
          { label: 'Üretim yaklaşımı', value: 'Özel', note: 'Projeye göre daha seçkin çözümler' },
          { label: 'Sunum noktası', value: 'Masko', note: 'Showroom incelemesi ve yönlendirme' },
        ]
      : language === 'fr'
        ? [
            { label: 'Langage', value: 'Classique', note: 'Une direction visuelle cohérente' },
            { label: 'Production', value: 'Sur mesure', note: 'Des solutions adaptées au projet' },
            { label: 'Showroom', value: 'Masko', note: 'Visite et accompagnement sur place' },
          ]
        : [
            { label: 'Collection style', value: 'Classical', note: 'A coherent proportion and detail language' },
            { label: 'Production', value: 'Tailored', note: 'More selective solutions for each project' },
            { label: 'Showroom', value: 'Masko', note: 'On-site review and guidance' },
          ];

  const collectionBadge =
    language === 'tr' ? 'Seçili seri' : language === 'fr' ? 'Série choisie' : 'Selected series';

  return (
    <section className="theme-surface-soft relative overflow-hidden bg-background">
      <div className="section-spotlight" />
      <div className="photo-veil opacity-20" />
      <div className="ambient-orb animate-float-slow left-[-5rem] top-20 h-56 w-56" />
      <div className="container relative mx-auto px-4 py-20 md:py-24">
        <div className="section-frame mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker animate-reveal justify-center">{sectionCopy.kicker}</p>
          <h2 className="section-title animate-reveal animate-reveal-delay-1 mt-5">{sectionCopy.title}</h2>
          <p className="section-copy animate-reveal animate-reveal-delay-2 mt-5">{sectionCopy.description}</p>
        </div>

        <div className="mx-auto mb-12 grid max-w-5xl gap-3 sm:grid-cols-3">
          {sectionMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="metric-card animate-fade-in-up text-center sm:text-left"
              style={{ animationDelay: `${0.06 + index * 0.08}s` }}
            >
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-primary/46">{metric.label}</p>
              <p className="mt-3 font-headline text-[1.85rem] font-semibold text-primary">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-primary/56">{metric.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categoriesToRender.map((category, index) => {
            const imageUrl = buildCloudinaryImageUrl(category.imageUrl, {
              width: 960,
              height: 1180,
              crop: 'fill',
              gravity: 'auto',
              quality: 'auto:eco',
            });
            const categoryDescription =
              categoryDescriptions[category.id as keyof typeof categoryDescriptions] ||
              categoryDescriptions['living-room'];

            return (
              <Link
                key={category.id}
                href="/products"
                className="group animate-reveal block"
                style={{ animationDelay: `${0.12 + index * 0.1}s` }}
              >
                <Card className="theme-panel-lift card-sheen group overflow-hidden rounded-[1.55rem] p-0">
                  <div className="relative overflow-hidden rounded-[0.95rem] border border-[rgba(193,148,79,0.18)]">
                    {canUseNextImage(imageUrl) ? (
                      <Image
                        src={imageUrl}
                        alt={category.displayName}
                        width={960}
                        height={1180}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[4/4.8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={category.displayName}
                        className="aspect-[4/4.8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,6,0.04),rgba(5,5,6,0.12)_32%,rgba(5,5,6,0.62)_100%)]" />
                    <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                      <span className="glass-badge text-[0.66rem] uppercase tracking-[0.18em] text-primary/70">
                        0{index + 1}
                      </span>
                      <span className="glass-badge glass-badge-strong text-[0.66rem] uppercase tracking-[0.18em] text-primary/76">
                        {collectionBadge}
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/32 p-4 backdrop-blur-md">
                        <h3 className="font-headline text-[2rem] font-semibold leading-tight text-primary">
                          {category.displayName}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-primary/58">{categoryDescription}</p>
                        <div className="mt-4 inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.16em] text-primary/72">
                          {t('home.view_all_products')}
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
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
