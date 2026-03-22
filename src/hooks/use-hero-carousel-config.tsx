'use client';

import { useMemo } from 'react';
import { doc, setDoc } from 'firebase/firestore';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import {
  HERO_CAROUSEL_DOC_ID,
  normalizeHeroCarouselConfig,
  sanitizeHeroCarouselConfig,
  type HeroCarouselConfig,
} from '@/lib/hero-carousel';

export function useHeroCarouselConfig() {
  const firestore = useFirestore();
  const carouselDoc = useMemoFirebase(() => doc(firestore, 'carousel', HERO_CAROUSEL_DOC_ID), [firestore]);
  const docResult = useDoc<Record<string, unknown>>(carouselDoc);

  const config = useMemo(() => normalizeHeroCarouselConfig(docResult.data), [docResult.data]);

  const saveConfig = async (nextConfig: HeroCarouselConfig) => {
    const payload = sanitizeHeroCarouselConfig(nextConfig);

    await setDoc(carouselDoc, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
  };

  return {
    config,
    isLoading: docResult.isLoading,
    error: docResult.error,
    saveConfig,
  };
}
