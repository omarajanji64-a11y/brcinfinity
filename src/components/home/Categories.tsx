
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useTranslation, type Language } from '@/lib/i18n';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '../ui/skeleton';
import { doc } from 'firebase/firestore';

type LocalizedString = {
  en: string;
  fr: string;
  tr: string;
}

type CategoryImage = {
  id: string;
  name: LocalizedString;
  imageUrl: string;
  imageHint?: string;
};

type HomepageConfig = {
  categoryImages: CategoryImage[];
}

const defaultCategoryImages: CategoryImage[] = [
    { id: 'cat-living-room', name: { en: 'Living Room', fr: 'Salon', tr: 'Oturma Odası' }, imageUrl: 'https://picsum.photos/seed/cat-living/600/600' },
    { id: 'cat-dining-room', name: { en: 'Dining Room', fr: 'Salle à manger', tr: 'Yemek Odası' }, imageUrl: 'https://picsum.photos/seed/cat-dining/600/600' },
    { id: 'cat-bedroom', name: { en: 'Bedroom', fr: 'Chambre', tr: 'Yatak Odası' }, imageUrl: 'https://picsum.photos/seed/cat-bedroom/600/600' },
];

const transformCloudinaryUrl = (url: string) => {
    if (!url || !url.includes('/upload/')) {
        return url;
    }
    const parts = url.split('/upload/');
    const transformations = 'w_600,h_600,c_fill,g_auto';
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}


export default function Categories() {
  const { t, language } = useTranslation();
  const firestore = useFirestore();

  const homepageConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/homepage');
  }, [firestore]);

  const { data: homepageConfig, isLoading } = useDoc<HomepageConfig>(homepageConfigRef);

  const categoriesSource = (homepageConfig?.categoryImages && homepageConfig.categoryImages.length > 0) 
    ? homepageConfig.categoryImages 
    : defaultCategoryImages;

  const validCategories = categoriesSource
    .filter(cat => cat && typeof cat.imageUrl === 'string' && cat.imageUrl.startsWith('https://'))
    .map(cat => ({
      ...cat,
      displayName: cat.name?.[language as Language] || cat.name?.tr || 'Category',
    }));


  if (isLoading) {
      return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {validCategories.map((category) => (
            <Link key={category.id} href="/products">
              <Card className="relative group overflow-hidden rounded-lg border-none shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden h-80 relative">
                  <img
                    src={transformCloudinaryUrl(category.imageUrl)}
                    alt={category.displayName}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={category.imageHint}
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
