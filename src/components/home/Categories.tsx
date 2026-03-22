'use client';

import Link from 'next/link';
import { doc } from 'firebase/firestore';

import { Card } from '@/components/ui/card';
import { useTranslation, type Language } from '@/lib/i18n';
import { normalizeCategoryKey } from '@/lib/products';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '../ui/skeleton';

type LocalizedString = Partial<Record<Language, string>>;

type CategoryImage = {
  id: string;
  name: LocalizedString;
  imageUrl: string;
  imageHint?: string;
};

type HomepageConfig = {
  categoryImages: CategoryImage[];
};

const defaultCategoryImages: CategoryImage[] = [
  {
    id: 'cat-living-room',
    name: { en: 'Living Room', fr: 'Salon', tr: 'Oturma Odas\u0131' },
    imageUrl: 'https://picsum.photos/seed/cat-living/600/600',
    imageHint: 'living room',
  },
  {
    id: 'cat-dining-room',
    name: { en: 'Dining Room', fr: 'Salle \u00e0 manger', tr: 'Yemek Odas\u0131' },
    imageUrl: 'https://picsum.photos/seed/cat-dining/600/600',
    imageHint: 'dining room',
  },
  {
    id: 'cat-bedroom',
    name: { en: 'Bedroom', fr: 'Chambre', tr: 'Yatak Odas\u0131' },
    imageUrl: 'https://picsum.photos/seed/cat-bedroom/600/600',
    imageHint: 'bedroom furniture',
  },
];

const transformCloudinaryUrl = (url: string) => {
  if (!url || !url.includes('/upload/')) {
    return url;
  }

  const parts = url.split('/upload/');
  const transformations = 'w_600,h_600,c_fill,g_auto';
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

const getCategoryLookupValue = (category: CategoryImage) =>
  category.id ||
  category.name?.tr ||
  category.name?.en ||
  category.name?.fr ||
  '';

export default function Categories() {
  const { language } = useTranslation();
  const firestore = useFirestore();

  const homepageConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/homepage');
  }, [firestore]);

  const { data: homepageConfig, isLoading } = useDoc<HomepageConfig>(homepageConfigRef, { realtime: false });

  const configuredCategoryMap = new Map<string, CategoryImage>();

  for (const category of homepageConfig?.categoryImages ?? []) {
    const categoryKey = normalizeCategoryKey(getCategoryLookupValue(category));
    configuredCategoryMap.set(categoryKey, category);
  }

  const categoriesToRender = defaultCategoryImages.map((defaultCategory) => {
    const categoryKey = normalizeCategoryKey(defaultCategory.id);
    const configuredCategory = configuredCategoryMap.get(categoryKey);
    const name = { ...defaultCategory.name, ...(configuredCategory?.name ?? {}) };

    return {
      id: defaultCategory.id,
      imageUrl:
        configuredCategory?.imageUrl && configuredCategory.imageUrl.startsWith('https://')
          ? configuredCategory.imageUrl
          : defaultCategory.imageUrl,
      imageHint: configuredCategory?.imageHint || defaultCategory.imageHint,
      displayName: name[language] || name.tr || name.en || 'Category',
    };
  });

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categoriesToRender.map((category) => (
            <Link key={category.id} href="/products">
              <Card className="relative group overflow-hidden rounded-lg border-none shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10">
                <div className="relative h-80 w-full overflow-hidden aspect-w-1 aspect-h-1">
                  <img
                    src={transformCloudinaryUrl(category.imageUrl)}
                    alt={category.displayName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={category.imageHint}
                    loading="lazy"
                    decoding="async"
                  />
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
