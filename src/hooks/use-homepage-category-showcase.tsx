'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import {
  HOMEPAGE_SETTINGS_COLLECTION,
  HOMEPAGE_SETTINGS_DOC,
  mergeHomepageCategoryShowcaseImages,
} from '@/lib/homepage';
import type { CategoryImage } from '@/lib/site-config';

type HomepageSettingsDocument = {
  categoryShowcaseImages?: unknown;
};

export function useHomepageCategoryShowcase() {
  const firestore = useFirestore();
  const homepageSettingsDoc = useMemoFirebase(
    () => doc(firestore, HOMEPAGE_SETTINGS_COLLECTION, HOMEPAGE_SETTINGS_DOC),
    [firestore]
  );
  const { data, isLoading, error } = useDoc<HomepageSettingsDocument>(homepageSettingsDoc);

  const categoryShowcaseImages = useMemo<CategoryImage[]>(
    () => mergeHomepageCategoryShowcaseImages(data?.categoryShowcaseImages),
    [data]
  );

  return {
    categoryShowcaseImages,
    isLoading,
    error,
  };
}
